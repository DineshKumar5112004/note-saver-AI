import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Save, ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const NoteEditor: React.FC = () => {
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#ffffff');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to save notes');
      return;
    }

    setSaving(true);
    
    try {
      // Parse tags from comma-separated string
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Save to Supabase
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          category: category || null,
          color: color,
          tags: tagsArray,
          is_pinned: false,
          is_favorite: false,
          is_archived: false,
        }])
        .select();

      if (error) {
        console.error('Error saving note:', error);
        toast.error('Failed to save note: ' + error.message);
        setSaving(false);
        return;
      }

      if (data && data.length > 0) {
        toast.success('Note saved successfully!');
        // Navigate to notes list to see the saved note
        navigate('/notes');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error('An unexpected error occurred');
      setSaving(false);
    }
  };

  const colors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
  ];

  const categories = [
    'Personal',
    'Work',
    'Study',
    'Ideas',
    'Tasks',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/notes')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
              Create Note
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Note'}
            </button>
            <button
              onClick={() => navigate('/notes')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
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
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Color Preview */}
          <div 
            className="w-full h-2 rounded-t-xl mb-6 transition-colors duration-300"
            style={{ backgroundColor: color }}
          />
          
          {/* Title Input */}
          <div className="mb-6">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white text-2xl font-semibold placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category & Color Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select category...</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., important, meeting, project"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Color Picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Color <span className="text-gray-500">(Selected: {colors.find(c => c.value === color)?.name})</span>
            </label>
            <div className="flex gap-3 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-12 h-12 rounded-full border-4 transition-all hover:scale-110 ${
                    color === c.value ? 'border-white scale-125 shadow-lg' : 'border-gray-600'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Content Textarea */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your note here...&#10;&#10;You can write anything you want!"
              rows={20}
              className="w-full px-6 py-4 bg-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors duration-300 resize-none"
              style={{ borderColor: color, borderWidth: '2px' }}
            />
          </div>

          {/* Word Count */}
          <div className="flex justify-between items-center text-sm text-gray-400 mb-6">
            <span>Words: {content.trim() ? content.trim().split(/\s+/).length : 0}</span>
            <span>Characters: {content.length}</span>
          </div>

          {/* Bottom Actions */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => navigate('/notes')}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
