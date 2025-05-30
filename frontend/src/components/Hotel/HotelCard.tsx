import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Hotel {
  _id: string;
  name: string;
  description: string;
  stars: number;
  photos: string[];
  address: { city: string; country: string };
}

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {hotel.name}
          <span className="text-sm">{'★'.repeat(hotel.stars)}</span>
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          {hotel.address.city}, {hotel.address.country}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="line-clamp-3">{hotel.description}</p>
        <Button asChild>
          <Link to={`/hotels/${hotel._id}`}>Ver detalhes</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
