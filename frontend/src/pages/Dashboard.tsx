import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventTable from '../components/EventTable';
import EventDialog from '../components/EventDialog';
import { eventService } from '../services/event.service';
import type { Event, EventFormData } from '../types/event.types';

function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateDialog = () => {
    setSelectedEvent(null);
    setDialogMode('create');
    setDialogOpen(true);
  };

  const handleOpenEditDialog = (event: Event) => {
    setSelectedEvent(event);
    setDialogMode('edit');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleCreateEvent = async (formData: EventFormData) => {
    try {
      setError(null);
      const newEvent = await eventService.createEvent(formData);
      setEvents([...events, newEvent]);
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleUpdateEvent = async (formData: EventFormData) => {
    if (!selectedEvent) return;

    try {
      setError(null);
      const updatedEvent = await eventService.updateEvent(selectedEvent.id, formData);
      setEvents(events.map(event =>
        event.id === selectedEvent.id ? updatedEvent : event
      ));
      handleCloseDialog();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update event');
    }
  };

  const handleSubmitDialog = (formData: EventFormData) => {
    if (dialogMode === 'create') {
      handleCreateEvent(formData);
    } else {
      handleUpdateEvent(formData);
    }
  };

  const handleDeleteClick = (id: number) => {
    setEventToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (eventToDelete !== null) {
      try {
        setError(null);
        await eventService.deleteEvent(eventToDelete);
        setEvents(events.filter(event => event.id !== eventToDelete));
        setEventToDelete(null);
        setDeleteDialogOpen(false);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete event');
        setEventToDelete(null);
        setDeleteDialogOpen(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setEventToDelete(null);
    setDeleteDialogOpen(false);
  };

  const getEventFormData = (event: Event | null): EventFormData | null => {
    if (!event) return null;
    return {
      title: event.title,
      description: event.description,
      location: event.location,
      imageUrl: event.imageUrl || '',
      status: event.status,
      event_date: event.event_date,
      event_time: event.event_time,
    };
  };

  return (
    <Box sx={{ width: '100%', height: '100vh', backgroundColor: '#f5f5f5', margin: 0, padding: 0 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Event Dashboard (Admin Portal)
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: '100%', height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1.5,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}/>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
            sx={{ textTransform: 'none' }}
          >
            Create Event
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mx: 1.5, mb: 1 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflow: 'auto', px: 1.5, pb: 1.5 }}>
            <EventTable
              events={events}
              onEdit={handleOpenEditDialog}
              onDelete={handleDeleteClick}
            />
          </Box>
        )}

        <EventDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitDialog}
          event={getEventFormData(selectedEvent)}
          mode={dialogMode}
        />

        <Dialog
          open={deleteDialogOpen}
          onClose={handleDeleteCancel}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">
            Delete Event
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default Dashboard;

