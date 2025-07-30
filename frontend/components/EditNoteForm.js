// frontend/components/EditNoteForm.js
import { useState } from 'react';

export default function EditNoteForm({ initialData, onSave }) {
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);
  const [isPublic, setIsPublic] = useState(initialData.isPublic);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave({ title, content, isPublic });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Title</label>
        <input
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block font-medium">Content</label>
        <textarea
          className="w-full border p-2 rounded"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          required
        />
      </div>
      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <span className="ml-2">Make Public</span>
        </label>
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
