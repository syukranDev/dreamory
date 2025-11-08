import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/createEvent.dto';
import { UpdateEventDto } from './dto/updateEvent.dto';

@Injectable()
export class EventsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createEventDto: CreateEventDto) {
        return this.prisma.event.create({
            data: {
                title: createEventDto.title,
                description: createEventDto.description,
                location: createEventDto.location,
                imageUrl: createEventDto.imageUrl ?? null,
                status: createEventDto.status ?? 'ongoing',
                eventDate: new Date(createEventDto.event_date),
                eventTime: createEventDto.event_time,
            }
        });
    }

    async findAll() {
        return this.prisma.event.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: number) {
        const event = await this.prisma.event.findUnique({
            where: { id }
        });
        
        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }
        
        return event;
    }

    async update(id: number, updateEventDto: UpdateEventDto) {
        await this.findOne(id); 
        
        const updateData: any = {};
        
        if (updateEventDto.title) updateData.title = updateEventDto.title;
        if (updateEventDto.description) updateData.description = updateEventDto.description;
        if (updateEventDto.location) updateData.location = updateEventDto.location;
        if (updateEventDto.imageUrl) updateData.imageUrl = updateEventDto.imageUrl ?? null;
        if (updateEventDto.status) updateData.status = 'ongoing';
        if (updateEventDto.event_date) updateData.eventDate = new Date(updateEventDto.event_date);
        if (updateEventDto.event_time) updateData.eventTime = updateEventDto.event_time;
        
        return this.prisma.event.update({
            where: { id },
            data: updateData
        });
    }

    async remove(id: number) {
        await this.findOne(id); // Check if exists
        
        await this.prisma.event.delete({
            where: { id }
        });
        
        return { message: `Event with ID ${id} has been deleted successfully` };
    }
}
