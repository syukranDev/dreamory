import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import EventListView from '../components/EventListView';
import EventDetailDialog from '../components/EventDetailDialog';
import { eventService } from '../services/event.service';
import type { Event } from '../types/event.types';

function UserPortal() {
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['events'],
    queryFn: () =>
      eventService.getAllEvents({
        sortColumn: 'eventDate',
        sortOrder: 'asc',
        page: 1,
        pageSize: 99999999999,
      }),
  });

  const events = data?.data ?? [];
  const errorMessage = isError
    ? error instanceof Error
      ? error.message
      : (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to fetch events'
    : null;

  const handleCardClick = (event: Event) => {
    setSelectedEvent(event);
    setDetailDialogOpen(true);
  };

  const handleCloseDetailDialog = () => {
    setDetailDialogOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f5f5f5', margin: 0, padding: 0 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Portal (Public View)
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth={events.length === 0 ? false : 'lg'} sx={{ py: 0, px: 0 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 0,
            p: 2,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            List of Events
          </Typography>
        </Box>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3, mx: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <EventListView
              events={events}
              onCardClick={handleCardClick}
            />
          </Box>
        )}

        <EventDetailDialog
          open={detailDialogOpen}
          onClose={handleCloseDetailDialog}
          event={selectedEvent}
        />
      </Container>
    </Box>
  );
}

export default UserPortal;

