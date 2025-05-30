import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function FiltersSidebar({
  city,
  setCity,
  stars,
  setStars,
}: {
  city: string;
  setCity: (s: string) => void;
  stars: string;
  setStars: (s: string) => void;
}) {
  return (
    <aside className="w-64 space-y-4">
      <div>
        <Label>Cidade</Label>
        <Input value={city} onChange={(e) => setCity(e.target.value)} />
      </div>
      <div>
        <Label>Estrelas</Label>
        <select
          className="w-full rounded-md border px-3 py-2 text-sm"
          value={stars}
          onChange={(e) => setStars(e.target.value)}
        >
          <option value="">Qualquer</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}★
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
