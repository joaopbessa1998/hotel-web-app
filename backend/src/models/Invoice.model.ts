import { Schema, model, Document } from 'mongoose';

export interface InvoiceDoc extends Document {
  guestId: Schema.Types.ObjectId;
  bookingId: Schema.Types.ObjectId;
  pdfUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<InvoiceDoc>(
  {
    guestId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    pdfUrl: { type: String, required: true },
  },
  { timestamps: true },
);

export default model<InvoiceDoc>('Invoice', InvoiceSchema);
