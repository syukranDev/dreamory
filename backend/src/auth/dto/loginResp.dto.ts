import { User } from "@prisma/client";

export class LoginResponseDto {
    token: string;
    user: Omit<User, 'password'>;
}