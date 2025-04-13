import mongoose, { Document, mongo, Schema } from 'mongoose';

// interface para o documento
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'hospede' | 'hospede';
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ['hospede', 'hotel'],
      default: 'hospede',
    },
  },
  { timestamps: true }, // faz o mongoose criar createdAt e updatedAt automaticamente
);

export default mongoose.model<IUser>('User', UserSchema);
