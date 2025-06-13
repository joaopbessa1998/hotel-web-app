import { useState, useEffect } from 'react';
import api from '@/services/api';
import HotelCard from '@/components/Hotel/HotelCard';
import FiltersSidebar, { BoolFilters } from '@/components/Hotel/FiltersSidebar';

const defaultFilters: BoolFilters = {
  // comodidades
  wifi: false,
  pool: false,
  parking: false,
  petFriendly: false,
  evCharger: false,
  roomService: false,
  airConditioning: false,
  fitnessCenter: false,
  spa: false,
  onSiteRestaurant: false,
  bar: false,
  laundry: false,
  kitchenette: false,
  balcony: false,
  oceanView: false,
  // condições
  breakfastIncluded: false,
  freeCancellation: false,
  privateBathroom: false,
  // serviços & instalações
  businessCenter: false,
  meetingRooms: false,
  wheelchairAccess: false,
  reception24h: false,
  elevator: false,
};

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
  const [filters, setFilters] = useState<BoolFilters>(defaultFilters);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (city) params.city = city;
    if (stars) params.stars = stars;

    // adiciona só flags true
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = 'true';
    });

    api.get('/hotels', { params }).then((r) => setHotels(r.data));
  }, [city, stars, filters]);

  return (
    <div className="flex p-6 gap-6">
      <FiltersSidebar
        city={city}
        setCity={setCity}
        stars={stars}
        setStars={setStars}
        filters={filters}
        setFilters={setFilters}
      />

      <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((h) => (
          <HotelCard key={h._id} hotel={h} />
        ))}
      </div>
    </div>
  );
}
