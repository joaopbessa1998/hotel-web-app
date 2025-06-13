import api from '@/services/api';

interface Props {
  hotel: any;
  onDelete: (urls: string[]) => void;
}

export default function PhotoGallery({ hotel, onDelete }: Props) {
  const remove = async (url: string) => {
    const filename = url.split('/').pop();
    await api.delete(`/hotels/my/photo/${filename}`);
    onDelete(hotel.photos.filter((u: string) => u !== url));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {hotel.photos.map((u: string) => (
        <div key={u} className="relative group overflow-hidden rounded">
          <img src={u} alt="" className="w-full h-32 object-cover" />
          <button
            onClick={() => remove(u)}
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 text-white text-lg"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
