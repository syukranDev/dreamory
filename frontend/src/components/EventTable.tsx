import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Event } from '../types/event.types';

interface EventTableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

const EventTable: React.FC<EventTableProps> = ({ events, onEdit, onDelete }) => {
  const cellPadding = 0.75;
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ongoing':
        return 'primary';
      case 'upcoming':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 2,
        overflow: 'auto',
        width: '100%',
        maxHeight: '100%',
      }}
    >
      <Table
        sx={{
          width: '100%',
          tableLayout: 'auto',
        }}
        size="small"
        aria-label="events table"
        stickyHeader
      >
        <TableHead>
          <TableRow sx={{ bgcolor: 'primary.main' }}>
            <TableCell sx={{ color: 'black', fontWeight: 600, py: cellPadding }}>ID</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 600, py: cellPadding }}>Image</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 600, py: cellPadding }}>Title</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 600, py: cellPadding }}>Description</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 600, py: cellPadding }}>Location</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 600, py: cellPadding }}>Status</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 600, py: cellPadding }}>Event Date</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 600, py: cellPadding }}>Event Time</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 600, py: cellPadding }}>Created At</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 600, py: cellPadding }}>Updated At</TableCell>
            <TableCell sx={{ color: 'black', fontWeight: 600, textAlign: 'center', py: cellPadding }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow
              key={event.id}
              sx={{
                '&:nth-of-type(odd)': {
                  backgroundColor: 'action.hover',
                },
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <TableCell sx={{ py: cellPadding }}>{event.id}</TableCell>
              <TableCell sx={{ py: cellPadding }}>
                {event.imageUrl ? (
                  <Avatar
                    src={event.imageUrl}
                    alt={event.title}
                    variant="rounded"
                    sx={{ width: 40, height: 40 }}
                  />
                ) : (
                  <Avatar
                    variant="rounded"
                    sx={{ width: 40, height: 40, bgcolor: 'grey.300' }}
                  >
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                      No Image
                    </Typography>
                  </Avatar>
                )}
              </TableCell>
              <TableCell sx={{ py: cellPadding }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {event.title}
                </Typography>
              </TableCell>
              <TableCell sx={{ py: cellPadding }}>
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: 250,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={event.description}
                >
                  {event.description}
                </Typography>
              </TableCell>
              <TableCell sx={{ py: cellPadding }}>{event.location}</TableCell>
              <TableCell sx={{ py: cellPadding }}>
                <Chip
                  label={event.status}
                  color={getStatusColor(event.status) as any}
                  size="small"
                  sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                />
              </TableCell>
              <TableCell sx={{ py: cellPadding }}>{formatDate(event.event_date)}</TableCell>
              <TableCell sx={{ py: cellPadding }}>{event.event_time}</TableCell>
              <TableCell sx={{ py: cellPadding }}>
                <Typography variant="caption" sx={{ fontSize: '0.70rem' }}>
                  {event.createdAt ? formatDateTime(event.createdAt) : '-'}
                </Typography>
              </TableCell>
              <TableCell sx={{ py: cellPadding }}>
                <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                  {event.updatedAt ? formatDateTime(event.updatedAt) : '-'}
                </Typography>
              </TableCell>
              <TableCell sx={{ py: cellPadding }}>
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(event)}
                    aria-label="edit event"
                    size="small"
                    sx={{ p: 0.5 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(event.id)}
                    aria-label="delete event"
                    size="small"
                    sx={{ p: 0.5 }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EventTable;

