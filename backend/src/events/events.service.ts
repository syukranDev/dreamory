import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

    async findAll(params?: { sortColumn?: string; sortOrder?: 'asc' | 'desc'; keyword?: string }) {
        const allowedSortColumns: Record<string, string> = {
            id: 'id',
            title: 'title',
            status: 'status',
            eventDate: 'eventDate',
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        };

        const sortColumn =
            params?.sortColumn && allowedSortColumns[params.sortColumn]
                ? allowedSortColumns[params.sortColumn]
                : 'createdAt';
        const sortOrder = params?.sortOrder === 'asc' ? 'asc' : 'desc';

        const keyword = params?.keyword?.trim();

        const where: Prisma.EventWhereInput | undefined = keyword
            ? {
                  OR: [
                      { title: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
                      { description: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
                  ],
              }
            : undefined;

        const orderBy: Prisma.EventOrderByWithRelationInput = {
            [sortColumn]: sortOrder,
        };

        return this.prisma.event.findMany({
            where,
            orderBy,
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
        if (updateEventDto.status) updateData.status = updateEventDto.status;
        if (updateEventDto.event_date) updateData.eventDate = new Date(updateEventDto.event_date);
        if (updateEventDto.event_time) updateData.eventTime = updateEventDto.event_time;
        
        return this.prisma.event.update({
            where: { id },
            data: updateData
        });
    }

    async remove(id: number) {
        await this.findOne(id);
        
        await this.prisma.event.delete({
            where: { id }
        });
        
        return { message: `Event with ID ${id} has been deleted successfully` };
    }
}
