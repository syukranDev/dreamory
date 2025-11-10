import { useState, useEffect, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import type { SelectChangeEvent } from '@mui/material/Select';
import { useQuery } from '@tanstack/react-query';
import EventTable from '../components/EventTable';
import EventDialog from '../components/EventDialog';
import { eventService } from '../services/event.service';
import type { Event, EventFormData, PaginatedEventResponse, PaginationMeta } from '../types/event.types';
import { useAuth } from '../context/AuthContext';
import { useEventMutations } from '../query/event.mutations';

function Dashboard() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [sortColumn, setSortColumn] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actionError, setActionError] = useState<string | null>(null);
  const { logout } = useAuth();
  const { createEventMutation, updateEventMutation, deleteEventMutation } = useEventMutations();

  const getErrorMessage = (err: unknown, fallback: string) => {
    if (typeof err === 'object' && err !== null) {
      const response = (err as { response?: { data?: { message?: string } } }).response;
      const message = response?.data?.message;
      if (message) return message;
    }
    if (err instanceof Error && err.message) {
      return err.message;
    }
    return fallback;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const {
    data: eventsResponse,
    isLoading,
    isError,
    error,
  } = useQuery<PaginatedEventResponse>({
    queryKey: [
      'events',
      {
        sortColumn,
        sortOrder,
        keyword: debouncedSearchTerm || undefined,
        page,
        pageSize: rowsPerPage,
      },
    ],
    queryFn: () =>
      eventService.getAllEvents({
        sortColumn,
        sortOrder,
        keyword: debouncedSearchTerm || undefined,
        page: page + 1,
        pageSize: rowsPerPage,
      }),
  });

  const events = eventsResponse?.data ?? [];
  const pagination: PaginationMeta | null = eventsResponse?.pagination ?? null;
  const queryErrorMessage = isError ? getErrorMessage(error, 'Failed to fetch events') : null;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
      setPage(0);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setPage(0);
  }, [sortColumn, sortOrder]);

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
    setActionError(null);
    try {
      await createEventMutation.mutateAsync(formData);
      handleCloseDialog();
    } catch (err) {
      setActionError(getErrorMessage(err, 'Failed to create event'));
    }
  };

  const handleUpdateEvent = async (formData: EventFormData) => {
    if (!selectedEvent) return;

    setActionError(null);
    try {
      await updateEventMutation.mutateAsync({ id: selectedEvent.id, data: formData });
      handleCloseDialog();
    } catch (err) {
      setActionError(getErrorMessage(err, 'Failed to update event'));
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
      setActionError(null);
      try {
        await deleteEventMutation.mutateAsync(eventToDelete);
        setEventToDelete(null);
        setDeleteDialogOpen(false);
      } catch (err) {
        setActionError(getErrorMessage(err, 'Failed to delete event'));
        setEventToDelete(null);
        setDeleteDialogOpen(false);
      }
    }
  };

  const handleDeleteCancel = () => {
    setEventToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handlePageChange = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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

  const displayError = actionError ?? queryErrorMessage;

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', backgroundColor: '#f5f5f5', margin: 0, padding: 0 }}>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              Event Dashboard (Admin Portal)
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            p: 1.5,
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Event Management
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search events"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 220 }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel id="sort-column-label">Sort by</InputLabel>
              <Select
                labelId="sort-column-label"
                value={sortColumn}
                label="Sort by"
                onChange={(event: SelectChangeEvent) => setSortColumn(event.target.value)}
              >
                <MenuItem value="id">ID</MenuItem>
                <MenuItem value="eventDate">Event Date</MenuItem>
                <MenuItem value="createdAt">Created Date</MenuItem>
                <MenuItem value="updatedAt">Updated Date</MenuItem>
                {/* <MenuItem value="title">Title</MenuItem>
                <MenuItem value="status">Status</MenuItem> */}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="sort-order-label">Order</InputLabel>
              <Select
                labelId="sort-order-label"
                value={sortOrder}
                label="Order"
                onChange={(event: SelectChangeEvent) => setSortOrder(event.target.value as 'asc' | 'desc')}
              >
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreateDialog}
              sx={{ textTransform: 'none' }}
            >
              Create Event
            </Button>
          </Box>
        </Box>

        {displayError && (
          <Alert
            severity="error"
            sx={{ mx: 1.5, mb: 1 }}
            onClose={actionError ? () => setActionError(null) : undefined}
          >
            {displayError}
          </Alert>
        )}

        {isLoading ? (
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
            <TablePagination
              component="div"
              count={pagination?.total ?? 0}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 20]}
              sx={{ mt: 1 }}
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

