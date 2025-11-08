import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateEventDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsDateString()
    @IsNotEmpty()
    event_date: string;

    @IsString()
    @IsNotEmpty()
    event_time: string;
}
