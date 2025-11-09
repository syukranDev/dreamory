import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import type { Event } from '../types/event.types';

interface EventCardViewProps {
  event: Event;
  onClick: (event: Event) => void;
}

const EventCardView: React.FC<EventCardViewProps> = ({ event, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ongoing':
        return 'success';
      case 'upcoming':
        return 'success';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card
      onClick={() => onClick(event)}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
          borderColor: 'primary.main',
        },
      }}
    >
      {event.imageUrl && (
        <Box
          sx={{
            position: 'relative',
            height: 220,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <CardMedia
            component="img"
            height="220"
            image={event.imageUrl}
            alt={event.title}
            sx={{
              objectFit: 'cover',
              width: '100%',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
            }}
          >
            <Chip
              label={event.status}
              color={getStatusColor(event.status) as any}
              size="small"
              sx={{
                fontWeight: 600,
                textTransform: 'capitalize',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            />
          </Box>
        </Box>
      )}
      {!event.imageUrl && (
        <Box
          sx={{
            height: 8,
            background: 'linear-gradient(90deg, #ff9800 0%, #ffb74d 50%, #ff9800 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
            '@keyframes shimmer': {
              '0%': { backgroundPosition: '200% 0' },
              '100%': { backgroundPosition: '-200% 0' },
            },
          }}
        />
      )}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {!event.imageUrl && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Chip
              label={event.status}
              color={getStatusColor(event.status) as any}
              size="small"
              sx={{
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            />
          </Box>
        )}
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 700,
            mb: 1.5,
            fontSize: '1.25rem',
            lineHeight: 1.3,
            color: 'text.primary',
          }}
        >
          {event.title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.6,
            fontSize: '0.875rem',
          }}
        >
          {event.description}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            pt: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                color: 'primary.main',
              }}
            >
              <LocationOnIcon fontSize="small" sx={{color: 'white'}} />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              {event.location}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                color: 'primary.main',
              }}
            >
              <EventIcon fontSize="small" sx={{color: 'white'}} />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              {formatDate(event.event_date)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: 'primary.light',
                color: 'primary.main',
              }}
            >
              <AccessTimeIcon fontSize="small" sx={{color: 'white'}}/>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              {event.event_time}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventCardView;

