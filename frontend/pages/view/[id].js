import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

export default function ViewNotePage() {
  const router = useRouter();
  const { id } = router.query;
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchNote();
    }
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await axios.get(`/api/notes/${id}`);
      setNote(response.data);
    } catch (error) {
      console.error('Error fetching note:', error);
      alert('Note not found or access denied');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{note.title}</h1>
          <span className={note.isPublic ? 
            "bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full" : 
            "bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full"
          }>
            {note.isPublic ? 'Public' : 'Private'}
          </span>
        </div>

        <div className="prose max-w-none text-gray-600 mb-6 whitespace-pre-wrap">
          {note.content}
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
          <span>By: {note.authorName}</span>
          <span>Created: {formatDate(note.createdAt)}</span>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
