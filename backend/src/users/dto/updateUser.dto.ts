import { IsString, IsOptional, IsEmail, MinLength, MaxLength, IsUrl } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    fullName?: string;

    @IsEmail({}, { message: 'Please provide a valid email format with @' })
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(8, { message: 'Password should be at least 8 characters long' })
    @MaxLength(20, { message: 'Password should be less than 20 characters' })
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    @IsUrl({}, { message: 'Profile image URL must be a valid URL' })
    profileImageUrl?: string;
}

