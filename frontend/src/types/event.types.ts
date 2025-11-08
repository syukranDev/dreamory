export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  imageUrl?: string | null;
  status: string;
  event_date: string;
  event_time: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventResponse {
  id: number;
  title: string;
  description: string;
  location: string;
  imageUrl?: string | null;
  status: string;
  eventDate: string;
  eventTime: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  imageUrl: string;
  status: string;
  event_date: string;
  event_time: string;
}

