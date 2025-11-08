import { IsString, IsEmail, MinLength, MaxLength, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class RegisterUserDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsEmail({}, { message: 'Please provide a valid email format with @' })
    @IsNotEmpty()
    email: string;

    @IsString()
    @MinLength(8, { message: 'Password should be at least 8 characters long' })
    @MaxLength(20, { message: 'Password should be less than 20 characters' })
    password: string;

    @IsString()
    @IsOptional()
    @IsUrl({}, { message: 'Profile image URL must be a valid URL' })
    profileImageUrl?: string;
}


