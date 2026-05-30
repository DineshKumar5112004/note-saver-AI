import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { notesService } from '@/services/notesService';
import type { Note, NoteFilter } from '@/types/database';
import { toast } from 'sonner';
import { NOTES_PER_PAGE, AUTOSAVE_INTERVAL } from '@/constants';

interface NotesContextType {
  notes: Note[];
  loading: boolean;
  filter: NoteFilter;
  setFilter: React.Dispatch<React.SetStateAction<NoteFilter>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  hasMore: boolean;
  statistics: {
    total: number;
    favorites: number;
    archived: number;
    pinned: number;
    totalWords: number;
  };
  fetchNotes: () => Promise<void>;
  createNote: (note: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Note | null>;
  updateNote: (noteId: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  archiveNote: (noteId: string) => Promise<void>;
  restoreNote: (noteId: string) => Promise<void>;
  togglePin: (noteId: string) => Promise<void>;
  toggleFavorite: (noteId: string) => Promise<void>;
  duplicateNote: (noteId: string) => Promise<void>;
  loadMore: () => Promise<void>;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: ReactNode; userId: string }> = ({ 
  children, 
  userId 
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [statistics, setStatistics] = useState({
    total: 0,
    favorites: 0,
    archived: 0,
    pinned: 0,
    totalWords: 0,
  });
  const [filter, setFilter] = useState<NoteFilter>({
    search: '',
    category: null,
    tags: [],
    sortBy: 'newest',
    showArchived: false,
    showFavorites: false,
    showPinned: false,
  });

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const { notes: fetchedNotes, error, hasMore: more } = await notesService.fetchNotes(
        userId,
        filter,
        page
      );

      if (error) {
        toast.error(error);
        return;
      }

      if (page === 0) {
        setNotes(fetchedNotes || []);
      } else {
        setNotes((prev) => [...prev, ...(fetchedNotes || [])]);
      }
      
      setHasMore(more);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, [userId, filter, page]);

  const loadStatistics = useCallback(async () => {
    const result = await notesService.getNoteStatistics(userId);
    if (!result.error) {
      const { error, ...stats } = result;
      setStatistics(stats);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotes();
    loadStatistics();
  }, [fetchNotes, loadStatistics]);

  const createNote = async (
    noteData: Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<Note | null> => {
    const { note, error } = await notesService.createNote(userId, noteData);
    
    if (error) {
      toast.error(error);
      return null;
    }

    if (note) {
      setNotes((prev) => [note, ...prev]);
      loadStatistics();
      toast.success('Note created');
    }
    
    return note;
  };

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    const { note, error } = await notesService.updateNote(noteId, updates);
    
    if (error) {
      toast.error(error);
      return;
    }

    if (note) {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? note : n))
      );
      loadStatistics();
    }
  };

  const deleteNote = async (noteId: string) => {
    const { error } = await notesService.deleteNote(noteId);
    
    if (error) {
      toast.error(error);
      return;
    }

    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    loadStatistics();
    toast.success('Note deleted');
  };

  const archiveNote = async (noteId: string) => {
    const { error } = await notesService.archiveNote(noteId);
    
    if (error) {
      toast.error(error);
      return;
    }

    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    loadStatistics();
    toast.success('Note archived');
  };

  const restoreNote = async (noteId: string) => {
    const { error } = await notesService.restoreNote(noteId);
    
    if (error) {
      toast.error(error);
      return;
    }

    await fetchNotes();
    loadStatistics();
    toast.success('Note restored');
  };

  const togglePin = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    const { error } = await notesService.togglePin(noteId, !note.is_pinned);
    
    if (error) {
      toast.error(error);
      return;
    }

    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, is_pinned: !n.is_pinned } : n
      )
    );
    loadStatistics();
  };

  const toggleFavorite = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    const { error } = await notesService.toggleFavorite(noteId, !note.is_favorite);
    
    if (error) {
      toast.error(error);
      return;
    }

    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId ? { ...n, is_favorite: !n.is_favorite } : n
      )
    );
    loadStatistics();
  };

  const duplicateNote = async (noteId: string) => {
    const { note, error } = await notesService.duplicateNote(noteId);
    
    if (error) {
      toast.error(error);
      return;
    }

    if (note) {
      setNotes((prev) => [note, ...prev]);
      loadStatistics();
      toast.success('Note duplicated');
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    setPage((prev) => prev + 1);
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        loading,
        filter,
        setFilter,
        page,
        setPage,
        hasMore,
        statistics,
        fetchNotes,
        createNote,
        updateNote,
        deleteNote,
        archiveNote,
        restoreNote,
        togglePin,
        toggleFavorite,
        duplicateNote,
        loadMore,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
};
