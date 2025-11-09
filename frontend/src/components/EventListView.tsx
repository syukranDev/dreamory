import React from 'react';
import { Box, Typography } from '@mui/material';
import EventCardView from './EventCardView';
import type { Event } from '../types/event.types';

interface EventListViewProps {
  events: Event[];
  onCardClick: (event: Event) => void;
}

const EventListView: React.FC<EventListViewProps> = ({ events, onCardClick }) => {
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
          No events found.
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
          <EventCardView event={event} onClick={onCardClick} />
        </Box>
      ))}
    </Box>
  );
};

export default EventListView;

