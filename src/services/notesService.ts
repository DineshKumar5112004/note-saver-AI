import { supabase } from '@/lib/supabase';
import { parseError } from '@/utils/errors';
import type { Note, NoteActivity, NoteFilter } from '@/types/database';
import { NOTES_PER_PAGE } from '@/constants';

export const notesService = {
  // Fetch notes with pagination and filters
  async fetchNotes(
    userId: string,
    filter: NoteFilter,
    page: number = 0
  ): Promise<{ notes: Note[] | null; error: string | null; hasMore: boolean }> {
    try {
      let query = supabase
        .from('notes')
        .select('*')
        .eq('user_id', userId);

      // Apply filters
      if (!filter.showArchived) {
        query = query.eq('is_archived', false);
      } else {
        query = query.eq('is_archived', true);
      }

      if (filter.showFavorites) {
        query = query.eq('is_favorite', true);
      }

      if (filter.showPinned) {
        query = query.eq('is_pinned', true);
      }

      if (filter.category) {
        query = query.eq('category', filter.category);
      }

      if (filter.tags.length > 0) {
        query = query.contains('tags', filter.tags);
      }

      if (filter.search) {
        query = query.or(
          `title.ilike.%${filter.search}%,content.ilike.%${filter.search}%`
        );
      }

      // Apply sorting
      switch (filter.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'alphabetical':
          query = query.order('title', { ascending: true });
          break;
        case 'recently_updated':
          query = query.order('updated_at', { ascending: false });
          break;
      }

      // Apply pagination
      const from = page * NOTES_PER_PAGE;
      const to = from + NOTES_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) throw error;

      const hasMore = data?.length === NOTES_PER_PAGE;

      return { notes: data, error: null, hasMore };
    } catch (error) {
      return { notes: null, error: parseError(error), hasMore: false };
    }
  },

  // Create a new note
  async createNote(
    userId: string,
    note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<{ note: Note | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{ ...note, user_id: userId }])
        .select()
        .single();

      if (error) throw error;

      // Log activity
      if (data) {
        await this.logActivity(data.id, 'created');
      }

      return { note: data, error: null };
    } catch (error) {
      return { note: null, error: parseError(error) };
    }
  },

  // Update a note
  async updateNote(
    noteId: string,
    updates: Partial<Note>
  ): Promise<{ note: Note | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('notes')
        .update(updates)
        .eq('id', noteId)
        .select()
        .single();

      if (error) throw error;

      return { note: data, error: null };
    } catch (error) {
      return { note: null, error: parseError(error) };
    }
  },

  // Delete a note
  async deleteNote(noteId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: parseError(error) };
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
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', noteId)
        .single();

      if (error) throw error;
      return { note: data, error: null };
    } catch (error) {
      return { note: null, error: parseError(error) };
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
      const { data: notes, error } = await supabase
        .from('notes')
        .select('is_favorite, is_archived, is_pinned, content')
        .eq('user_id', userId)
        .eq('is_archived', false);

      if (error) throw error;

      if (!notes) {
        return { total: 0, favorites: 0, archived: 0, pinned: 0, totalWords: 0, error: null };
      }

      const total = notes.length;
      const favorites = notes.filter((n: any) => n.is_favorite).length;
      const archived = notes.filter((n: any) => n.is_archived).length;
      const pinned = notes.filter((n: any) => n.is_pinned).length;
      const totalWords = notes.reduce((sum: number, n: any) => {
        return sum + (n.content ? n.content.trim().split(/\s+/).length : 0);
      }, 0);

      return { total, favorites, archived, pinned, totalWords, error: null };
    } catch (error) {
      return {
        total: 0,
        favorites: 0,
        archived: 0,
        pinned: 0,
        totalWords: 0,
        error: parseError(error),
      };
    }
  },

  // Log note activity
  async logActivity(
    noteId: string,
    action: string
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('note_activity')
        .insert([{ note_id: noteId, action }]);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: parseError(error) };
    }
  },

  // Get recent activity for a user's notes
  async getRecentActivity(
    userId: string,
    limit: number = 10
  ): Promise<{ activities: (NoteActivity & { note: Note })[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('note_activity')
        .select(`
          *,
          note:notes(*)
        `)
        .eq('note.user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { activities: data, error: null };
    } catch (error) {
      return { activities: null, error: parseError(error) };
    }
  },

  // Duplicate a note
  async duplicateNote(noteId: string): Promise<{ note: Note | null; error: string | null }> {
    try {
      const { note: originalNote, error: fetchError } = await this.getNote(noteId);
      
      if (fetchError || !originalNote) {
        throw new Error(fetchError || 'Note not found');
      }

      const { note, error } = await this.createNote(originalNote.user_id, {
        title: `${originalNote.title} (Copy)`,
        content: originalNote.content,
        color: originalNote.color,
        category: originalNote.category,
        tags: originalNote.tags,
        is_pinned: false,
        is_favorite: false,
        is_archived: false,
      });

      return { note, error };
    } catch (error) {
      return { note: null, error: parseError(error) };
    }
  },
};
