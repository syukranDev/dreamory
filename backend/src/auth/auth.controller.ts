import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterUserDto } from '../users/dto/registerUser.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.loginUser(loginUserDto);
    }

    @Post('signup')
    async signup(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.signup(registerUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Req() req: Request) {
        const user = req.user as { id: number };
        return this.authService.getAuthenticatedUser(user.id);
    }
}
