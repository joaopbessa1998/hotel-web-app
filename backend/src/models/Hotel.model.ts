import mongoose, { Document, Schema } from 'mongoose';

export interface IHotel extends Document {
  name: string;
  description: string;
  stars: number;
  address: {
    street: string;
    number: string;
    postalcode: string;
    city: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  rooms: {};
  totalRooms: number;
  facilities: string[];
  photos: string[];
  owner: mongoose.Types.ObjectId; // associar hotel ao user role: hotel
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

const RoomSchema = new Schema({
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const HotelSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    address: { type: AddressSchema, required: true },
    contact: { type: ContactSchema, required: true },
    //rooms: { type: RoomSchema, default: [] },
    rooms: { type: [RoomSchema], default: [] },
    totalRooms: { type: Number, default: 0 },
    facilities: { type: [String], default: [] },
    photos: { type: [String], default: [] },
    // owner é o userId do hotel que possui o registo
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IHotel>('Hotel', HotelSchema);
