// src/components/HotelOwner/PhotoUploader.tsx
import { useState, FormEvent } from 'react';
import api from '@/services/api';

interface Props {
  hotelId: string;
  onUploaded: (url: string) => void;
}

export default function PhotoUploader({ hotelId, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    try {
      const data = new FormData();
      data.append('photo', file);
      const res = await api.post(`/upload/hotel/${hotelId}`, data);
      onUploaded(res.data.url);
      setFile(null);
    } catch (err) {
      console.error('Erro no upload:', err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-4"
    >
      <label className="w-full sm:w-auto bg-gray-200 px-4 py-2 rounded cursor-pointer hover:bg-gray-300">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
        {file ? file.name : 'Escolher foto'}
      </label>
      <button
        disabled={!file || busy}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {busy ? 'Enviando…' : 'Upload'}
      </button>
    </form>
  );
}
