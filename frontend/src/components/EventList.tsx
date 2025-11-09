import React from 'react';
import { Box, Typography } from '@mui/material';
import EventCard from './EventCard';
import type { Event } from '../types/event.types';

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEdit, onDelete }) => {
  if (events.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No events found. Create your first event!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'flex-start',
      }}
    >
      {events.map((event) => (
        <Box
          key={event.id}
          sx={{
            width: 'calc(33.333% - 16px)',
            minWidth: '300px',
            flexShrink: 0,
          }}
        >
          <EventCard event={event} onEdit={onEdit} onDelete={onDelete} />
        </Box>
      ))}
    </Box>
  );
};

export default EventList;

