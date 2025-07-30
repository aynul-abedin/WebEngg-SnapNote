import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get('/api/notes');
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading notes...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to SnapNote</h1>
        <p className="text-gray-600">Discover and share notes from the community</p>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No notes have been shared yet.</p>
          <Link href="/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Create the first note
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div key={note._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{note.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {note.content.length > 150 
                  ? `${note.content.substring(0, 150)}...` 
                  : note.content
                }
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span>By {note.authorName}</span>
                <span>{formatDate(note.createdAt)}</span>
              </div>
              <Link 
                href={`/view/${note._id}`}
                className="block w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
              >
                View Full Note
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}