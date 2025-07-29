import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function MyNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if not authenticated (client-side only)
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      fetchMyNotes();
    }
  }, [user]);

  const fetchMyNotes = async () => {
    try {
      const response = await axios.get('/api/my-notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    setDeleteLoading(noteId);
    try {
      await axios.delete(`/api/notes/${noteId}`);
      setNotes(notes.filter(note => note._id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Show loading or redirect message
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading your notes...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
        <Link 
          href="/create"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create New Note
        </Link>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't created any notes yet.</p>
          <Link href="/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create your first note
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-800 flex-1">{note.title}</h3>
                <div className="flex items-center ml-2">
                  {note.isPublic ? (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Public</span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Private</span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 mb-4 line-clamp-3">
                {note.content.length > 150 
                  ? `${note.content.substring(0, 150)}...` 
                  : note.content
                }
              </p>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>Created: {formatDate(note.createdAt)}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(note._id)}
                  disabled={deleteLoading === note._id}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {deleteLoading === note._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
