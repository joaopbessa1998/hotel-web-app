import { useState, useEffect } from 'react';
import api from '@/services/api';
import HotelCard from '@/components/Hotel/HotelCard';
import FiltersSidebar from '@/components/Hotel/FiltersSidebar';

interface Hotel {
  _id: string;
  name: string;
  description: string;
  stars: number;
  photos: string[];
  address: { city: string; country: string };
}

export function HotelsList() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [city, setCity] = useState('');
  const [stars, setStars] = useState('');

  useEffect(() => {
    const params: any = {};
    if (city) params.city = city;
    if (stars) params.stars = stars;
    api.get('/hotels', { params }).then((r) => setHotels(r.data));
  }, [city, stars]);

  return (
    <div className="flex p-6 gap-6">
      <FiltersSidebar
        city={city}
        setCity={setCity}
        stars={stars}
        setStars={setStars}
      />

      <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((h) => (
          <HotelCard key={h._id} hotel={h} />
        ))}
      </div>
    </div>
  );
}
