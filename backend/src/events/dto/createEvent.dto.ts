import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    location: string;

    @IsString()
    @IsOptional()
    imageUrl: string;

    @IsString()
    status?: string;

    @IsDateString()
    @IsNotEmpty()
    event_date: string;

    @IsString()
    @IsNotEmpty()
    event_time: string;
}
