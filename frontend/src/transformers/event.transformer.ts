import type { CreateEventDto, EventFormData } from '../types/event.types';

export const toCreateEventDto = (formData: EventFormData): CreateEventDto => {
  const trimmedImageUrl = formData.imageUrl?.trim();
  const trimmedStatus = formData.status?.trim();
  const title = formData.title.trim();
  const description = formData.description.trim();

  if (title.length < 6) {
    throw new Error('Title must be more than 5 characters');
  }

  if (description.length < 11) {
    throw new Error('Description must be more than 10 characters');
  }

  return {
    title,
    description,
    location: formData.location.trim(),
    imageUrl: trimmedImageUrl ? trimmedImageUrl : undefined,
    status: trimmedStatus ? trimmedStatus : undefined,
    event_date: formData.event_date,
    event_time: formData.event_time,
  };
};


