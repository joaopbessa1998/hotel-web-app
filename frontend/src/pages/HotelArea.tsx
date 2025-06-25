import { useEffect, useState } from 'react';
import api from '@/services/api';
import HotelForm from '@/components/HotelOwner/HotelForm';
import PhotoUploader from '@/components/HotelOwner/PhotoUploader';
import PhotoGallery from '@/components/HotelOwner/PhotoGallery';
import FacilitiesForm from '@/components/HotelOwner/FacilitiesForm';
import ReservationsTable from '@/components/HotelOwner/ReservationsTable';

type Tab = 'details' | 'photos' | 'facilities' | 'reservations';

export function HotelArea() {
  const [hotel, setHotel] = useState<any | false | null>(null);
  const [tab, setTab] = useState<Tab>('details');

  useEffect(() => {
    api
      .get('/hotels/my')
      .then(({ data }) => setHotel(data))
      .catch((err) => {
        if (err.response?.status === 404) setHotel(false);
        else console.error(err);
      });
  }, []);

  if (hotel === null) {
    return <p className="p-6 text-center">A carregar hotel…</p>;
  }
  if (hotel === false) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Registar o seu Hotel</h2>
        <HotelForm hotel={null} onSave={(h) => setHotel(h)} />
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'details', label: 'Detalhes' },
    { key: 'photos', label: 'Fotografias' },
    { key: 'facilities', label: 'Comodidades' },
    { key: 'reservations', label: 'Reservas' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Gestão do Hotel</h2>

      {/* Tabs */}
      <nav className="flex border-b mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={
              'px-4 py-2 -mb-px font-medium ' +
              (tab === t.key
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-indigo-600')
            }
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Tab panels */}
      {tab === 'details' && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <HotelForm hotel={hotel} onSave={setHotel} />
        </div>
      )}

      {tab === 'photos' && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <PhotoUploader
            hotelId={hotel._id}
            onUploaded={(url) =>
              setHotel({ ...hotel, photos: [...hotel.photos, url] })
            }
          />
          <PhotoGallery
            hotel={hotel}
            onDelete={(list) => setHotel({ ...hotel, photos: list })}
          />
        </div>
      )}

      {tab === 'facilities' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <FacilitiesForm hotel={hotel} onSave={setHotel} />
        </div>
      )}

      {tab === 'reservations' && (
        <div className="bg-white p-6 rounded-lg shadow">
          <ReservationsTable hotelId={hotel._id} />
        </div>
      )}
    </div>
  );
}
