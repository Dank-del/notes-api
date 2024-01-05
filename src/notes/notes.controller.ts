import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('notes')
@Controller('notes')
@UseGuards(JwtAuthGuard, ThrottlerGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(@Request() req, @Body() createNoteDto: CreateNoteDto) {
    console.log(req.user);
    return await this.notesService.create(createNoteDto, req.user.userId);
  }

  @Get('/shared')
  async getSharedNotes(@Request() req) {
    console.log(req.user);
    return await this.notesService.getSharedNotes(req.user.userId);
  }

  @Get('/search')
  async search(
    @Request() req,
    @Query('query') query: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ) {
    return await this.notesService.search(
      query,
      req.user.userId,
      page,
      pageSize,
    );
  }

  @Get()
  async findAll(
    @Request() req,
    @Query('page') page?,
    @Query('pageSize') pageSize?,
  ) {
    return await this.notesService.findAll(
      req.user.id,
      page || 1,
      pageSize || 10,
    );
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return await this.notesService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return await this.notesService.update(+id, updateNoteDto, req.user.userId);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return await this.notesService.remove(+id, req.user.userId);
  }

  @Post(':noteId/share/:userId')
  async shareNote(
    @Param('noteId', ParseIntPipe) noteId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req,
  ): Promise<void> {
    const note = await this.notesService.findOne(noteId, req.user.userId);
    await this.notesService.shareNote(note.id, userId);
  }
}
