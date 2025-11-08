export const BASE_URL = 'http://localhost:5000'

export const API_PATH = {
    AUTH: {
        LOGIN: { path: '/api/v1/auth/login', method: 'POST' },
        SIGNUP: { path: '/api/v1/auth/signup', method: 'POST' },
    },
    EVENT: {
        ADD_EVENT: { path: '/api/v1/events', method: 'POST' },
        GET_ALL_EVENT_DATA: { path: '/api/v1/events', method: 'GET' },
        GET_EVENT_DATA_BY_ID: { path: '/api/v1/events/:id', method: 'GET' },
        UPDATE_EVENT: { path: '/api/v1/events/:id', method: 'PATCH' },
        DELETE_EVENT: { path: '/api/v1/events/:id', method: 'DELETE' },
    }
}
