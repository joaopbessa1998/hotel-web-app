// src/components/FiltersSidebar.tsx

import { ChangeEvent } from 'react';

export type BoolFilters = {
  // Original
  wifi: boolean;
  pool: boolean;
  parking: boolean;
  petFriendly: boolean;
  evCharger: boolean;
  roomService: boolean;
  breakfastIncluded: boolean;
  freeCancellation: boolean;
  privateBathroom: boolean;
  // Novos filtros
  airConditioning: boolean; // Ar condicionado
  fitnessCenter: boolean; // Ginásio
  spa: boolean; // Spa
  onSiteRestaurant: boolean; // Restaurante no local
  bar: boolean; // Bar
  laundry: boolean; // Lavandaria
  kitchenette: boolean; // Kitchenette
  balcony: boolean; // Varanda
  oceanView: boolean; // Vista para o mar
  businessCenter: boolean; // Centro de negócios
  meetingRooms: boolean; // Salas de reuniões
  wheelchairAccess: boolean; // Acesso para cadeiras de rodas
  reception24h: boolean; // Recepção 24h
  elevator: boolean; // Elevador
};

interface Props {
  city: string;
  setCity: (v: string) => void;
  stars: string;
  setStars: (v: string) => void;
  filters: BoolFilters;
  setFilters: (f: BoolFilters) => void;
}

export default function FiltersSidebar({
  city,
  setCity,
  stars,
  setStars,
  filters,
  setFilters,
}: Props) {
  const toggle = (k: keyof BoolFilters) =>
    setFilters({ ...filters, [k]: !filters[k] });

  return (
    <aside className="w-64 space-y-6">
      {/* Cidade */}
      <div>
        <label htmlFor="city" className="block text-sm font-medium">
          Cidade
        </label>
        <input
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
        />
      </div>

      {/* Estrelas */}
      <div>
        <label htmlFor="stars" className="block text-sm font-medium">
          Estrelas
        </label>
        <select
          id="stars"
          value={stars}
          onChange={(e) => setStars(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
        >
          <option value="">Qualquer</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}★
            </option>
          ))}
        </select>
      </div>

      {/* Comodidades */}
      <div>
        <p className="font-semibold mb-2">Comodidades</p>
        {[
          ['wifi', 'Wi-Fi grátis'],
          ['pool', 'Piscina'],
          ['parking', 'Estacionamento'],
          ['petFriendly', 'Pet Friendly'],
          ['evCharger', 'Carregador EV'],
          ['roomService', 'Serviço de quarto'],
          ['airConditioning', 'Ar condicionado'],
          ['fitnessCenter', 'Ginásio'],
          ['spa', 'Spa'],
          ['onSiteRestaurant', 'Restaurante no local'],
          ['bar', 'Bar'],
          ['laundry', 'Lavandaria'],
          ['kitchenette', 'Kitchenette'],
          ['balcony', 'Varanda'],
          ['oceanView', 'Vista para o mar'],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters[key as keyof BoolFilters]}
              onChange={() => toggle(key as keyof BoolFilters)}
            />
            {label}
          </label>
        ))}
      </div>

      {/* Serviços e Instalações */}
      <div>
        <p className="font-semibold mb-2">Serviços & Instalações</p>
        {[
          ['businessCenter', 'Centro de negócios'],
          ['meetingRooms', 'Salas de reunião'],
          ['reception24h', 'Recepção 24h'],
          ['elevator', 'Elevador'],
          ['wheelchairAccess', 'Acesso para cadeiras de rodas'],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters[key as keyof BoolFilters]}
              onChange={() => toggle(key as keyof BoolFilters)}
            />
            {label}
          </label>
        ))}
      </div>

      {/* Condições */}
      <div>
        <p className="font-semibold mb-2">Condições</p>
        {[
          ['breakfastIncluded', 'Peq-almoço incluído'],
          ['freeCancellation', 'Cancelamento grátis'],
          ['privateBathroom', 'Casa de banho privada'],
        ].map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={filters[key as keyof BoolFilters]}
              onChange={() => toggle(key as keyof BoolFilters)}
            />
            {label}
          </label>
        ))}
      </div>
    </aside>
  );
}
