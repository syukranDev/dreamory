import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/loginUser.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/loginResp.dto';
import { RegisterUserDto } from '../users/dto/registerUser.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwt: JwtService
    ) {}

    async loginUser(loginUserInput: LoginUserDto): Promise<LoginResponseDto> {
        const user = await this.usersService.findByEmail(loginUserInput.email);
        if (!user) throw new UnauthorizedException('Invalid email or password');

        const isPasswordValid = await bcrypt.compare(loginUserInput.password, user.password);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

        const payload = {
            sub: user.id,
            email: user.email,
            fullName: user.fullName
        };

        const { password, ...userWithoutPassword } = user;

        return {
            token: this.jwt.sign(payload),
            user: userWithoutPassword
        };
    }

    async signup(registerUserInput: RegisterUserDto): Promise<LoginResponseDto> {
        const newUser = await this.usersService.createNewUser(registerUserInput);
        
        const payload = {
            sub: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName
        };

        return {
            token: this.jwt.sign(payload),
            user: newUser
        };
    }

    async getAuthenticatedUser(userId: number) {
        return this.usersService.findById(userId);
    }
}
