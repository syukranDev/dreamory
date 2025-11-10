import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import type { CreateEventDto, UpdateEventDto } from '../types/event.types';
import { eventService } from '../services/event.service';

type UpdateEventVariables = {
  id: number;
  data: UpdateEventDto;
};

export const useEventMutations = (queryKey: QueryKey = ['events']) => {
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: (dto: CreateEventDto) => eventService.createEvent(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: UpdateEventVariables) => eventService.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    createEventMutation,
    updateEventMutation,
    deleteEventMutation,
  };
};


