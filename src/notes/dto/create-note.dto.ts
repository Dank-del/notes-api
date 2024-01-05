import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateNoteDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  title: string;
  @IsNotEmpty()
  @MinLength(10)
  @ApiProperty()
  content: string;
}
