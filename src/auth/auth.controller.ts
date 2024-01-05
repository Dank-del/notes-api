import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import SignUpDto from './dto/sign-up-dto';
import SignInDto from './dto/sign-in-dto';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { JwtAuthGuard } from './jwt-auth-guard';
import { ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('api/auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req, @Body() body: SignInDto) {
    console.log(body);
    const user = req.user as Partial<User>;
    return this.authService.login({
      username: user.username,
      id: user.id,
    });
  }
  @Post('/signup')
  async register(@Request() req, @Body() body: SignUpDto) {
    return this.authService.signUp(body.username, body.password, body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
