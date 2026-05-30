import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { notesService } from '@/services/notesService';
import type { Note } from '@/types/database';

const Archived: React.FC = () => {
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchived();
  }, [user]);

  const fetchArchived = async () => {
    if (!user) return;

    try {
      const { notes: data, error } = await notesService.fetchNotes(user.id, {
        search: '',
        category: null,
        tags: [],
        sortBy: 'newest',
        showArchived: true,
        showFavorites: false,
        showPinned: false
      });

      if (error) {
        console.error('Error fetching archived:', error);
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

  const restoreNote = async (noteId: string) => {
    try {
      const { error } = await notesService.restoreNote(noteId);

      if (error) {
        toast.error('Failed to restore');
        return;
      }

      toast.success('Note restored');
      fetchArchived();
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
              onClick={() => navigate('/notes')}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              All Notes
            </button>
            <button
              onClick={() => navigate('/favorites')}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors"
            >
              Favorites
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
            <h2 className="text-4xl font-bold mb-2">📦 Archived Notes</h2>
            <p className="text-gray-400">You have {notes.length} archived note{notes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading archived notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
            <p className="text-6xl mb-4">📦</p>
            <h3 className="text-2xl font-semibold mb-2">No archived notes</h3>
            <p className="text-gray-400 mb-6">Archive old notes to find them here!</p>
            <button
              onClick={() => navigate('/notes')}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-all hover:scale-105"
            >
              View All Notes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-gray-800 rounded-xl border-2 border-gray-600 transition-all hover:scale-105 overflow-hidden opacity-75"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-white line-clamp-2 flex-1">
                      {note.title}
                    </h3>
                    <span className="text-lg ml-2">📦</span>
                  </div>
                  
                  {note.content && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                      {note.content}
                    </p>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(note.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <button
                      onClick={() => restoreNote(note.id)}
                      className="px-3 py-1 bg-primary-600 hover:bg-primary-700 rounded text-xs transition-colors"
                    >
                      Restore
                    </button>
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
            onClick={() => navigate('/notes')}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 cursor-pointer hover:border-primary-500 transition-all hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2">📝 All Notes</h3>
            <p className="text-gray-400">View all notes</p>
          </div>
          <div 
            onClick={() => navigate('/favorites')}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 cursor-pointer hover:border-yellow-500 transition-all hover:scale-105"
          >
            <h3 className="text-xl font-semibold mb-2">⭐ Favorites</h3>
            <p className="text-gray-400">View starred notes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archived;
