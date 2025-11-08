import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async createNewUser(registerUserInput: RegisterUserDto) {
        const existingEmail = await this.prisma.user.findUnique({
            where: { email: registerUserInput.email }
        });
        
        if (existingEmail) throw new ConflictException('Email already exists');

        const hashedPassword = await bcrypt.hash(registerUserInput.password, 10);

        const user = await this.prisma.user.create({
            data: {
                fullName: registerUserInput.fullName,
                email: registerUserInput.email,
                password: hashedPassword,
                // profileImageUrl: ''
            }
        });

        const { password, ...result } = user;
        return result;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email }
        });
    }

    async findById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        
        if (!user) throw new NotFoundException('User not found');
        
        const { password, ...result } = user;
        return result;
    }

    async updateUser(id: number, updateUserInput: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });

        if (!user) throw new NotFoundException('User not found');

        const updateData: any = {};

        if (updateUserInput.fullName) updateData.fullName = updateUserInput.fullName;
        if (updateUserInput.email) {
            const existingEmail = await this.prisma.user.findUnique({
                where: { email: updateUserInput.email }
            });
            if (existingEmail && existingEmail.id !== id) {
                throw new ConflictException('Email already exists');
            }
            updateData.email = updateUserInput.email;
        }
        if (updateUserInput.password) {
            updateData.password = await bcrypt.hash(updateUserInput.password, 10);
        }
        if (updateUserInput.profileImageUrl !== undefined) {
            updateData.profileImageUrl = updateUserInput.profileImageUrl;
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData
        });

        const { password, ...result } = updatedUser;
        return result;
    }
}
