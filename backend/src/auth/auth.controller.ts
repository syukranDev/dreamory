import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/loginUser.dto';
import { RegisterUserDto } from '../users/dto/registerUser.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.loginUser(loginUserDto);
    }

    @Post('signup')
    async signup(@Body() registerUserDto: RegisterUserDto) {
        return this.usersService.createNewUser(registerUserDto);
    }
}
