import axiosInstance from '../utils/axiosInstance'
import { API_PATH } from '../utils/apiPath'
import type { Event, EventFormData, EventResponse } from '../types/event.types'

const transformEventResponse = (response: EventResponse): Event => {
  const eventDate = new Date(response.eventDate)
  const formattedDate = eventDate.toISOString().split('T')[0]
  
  return {
    id: response.id,
    title: response.title,
    description: response.description,
    location: response.location,
    imageUrl: response.imageUrl,
    status: response.status,
    event_date: formattedDate,
    event_time: response.eventTime,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  }
}

export const eventService = {
  async getAllEvents(): Promise<Event[]> {
    const response = await axiosInstance.get<EventResponse[]>(
      API_PATH.EVENT.GET_ALL_EVENT_DATA.path
    )
    return response.data.map(transformEventResponse)
  },

  async getEventById(id: number): Promise<Event> {
    const path = API_PATH.EVENT.GET_EVENT_DATA_BY_ID.path.replace(':id', id.toString())
    const response = await axiosInstance.get<EventResponse>(path)
    return transformEventResponse(response.data)
  },

  async createEvent(eventData: EventFormData): Promise<Event> {
    const response = await axiosInstance.post<EventResponse>(
      API_PATH.EVENT.ADD_EVENT.path,
      eventData
    )
    return transformEventResponse(response.data)
  },

  async updateEvent(id: number, eventData: EventFormData): Promise<Event> {
    const path = API_PATH.EVENT.UPDATE_EVENT.path.replace(':id', id.toString())
    const response = await axiosInstance.patch<EventResponse>(path, eventData)
    return transformEventResponse(response.data)
  },

  async deleteEvent(id: number): Promise<void> {
    const path = API_PATH.EVENT.DELETE_EVENT.path.replace(':id', id.toString())
    await axiosInstance.delete(path)
  },
}

