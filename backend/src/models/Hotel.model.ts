import mongoose, { Document, Schema } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  description: string;
  stars: number;
  address: {
    street: string;
    number: string;
    postalCode: string;
    city: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  // substituído rooms/totalRooms por roomTypes
  roomTypes: {
    type: string;
    quantity: number;
    nightlyRate: number;
  }[];
  facilities: string[];
  photos: string[];
  owner: mongoose.Types.ObjectId;
}

const AddressSchema = new Schema({
  street: { type: String, required: true },
  number: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
});

const ContactSchema = new Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
});

const RoomTypeSchema = new Schema({
  type: { type: String, required: true }, // ex.: "Double"
  quantity: { type: Number, required: true, min: 1 },
  nightlyRate: { type: Number, required: true, min: 0 }, // € por noite
});

const HotelSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    address: { type: AddressSchema, required: true },
    contact: { type: ContactSchema, required: true },
    roomTypes: { type: [RoomTypeSchema], default: [] },
    facilities: { type: [String], default: [] },
    photos: { type: [String], default: [] },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IHotel>('Hotel', HotelSchema);
