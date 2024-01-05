import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createNoteDto: CreateNoteDto, userId: number) {
    return await this.prisma.note.create({
      data: {
        authorId: userId,
        title: createNoteDto.title,
        content: createNoteDto.content,
      },
    });
  }

  async findAll(userId: number, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const totalCount = await this.prisma.note.count({
      where: {
        authorId: userId,
      },
    });
    const totalPages = Math.ceil(totalCount / pageSize);

    const notes = await this.prisma.note.findMany({
      where: {
        authorId: userId,
      },
      select: {
        id: true,
        title: true,
      },
      skip,
      take: pageSize,
    });

    return {
      notes,
      page,
      totalPages,
    };
  }

  async search(query: string, userId: number, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const notes = await this.prisma.note.findMany({
      where: {
        authorId: userId,
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            content: {
              contains: query,
            },
          },
        ],
      },
      skip,
      take: pageSize,
    });
    const sharedNotes = await this.prisma.share.findMany({
      where: {
        sharedUser: {
          id: userId,
        },
        note: {
          title: {
            contains: query,
          },
        },
      },
      select: {
        note: true,
      },
      skip,
      take: pageSize,
    });

    const mergedNotesResult = [...notes, ...sharedNotes.map((s) => s.note)];
    const uniqueNotes = mergedNotesResult.filter(
      (note, index, self) => index === self.findIndex((t) => t.id === note.id),
    );
    return {
      notes: uniqueNotes,
      count: uniqueNotes.length,
      page: page,
    };
  }

  async findOne(id: number, userId: number) {
    const note = await this.prisma.note.findUnique({
      where: {
        id,
        authorId: userId,
      },
    });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, userId: number) {
    const note = await this.findOne(id, userId);
    return await this.prisma.note.update({
      where: {
        id: note.id,
        authorId: note.authorId,
      },
      data: {
        title: updateNoteDto.title,
        content: updateNoteDto.content,
      },
    });
  }

  async remove(id: number, userId: number) {
    const note = await this.findOne(id, userId);
    return await this.prisma.note.delete({
      where: {
        id: note.id,
        authorId: note.authorId,
      },
    });
  }

  async shareNote(noteId: number, userId: number): Promise<void> {
    // Check if the note exists
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }

    // Check if the note is already shared with the user
    const existingShare = await this.prisma.share.findFirst({
      where: { noteId, userId },
    });

    if (!existingShare) {
      // Share the note with the user
      await this.prisma.share.create({
        data: {
          note: { connect: { id: noteId } },
          sharedUser: { connect: { id: userId } },
        },
      });
    }
  }

  async getSharedNotes(userId: number) {
    // Get notes shared with the user
    return this.prisma.share.findMany({
      where: {
        sharedUser: {
          id: userId,
        },
      },
      select: {
        note: true,
      },
    });
  }
}
