import { Controller, Post, Body, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { ValidationPipe } from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { LoginUserDto } from 'src/auth/dto/loginUser.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ) {}

    @Post('login')
    login(@Body(ValidationPipe) loginUserInput: LoginUserDto) {
        return this.authService.loginUser(loginUserInput)
    }

    @Post('register')
    create(@Body(ValidationPipe) registerUserInput: RegisterUserDto) {
        return this.usersService.createNewUser(registerUserInput)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('update/:id')
    updateUser(@Param('id') id: number, @Body(ValidationPipe) updateUserInput: UpdateUserDto) {
        return this.usersService.updateUser(+id, updateUserInput)
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile/:id')
    getUserProfile(@Param('id') id: number) {
        return this.usersService.findById(+id)
    }
}
