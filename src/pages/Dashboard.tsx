import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const Dashboard: React.FC = () => {
  const { profile, signOut, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    favorites: 0,
    archived: 0,
    pinned: 0,
  });

  useEffect(() => {
    // Quick timeout to show dashboard immediately
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  // Refresh stats every time dashboard is visited
  useEffect(() => {
    const handlePopState = () => {
      if (user) {
        fetchStats();
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user]);

  // Auto-refresh stats every 5 seconds when on dashboard
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      fetchStats();
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Fetch total notes (non-archived)
      const { count: total } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_archived', false);

      // Fetch favorites
      const { count: favorites } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_favorite', true)
        .eq('is_archived', false);

      // Fetch archived
      const { count: archived } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_archived', true);

      // Fetch pinned
      const { count: pinned } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_pinned', true)
        .eq('is_archived', false);

      setStats({
        total: total || 0,
        favorites: favorites || 0,
        archived: archived || 0,
        pinned: pinned || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
            NoteSaver Pro
          </h1>
          <div className="flex items-center gap-4">
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
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Welcome, {profile?.full_name || 'User'}! 👋
          </h2>
          <p className="text-gray-400 text-lg">Your note management dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div 
            onClick={() => navigate('/notes')}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all cursor-pointer hover:scale-105"
          >
            <h3 className="text-gray-400 text-sm mb-2">Total Notes</h3>
            <p className="text-4xl font-bold text-primary-500">{stats.total}</p>
          </div>
          <div 
            onClick={() => navigate('/favorites')}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500 transition-all cursor-pointer hover:scale-105"
          >
            <h3 className="text-gray-400 text-sm mb-2">Favorites</h3>
            <p className="text-4xl font-bold text-yellow-500">{stats.favorites}</p>
          </div>
          <div 
            onClick={() => navigate('/archived')}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-400 transition-all cursor-pointer hover:scale-105"
          >
            <h3 className="text-gray-400 text-sm mb-2">Archived</h3>
            <p className="text-4xl font-bold text-gray-500">{stats.archived}</p>
          </div>
          <div 
            onClick={() => navigate('/notes')}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all cursor-pointer hover:scale-105"
          >
            <h3 className="text-gray-400 text-sm mb-2">Pinned</h3>
            <p className="text-4xl font-bold text-green-500">{stats.pinned}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <p className="text-gray-400 mb-6 text-lg">Ready to organize your thoughts?</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate('/notes/new')}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-semibold transition-all hover:scale-105"
            >
              ✨ Create Note
            </button>
            <button
              onClick={() => navigate('/notes')}
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all hover:scale-105"
            >
              View All Notes
            </button>
            <button
              onClick={() => navigate('/favorites')}
              className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold transition-all hover:scale-105"
            >
              View Favorites
            </button>
            <button
              onClick={() => navigate('/archived')}
              className="px-8 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-all hover:scale-105"
            >
              View Archived
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-6">✨ Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => navigate('/notes')}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 cursor-pointer hover:border-primary-500 transition-all hover:scale-105"
            >
              <h3 className="text-xl font-semibold mb-2">📝 Create Notes</h3>
              <p className="text-gray-400">Write and organize your thoughts</p>
              <p className="text-primary-500 text-sm mt-2">Click to go to Notes →</p>
            </div>
            <div 
              onClick={() => navigate('/notes')}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 cursor-pointer hover:border-purple-500 transition-all hover:scale-105"
            >
              <h3 className="text-xl font-semibold mb-2">🎨 Color Code</h3>
              <p className="text-gray-400">8 beautiful colors to organize</p>
              <p className="text-purple-500 text-sm mt-2">Click to go to Notes →</p>
            </div>
            <div 
              onClick={() => navigate('/notes')}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 cursor-pointer hover:border-green-500 transition-all hover:scale-105"
            >
              <h3 className="text-xl font-semibold mb-2">🔍 Search</h3>
              <p className="text-gray-400">Find any note instantly</p>
              <p className="text-green-500 text-sm mt-2">Click to go to Notes →</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
