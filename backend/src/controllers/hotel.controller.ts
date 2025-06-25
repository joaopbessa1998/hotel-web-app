import { RequestHandler } from 'express';
import Hotel from '../models/Hotel.model';
import User from '../models/User.model';

// criar hotel
export const createHotel: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const {
      name,
      description,
      stars,
      address,
      contact,
      roomTypes,
      facilities,
      photos,
    } = req.body;

    const exists = await Hotel.findOne({ owner: userId });
    if (exists) {
      res.status(400).json({ message: 'Já tens um hotel registado.' });
      return;
    }

    const totalRooms = Array.isArray(roomTypes)
      ? (roomTypes as any[]).reduce((sum, r) => sum + Number(r.quantity), 0)
      : 0;

    const newHotel = await Hotel.create({
      name,
      description,
      stars,
      address,
      contact,
      roomTypes,
      totalRooms,
      facilities,
      photos,
      owner: userId,
    });
    await User.findByIdAndUpdate(userId, { role: 'hotel' });

    res
      .status(201)
      .json({ message: 'Hotel criado com sucesso', hotel: newHotel });
  } catch (error) {
    console.error('Erro ao criar hotel:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// list todos os hotéis
export const getAllHotels: RequestHandler = async (req, res) => {
  try {
    const q = req.query as Record<string, string | undefined>;
    const {
      city,
      stars,
      name,
      wifi,
      pool,
      parking,
      petFriendly,
      evCharger,
      roomService,
      airConditioning,
      fitnessCenter,
      spa,
      onSiteRestaurant,
      bar,
      laundry,
      kitchenette,
      balcony,
      oceanView,
      breakfastIncluded,
      freeCancellation,
      privateBathroom,
      businessCenter,
      meetingRooms,
      wheelchairAccess,
      reception24h,
      elevator,
    } = q;

    const filter: Record<string, any> = {};
    if (city) filter['address.city'] = city;
    if (stars) filter.stars = Number(stars);
    if (name) filter.name = { $regex: name, $options: 'i' };

    const facilityFlags: [string, string | undefined][] = [
      ['wifi', wifi],
      ['pool', pool],
      ['parking', parking],
      ['petFriendly', petFriendly],
      ['evCharger', evCharger],
      ['roomService', roomService],
      ['airConditioning', airConditioning],
      ['fitnessCenter', fitnessCenter],
      ['spa', spa],
      ['onSiteRestaurant', onSiteRestaurant],
      ['bar', bar],
      ['laundry', laundry],
      ['kitchenette', kitchenette],
      ['balcony', balcony],
      ['oceanView', oceanView],
    ];
    const allFacilities = facilityFlags
      .filter(([, v]) => v === 'true')
      .map(([k]) => k);
    if (allFacilities.length) filter.facilities = { $all: allFacilities };

    const boolFlags: [string, string | undefined][] = [
      ['breakfastIncluded', breakfastIncluded],
      ['freeCancellation', freeCancellation],
      ['privateBathroom', privateBathroom],
      ['businessCenter', businessCenter],
      ['meetingRooms', meetingRooms],
      ['wheelchairAccess', wheelchairAccess],
      ['reception24h', reception24h],
      ['elevator', elevator],
    ];
    boolFlags.forEach(([k, v]) => {
      if (v === 'true') filter[k] = true;
    });

    const hotels = await Hotel.find(filter);
    res.json(hotels);
  } catch (err) {
    console.error('Erro ao listar hotéis:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// hotel por id
export const getHotelById: RequestHandler = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      res.status(404).json({ message: 'Hotel não encontrado' });
      return;
    }
    res.json(hotel);
  } catch (error) {
    console.error('Erro ao buscar hotel:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// update hotel por id
export const updateHotelById: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      res.status(404).json({ message: 'Hotel não encontrado' });
      return;
    }
    if (hotel.owner.toString() !== userId) {
      res.status(403).json({ message: 'Acesso negado. Este hotel não é seu.' });
      return;
    }
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    res.json({ message: 'Hotel atualizado', hotel: updatedHotel });
  } catch (error) {
    console.error('Erro ao atualizar hotel:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// apagar hotel por id
export const deleteHotelById: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      res.status(404).json({ message: 'Hotel não encontrado' });
      return;
    }
    if (hotel.owner.toString() !== userId) {
      res.status(403).json({ message: 'Acesso negado. Este hotel não é seu.' });
      return;
    }
    await hotel.deleteOne();
    res.json({ message: 'Hotel removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover hotel:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// operacoes "meu hotel"
export const getMyHotel: RequestHandler = async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ owner: (req as any).userId });
    if (!hotel) {
      res.status(404).json({ message: 'Nenhum hotel registado' });
      return;
    }
    res.json(hotel);
  } catch (error) {
    console.error('Erro ao buscar meu hotel:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateMyHotel: RequestHandler = async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndUpdate(
      { owner: (req as any).userId },
      req.body,
      { new: true, runValidators: true },
    );
    if (!hotel) {
      res.status(404).json({ message: 'Nenhum hotel registado' });
      return;
    }
    res.json(hotel);
  } catch (error) {
    console.error('Erro ao atualizar meu hotel:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const updateMyFacilities: RequestHandler = async (req, res) => {
  try {
    const { facilities, ...flags } = req.body;
    const update: any = { ...(facilities && { facilities }), ...flags };
    const hotel = await Hotel.findOneAndUpdate(
      { owner: (req as any).userId },
      update,
      { new: true, runValidators: true },
    );
    if (!hotel) {
      res.status(404).json({ message: 'Nenhum hotel registado' });
      return;
    }
    res.json(hotel);
  } catch (error) {
    console.error('Erro ao atualizar facilidades:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const deleteMyPhoto: RequestHandler = async (req, res) => {
  try {
    const hotel = await Hotel.findOneAndUpdate(
      { owner: (req as any).userId },
      {
        $pull: {
          photos: {
            $regex: req.params.filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          },
        },
      },
      { new: true },
    );
    if (!hotel) {
      res.status(404).json({ message: 'Nenhum hotel registado' });
      return;
    }
    res.json(hotel);
  } catch (error) {
    console.error('Erro ao remover foto:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
