import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }
  async create(data: Partial<User>) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        password: data.password,
      },
    });
  }
}
