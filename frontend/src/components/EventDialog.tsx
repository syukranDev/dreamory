import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  Typography,
  CircularProgress,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useForm, Controller } from 'react-hook-form';
import { uploadService } from '../services/upload.service';
import type { EventFormData } from '../types/event.types';

interface EventDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  event?: EventFormData | null;
  mode: 'create' | 'edit';
}

const EventDialog: React.FC<EventDialogProps> = ({
  open,
  onClose,
  onSubmit,
  event,
  mode,
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(event?.imageUrl || null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<EventFormData>({
    defaultValues: event || {
      title: '',
      description: '',
      location: '',
      imageUrl: '',
      status: 'ongoing',
      event_date: '',
      event_time: '',
    },
  });

  const imageUrl = watch('imageUrl');

  React.useEffect(() => {
    if (event) {
      reset(event);
      setPreviewUrl(event.imageUrl || null);
    } else {
      reset({
        title: '',
        description: '',
        location: '',
        imageUrl: '',
        status: 'ongoing',
        event_date: '',
        event_time: '',
      });
      setPreviewUrl(null);
    }
    setUploadError(null);
  }, [event, reset, open]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      setUploadError('Only PNG and JPEG images are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const uploadedPath = await uploadService.uploadImage(file);
      setValue('imageUrl', uploadedPath);
      setPreviewUrl(uploadedPath);
    } catch (error: any) {
      setUploadError(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFormSubmit = (data: EventFormData) => {
    onSubmit(data);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          {mode === 'create' ? 'Create New Event' : 'Edit Event'}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Title"
                  fullWidth
                  error={!!errors.title}
                  helperText={errors.title?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              )}
            />

            <Controller
              name="location"
              control={control}
              rules={{ required: 'Location is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Location"
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
              )}
            />

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Event Image
              </Typography>
              <Box
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <input
                  accept="image/png,image/jpeg,image/jpg"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading}
                    sx={{ mb: 2 }}
                  >
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </label>
                {uploading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
                {previewUrl && !uploading && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        setValue('imageUrl', '');
                        setPreviewUrl(null);
                      }}
                      sx={{ mt: 1 }}
                    >
                      Remove Image
                    </Button>
                  </Box>
                )}
                {uploadError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {uploadError}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  PNG or JPEG only, max 5MB
                </Typography>
              </Box>
            </Box>

            <Controller
              name="status"
              control={control}
              rules={{ required: 'Status is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Status"
                  fullWidth
                  select
                  error={!!errors.status}
                  helperText={errors.status?.message}
                >
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
              )}
            />

            <Controller
              name="event_date"
              control={control}
              rules={{ required: 'Event date is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Event Date"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.event_date}
                  helperText={errors.event_date?.message}
                />
              )}
            />

            <Controller
              name="event_time"
              control={control}
              rules={{ required: 'Event time is required' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Event Time"
                  type="time"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.event_time}
                  helperText={errors.event_time?.message}
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            {mode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventDialog;

