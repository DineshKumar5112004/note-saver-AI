// Note colors palette
export const NOTE_COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Red', value: '#fecaca' },
  { name: 'Orange', value: '#fed7aa' },
  { name: 'Yellow', value: '#fef08a' },
  { name: 'Green', value: '#bbf7d0' },
  { name: 'Blue', value: '#bfdbfe' },
  { name: 'Purple', value: '#e9d5ff' },
  { name: 'Pink', value: '#fecdd3' },
];

// Categories
export const CATEGORIES = [
  'Personal',
  'Work',
  'Study',
  'Ideas',
  'Tasks',
  'Meeting Notes',
  'Research',
  'Projects',
];

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  NEW_NOTE: { key: 'n', ctrlKey: true, description: 'Create new note' },
  SEARCH: { key: 'f', ctrlKey: true, description: 'Focus search' },
  SAVE: { key: 's', ctrlKey: true, description: 'Save note' },
  CLOSE: { key: 'Escape', description: 'Close modal/editor' },
  HELP: { key: '?', description: 'Show keyboard shortcuts' },
} as const;

// Pagination
export const NOTES_PER_PAGE = 20;

// Autosave interval (5 seconds)
export const AUTOSAVE_INTERVAL = 5000;

// App constants
export const APP_NAME = 'NoteSaver Pro';
export const APP_DESCRIPTION = 'A modern cloud-based note management platform';

// Toast durations
export const TOAST_DURATION = 3000;

// File upload limits
export const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
export const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
