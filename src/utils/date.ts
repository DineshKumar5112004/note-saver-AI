import { format, formatDistanceToNow, formatDateTime as formatDT } from 'date-fns';

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatRelative = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatDateTime = (date: string | Date): string => {
  return formatDT(new Date(date), 'MMM dd, yyyy h:mm a');
};

export const formatTime = (date: string | Date): string => {
  return format(new Date(date), 'h:mm a');
};
