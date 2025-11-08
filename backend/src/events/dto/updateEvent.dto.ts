import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateEventDto {
    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    @IsOptional()
    event_date?: string;

    @IsString()
    @IsOptional()
    event_time?: string;
}
