import { getFromStorage, saveToStorage } from '@/utils/storage';
import type { Note, NoteActivity, NoteFilter } from '@/types/database';
import { NOTES_PER_PAGE } from '@/constants';

const NOTES_STORAGE_KEY = 'notesaver_pro_notes';
const ACTIVITY_STORAGE_KEY = 'notesaver_pro_activity';

// Helper to get notes from localStorage
const getLocalNotes = (): Note[] => {
  return getFromStorage<Note[]>(NOTES_STORAGE_KEY, []);
};

// Helper to save notes to localStorage
const saveLocalNotes = (notes: Note[]) => {
  saveToStorage(NOTES_STORAGE_KEY, notes);
};

export const notesService = {
  // Fetch notes with pagination and filters (from localStorage)
  async fetchNotes(
    userId: string,
    filter: NoteFilter,
    page: number = 0
  ): Promise<{ notes: Note[] | null; error: string | null; hasMore: boolean }> {
    try {
      let notes = getLocalNotes();
      
      // Filter by user_id
      notes = notes.filter(n => n.user_id === userId);

      // Apply filters
      if (!filter.showArchived) {
        notes = notes.filter(n => !n.is_archived);
      } else {
        notes = notes.filter(n => n.is_archived);
      }

      if (filter.showFavorites) {
        notes = notes.filter(n => n.is_favorite);
      }

      if (filter.showPinned) {
        notes = notes.filter(n => n.is_pinned);
      }

      if (filter.category) {
        notes = notes.filter(n => n.category === filter.category);
      }

      if (filter.tags.length > 0) {
        notes = notes.filter(n => filter.tags.every(tag => n.tags.includes(tag)));
      }

      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        notes = notes.filter(n => 
          n.title.toLowerCase().includes(searchLower) || 
          n.content.toLowerCase().includes(searchLower)
        );
      }

      // Apply sorting
      notes.sort((a, b) => {
        switch (filter.sortBy) {
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case 'alphabetical':
            return a.title.localeCompare(b.title);
          case 'recently_updated':
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
          default:
            return 0;
        }
      });

      // Apply pagination
      const from = page * NOTES_PER_PAGE;
      const to = from + NOTES_PER_PAGE;
      const paginatedNotes = notes.slice(from, to);
      const hasMore = notes.length > to;

      return { notes: paginatedNotes, error: null, hasMore };
    } catch (error) {
      return { notes: null, error: 'Failed to fetch notes', hasMore: false };
    }
  },

  // Create a new note (to localStorage)
  async createNote(
    userId: string,
    note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<{ note: Note | null; error: string | null }> {
    try {
      const notes = getLocalNotes();
      const newNote: Note = {
        ...note,
        id: crypto.randomUUID(),
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      notes.push(newNote);
      saveLocalNotes(notes);

      // Log activity
      await this.logActivity(newNote.id, 'created');

      return { note: newNote, error: null };
    } catch (error) {
      return { note: null, error: 'Failed to create note' };
    }
  },

  // Update a note
  async updateNote(
    noteId: string,
    updates: Partial<Note>
  ): Promise<{ note: Note | null; error: string | null }> {
    try {
      const notes = getLocalNotes();
      const index = notes.findIndex(n => n.id === noteId);
      
      if (index === -1) throw new Error('Note not found');

      const updatedNote = {
        ...notes[index],
        ...updates,
        updated_at: new Date().toISOString()
      };

      notes[index] = updatedNote;
      saveLocalNotes(notes);

      return { note: updatedNote, error: null };
    } catch (error) {
      return { note: null, error: 'Failed to update note' };
    }
  },

  // Delete a note
  async deleteNote(noteId: string): Promise<{ error: string | null }> {
    try {
      const notes = getLocalNotes();
      const filteredNotes = notes.filter(n => n.id !== noteId);
      saveLocalNotes(filteredNotes);
      return { error: null };
    } catch (error) {
      return { error: 'Failed to delete note' };
    }
  },

  // Archive a note
  async archiveNote(noteId: string): Promise<{ error: string | null }> {
    return this.updateNote(noteId, { is_archived: true });
  },

  // Restore a note
  async restoreNote(noteId: string): Promise<{ error: string | null }> {
    return this.updateNote(noteId, { is_archived: false });
  },

  // Toggle pin status
  async togglePin(noteId: string, isPinned: boolean): Promise<{ error: string | null }> {
    return this.updateNote(noteId, { is_pinned: isPinned });
  },

  // Toggle favorite status
  async toggleFavorite(noteId: string, isFavorite: boolean): Promise<{ error: string | null }> {
    return this.updateNote(noteId, { is_favorite: isFavorite });
  },

  // Get a single note by ID
  async getNote(noteId: string): Promise<{ note: Note | null; error: string | null }> {
    try {
      const notes = getLocalNotes();
      const note = notes.find(n => n.id === noteId);
      return { note: note || null, error: note ? null : 'Note not found' };
    } catch (error) {
      return { note: null, error: 'Failed to get note' };
    }
  },

  // Get note statistics
  async getNoteStatistics(userId: string): Promise<{
    total: number;
    favorites: number;
    archived: number;
    pinned: number;
    totalWords: number;
    error: string | null;
  }> {
    try {
      const notes = getLocalNotes().filter(n => n.user_id === userId);
      
      const activeNotes = notes.filter(n => !n.is_archived);
      const total = activeNotes.length;
      const favorites = activeNotes.filter(n => n.is_favorite).length;
      const archived = notes.filter(n => n.is_archived).length;
      const pinned = activeNotes.filter(n => n.is_pinned).length;
      const totalWords = activeNotes.reduce((sum, n) => {
        return sum + (n.content ? n.content.trim().split(/\s+/).length : 0);
      }, 0);

      return { total, favorites, archived, pinned, totalWords, error: null };
    } catch (error) {
      return { total: 0, favorites: 0, archived: 0, pinned: 0, totalWords: 0, error: 'Failed to fetch stats' };
    }
  },

  // Log note activity
  async logActivity(
    noteId: string,
    action: string
  ): Promise<{ error: string | null }> {
    try {
      const activities = getFromStorage<NoteActivity[]>(ACTIVITY_STORAGE_KEY, []);
      activities.unshift({
        id: crypto.randomUUID(),
        note_id: noteId,
        action,
        created_at: new Date().toISOString()
      });
      saveToStorage(ACTIVITY_STORAGE_KEY, activities.slice(0, 50)); // Keep last 50
      return { error: null };
    } catch (error) {
      return { error: 'Failed to log activity' };
    }
  },

  // Get recent activity for a user's notes
  async getRecentActivity(
    userId: string,
    limit: number = 10
  ): Promise<{ activities: (NoteActivity & { note: Note })[] | null; error: string | null }> {
    try {
      const activities = getFromStorage<NoteActivity[]>(ACTIVITY_STORAGE_KEY, []);
      const notes = getLocalNotes();
      
      const userActivities = activities
        .map(activity => ({
          ...activity,
          note: notes.find(n => n.id === activity.note_id)!
        }))
        .filter(a => a.note && a.note.user_id === userId)
        .slice(0, limit);

      return { activities: userActivities, error: null };
    } catch (error) {
      return { activities: null, error: 'Failed to fetch activity' };
    }
  },

  // Duplicate a note
  async duplicateNote(noteId: string): Promise<{ note: Note | null; error: string | null }> {
    try {
      const { note: originalNote } = await this.getNote(noteId);
      if (!originalNote) throw new Error('Note not found');

      return await this.createNote(originalNote.user_id, {
        title: `${originalNote.title} (Copy)`,
        content: originalNote.content,
        color: originalNote.color,
        category: originalNote.category,
        tags: originalNote.tags,
        is_pinned: false,
        is_favorite: false,
        is_archived: false,
      });
    } catch (error) {
      return { note: null, error: 'Failed to duplicate note' };
    }
  },
};
