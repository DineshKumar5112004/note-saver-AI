import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Note } from '@/types/database';
import { toast } from 'sonner';

const NotesList: React.FC = () => {
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_archived', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        return;
      }

      if (data) {
        setNotes(data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (noteId: string, isFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ is_favorite: !isFavorite })
        .eq('id', noteId);

      if (error) {
        toast.error('Failed to update favorite');
        return;
      }

      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
      fetchNotes(); // Refresh the list
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const toggleArchive = async (noteId: string, isArchived: boolean) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ is_archived: !isArchived })
        .eq('id', noteId);

      if (error) {
        toast.error('Failed to archive note');
        return;
      }

      toast.success(isArchived ? 'Note restored' : 'Note archived');
      fetchNotes(); // Refresh the list
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const deleteNote = async (noteId: string) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (error) {
        toast.error('Failed to delete note');
        return;
      }

      toast.success('Note deleted');
      fetchNotes(); // Refresh the list
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 
            onClick={() => navigate('/dashboard')}
            className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent cursor-pointer hover:opacity-80"
          >
            NoteSaver Pro
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate('/favorites')}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
            >
              Favorites
            </button>
            <button
              onClick={() => navigate('/archived')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
            >
              Archived
            </button>
            <span className="text-gray-300">{profile?.full_name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold mb-2">📝 All Notes</h2>
            <p className="text-gray-400">You have {notes.length} note{notes.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => navigate('/notes/new')}
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-all hover:scale-105"
          >
            ✨ New Note
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
            <p className="text-6xl mb-4">📝</p>
            <h3 className="text-2xl font-semibold mb-2">No notes yet</h3>
            <p className="text-gray-400 mb-6">Create your first note to get started!</p>
            <button
              onClick={() => navigate('/notes/new')}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-all hover:scale-105"
            >
              Create Your First Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-800 rounded-xl border-2 transition-all hover:scale-105 cursor-pointer overflow-hidden"
                style={{ borderColor: note.color || '#374151' }}
              >
                {/* Color bar at top */}
                <div 
                  className="w-full h-2"
                  style={{ backgroundColor: note.color || '#374151' }}
                />
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-white line-clamp-2 flex-1">
                      {note.title}
                    </h3>
                    <div className="flex gap-2 ml-2">
                      {note.is_pinned && <span className="text-lg">📌</span>}
                      {note.is_favorite && <span className="text-lg">⭐</span>}
                    </div>
                  </div>
                  
                  {note.content && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {note.content}
                    </p>
                  )}
                  
                  {note.category && (
                    <span className="inline-block px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300 mb-3">
                      {note.category}
                    </span>
                  )}
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {note.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-primary-900 rounded text-xs text-primary-300">
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{note.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(note.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(note.id, note.is_favorite);
                        }}
                        className="p-2 hover:bg-gray-700 rounded transition-colors"
                        title={note.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {note.is_favorite ? '⭐' : '☆'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleArchive(note.id, note.is_archived);
                        }}
                        className="p-2 hover:bg-gray-700 rounded transition-colors"
                        title="Archive note"
                      >
                        📦
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="p-2 hover:bg-red-700 rounded transition-colors"
                        title="Delete note"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Help */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/dashboard')}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 cursor-pointer hover:border-primary-500 transition-all hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2">🏠 Dashboard</h3>
            <p className="text-gray-400">View your stats</p>
          </div>
          <div 
            onClick={() => navigate('/favorites')}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 cursor-pointer hover:border-yellow-500 transition-all hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2">⭐ Favorites</h3>
            <p className="text-gray-400">View starred notes</p>
          </div>
          <div 
            onClick={() => navigate('/archived')}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 cursor-pointer hover:border-gray-400 transition-all hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2">📦 Archived</h3>
            <p className="text-gray-400">View archived notes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesList;
