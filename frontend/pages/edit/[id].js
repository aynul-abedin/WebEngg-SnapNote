// frontend/pages/edit/[id].js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from '../../utils/axios';
import EditNoteForm from '../../components/EditNoteForm';

export default function EditNotePage() {
  const router = useRouter();
  const { id } = router.query;
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axiosInstance.get(`/api/notes/${id}`)
        .then(res => {
          setNote(res.data);
          setLoading(false);
        })
        .catch(() => {
          alert('Note not found or access denied');
          router.push('/my-notes');
        });
    }
  }, [id]);

  const handleSave = async (updatedNote) => {
    try {
      await axiosInstance.put(`/api/notes/${id}`, updatedNote);
      router.push('/my-notes');
    } catch (err) {
      alert('Failed to update note');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
      <EditNoteForm initialData={note} onSave={handleSave} />
    </div>
  );
}
