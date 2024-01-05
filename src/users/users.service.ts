import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

// This should be a real class/interface representing a user entity
export type User = {
  userId: number;
  username: string;
  password: string;
};

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
}
