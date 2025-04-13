import { RequestHandler } from 'express';
import Hotel from '../models/Hotel.model';

// ------------------------------
// Cria hotel
// ------------------------------
export const createHotel: RequestHandler = async (req, res) => {
  try {
    // O id do user (role: hotel) vem do middleware checkAuth
    const userId = (req as any).userId;

    // Exemplo de destructuring do body
    const {
      name,
      description,
      stars,
      address,
      contact,
      rooms,
      totalRooms,
      facilities,
      photos,
    } = req.body;

    // Criar o hotel associando o dono (owner) a userId
    const newHotel = await Hotel.create({
      name,
      description,
      stars,
      address,
      contact,
      rooms,
      totalRooms,
      facilities,
      photos,
      owner: userId,
    });

    res
      .status(201)
      .json({ message: 'Hotel criado com sucesso', hotel: newHotel });
  } catch (error) {
    console.error('Erro ao criar hotel:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// ------------------------------
// Listar todos os hotéis
// (aceita filtros no query string? city, stars, etc.)
// ------------------------------
export const getAllHotels: RequestHandler = async (req, res) => {
  try {
    // Se quiseres filtrar por query:
    // ex: /hotels?city=Porto&stars=5
    const { city, stars, name } = req.query;

    // Montar um "filtro" para .find()
    const filter: any = {};

    if (city) {
      filter['address.city'] = city; // city é text, ex: "Porto"
    }

    if (stars) {
      // stars é string, converter para número
      filter.stars = Number(stars);
    }

    if (name) {
      // buscar por substring no name
      filter.name = { $regex: name, $options: 'i' };
    }

    const hotels = await Hotel.find(filter);
    res.json(hotels);
  } catch (error) {
    console.error('Erro ao listar hotéis:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// ------------------------------
// Buscar hotel por ID
// ------------------------------
export const getHotelById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);

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

// ------------------------------
// Atualizar hotel
// ------------------------------
export const updateHotel: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    // Verificar se este hotel pertence ao userId
    const hotel = await Hotel.findById(id);
    if (!hotel) {
      res.status(404).json({ message: 'Hotel não encontrado' });
      return;
    }
    // se o userId não é dono (owner) do hotel, bloqueia
    if (hotel.owner.toString() !== userId) {
      res.status(403).json({ message: 'Acesso negado. Este hotel não é seu.' });
    }

    // Atualizar com base no body
    const {
      name,
      description,
      stars,
      address,
      contact,
      rooms,
      totalRooms,
      facilities,
      photos,
    } = req.body;

    const updatedHotel = await Hotel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        stars,
        address,
        contact,
        rooms,
        totalRooms,
        facilities,
        photos,
      },
      { new: true },
    );

    res.json({ message: 'Hotel atualizado', hotel: updatedHotel });
  } catch (error) {
    console.error('Erro ao atualizar hotel:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// ------------------------------
// Apagar hotel
// ------------------------------
export const deleteHotel: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      res.status(404).json({ message: 'Hotel não encontrado' });
      return;
    }
    // verificar se é o dono
    if (hotel.owner.toString() !== userId) {
      res.status(403).json({ message: 'Acesso negado. Este hotel não é seu.' });
    }

    await hotel.deleteOne(); // ou Hotel.findByIdAndDelete(id);

    res.json({ message: 'Hotel removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover hotel:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
