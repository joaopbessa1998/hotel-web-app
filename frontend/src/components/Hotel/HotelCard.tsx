// src/components/Hotel/HotelCard.tsx
import { Link } from 'react-router-dom';
import fallbackPhoto from '../../assets/no-photo.png';

interface Hotel {
  _id: string;
  name: string;
  stars: number;
  photos: string[];
  address: { city: string; country: string };
}

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const cover = hotel.photos[0] || fallbackPhoto; // fallback

  return (
    <Link
      to={`/hotels/${hotel._id}`}
      className="block rounded-lg shadow hover:shadow-md overflow-hidden bg-white"
    >
      {/* imagem */}
      <img src={cover} alt={hotel.name} className="h-40 w-full object-cover" />

      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-lg">{hotel.name}</h3>
        <p className="text-sm text-gray-500">
          {hotel.address.city}, {hotel.address.country}
        </p>
        <p className="text-yellow-500 text-sm">{'★'.repeat(hotel.stars)}</p>
        <button
          data-slot="button"
          className="mt-3 inline-flex rounded-md bg-blue-600 px-3 py-1.5 text-sm
                     text-white hover:bg-blue-700"
        >
          Ver detalhes
        </button>
      </div>
    </Link>
  );
}
