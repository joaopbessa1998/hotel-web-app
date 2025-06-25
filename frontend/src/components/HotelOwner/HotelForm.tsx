import { useState } from 'react';
import api from '@/services/api';

interface RoomType {
  type: string;
  quantity: number;
  nightlyRate: number;
}

interface Address {
  street: string;
  number: string;
  postalCode: string;
  city: string;
  country: string;
}

interface Contact {
  phone: string;
  email: string;
}

export interface HotelData {
  name: string;
  description: string;
  stars: number;
  address: Address;
  contact: Contact;
  roomTypes: RoomType[];
  facilities: string[];
  photos: string[];
}

interface Props {
  hotel: HotelData | null;
  onSave: (hotel: any) => void;
}

export default function HotelForm({ hotel, onSave }: Props) {
  const isEdit = Boolean(hotel);
  const [form, setForm] = useState<HotelData>({
    name: hotel?.name || '',
    description: hotel?.description || '',
    stars: hotel?.stars || 1,
    address: hotel?.address || {
      street: '',
      number: '',
      postalCode: '',
      city: '',
      country: '',
    },
    contact: hotel?.contact || { phone: '', email: '' },
    roomTypes: hotel?.roomTypes || [],
    facilities: hotel?.facilities || [],
    photos: hotel?.photos || [],
  });
  const [saving, setSaving] = useState(false);

  const updateField = <K extends keyof HotelData>(
    key: K,
    value: HotelData[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const addRoomType = () =>
    setForm((f) => ({
      ...f,
      roomTypes: [...f.roomTypes, { type: '', quantity: 1, nightlyRate: 0 }],
    }));
  const removeRoomType = (idx: number) =>
    setForm((f) => ({
      ...f,
      roomTypes: f.roomTypes.filter((_, i) => i !== idx),
    }));
  const updateRoomType = (idx: number, key: keyof RoomType, val: string) =>
    setForm((f) => {
      const types = [...f.roomTypes];
      types[idx] = { ...types[idx], [key]: key === 'type' ? val : Number(val) };
      return { ...f, roomTypes: types };
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = isEdit
        ? await api.put('/hotels/my', form)
        : await api.post('/hotels', form);
      const saved = res.data.hotel || res.data;
      onSave(saved);
    } catch (err) {
      console.error('Erro ao salvar hotel:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div>
        <label className="block font-medium mb-1">Nome</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block font-medium mb-1">Descrição</label>
        <textarea
          className="w-full border px-3 py-2 rounded"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          required
        />
      </div>

      {/* Estrelas */}
      <div>
        <label className="block font-medium mb-1">Estrelas</label>
        <input
          type="number"
          min={1}
          max={5}
          className="w-20 border px-3 py-2 rounded"
          value={form.stars}
          onChange={(e) => updateField('stars', Number(e.target.value))}
          required
        />
      </div>

      {/* Endereço */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(
          [
            'street',
            'number',
            'postalCode',
            'city',
            'country',
          ] as (keyof Address)[]
        ).map((field) => (
          <div key={field}>
            <label className="block font-medium mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={form.address[field]}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  address: { ...f.address, [field]: e.target.value },
                }))
              }
              required
            />
          </div>
        ))}
      </div>

      {/* Contacto */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Telefone</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.contact.phone}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                contact: { ...f.contact, phone: e.target.value },
              }))
            }
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={form.contact.email}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                contact: { ...f.contact, email: e.target.value },
              }))
            }
            required
          />
        </div>
      </div>

      {/* Tipologias de quarto */}
      <div>
        <h3 className="font-semibold mb-2">Tipologias de quarto</h3>
        <div className="space-y-4">
          {form.roomTypes.map((rt, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end"
            >
              <div>
                <label className="block text-sm mb-1">Tipo</label>
                <input
                  className="border px-2 py-1 rounded"
                  value={rt.type}
                  onChange={(e) => updateRoomType(idx, 'type', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Quantidade</label>
                <input
                  type="number"
                  min={1}
                  className="w-full border px-2 py-1 rounded"
                  value={rt.quantity}
                  onChange={(e) =>
                    updateRoomType(idx, 'quantity', e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">€ / Noite</label>
                <input
                  type="number"
                  min={0}
                  className="w-full border px-2 py-1 rounded"
                  value={rt.nightlyRate}
                  onChange={(e) =>
                    updateRoomType(idx, 'nightlyRate', e.target.value)
                  }
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => removeRoomType(idx)}
                className="self-start text-red-600 text-sm"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addRoomType}
          className="mt-3 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Adicionar tipologia
        </button>
      </div>

      {/* Botão Guardar */}
      <button
        type="submit"
        disabled={saving}
        className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {isEdit ? 'Atualizar Hotel' : 'Criar Hotel'}
      </button>
    </form>
  );
}
