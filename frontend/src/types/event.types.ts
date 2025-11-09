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

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export type PaginatedEventResponse = PaginatedResponse<Event>;

