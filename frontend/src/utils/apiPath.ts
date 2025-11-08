export const BASE_URL = 'http://localhost:5000'

export const API_PATH = {
    AUTH: {
        LOGIN: '/api/v1/auth/login',
        REGISTER: '/api/v1/auth/register',
    },
    EVENT: {
        ADD_EVENT: '/api/v1/event/addEvent',
        GET_ALL_EVENT_DATA: '/api/v1/event/getAllEvent',
        GET_EVENT_DATA_BY_ID: '/api/v1/event/getEventById/:id',
        UPDATE_EVENT: '/api/v1/event/updateEvent/:id',
        DELETE_EVENT: '/api/v1/event/deleteEvent/:id',
    }
}