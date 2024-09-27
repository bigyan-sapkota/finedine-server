import { model, Model, Schema, Types } from 'mongoose';

export type BookingSchema = {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;

  user: Types.ObjectId;
  table: Types.ObjectId;
  startsAt: NativeDate;
  endsAt: NativeDate;
  isCancelled: boolean;
};

const bookingSchema = new Schema<BookingSchema, Model<BookingSchema>>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  table: {
    type: Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  isCancelled: { type: Boolean, required: true, default: false }
});

export const Booking = model<BookingSchema, Model<BookingSchema>>('Booking', bookingSchema);

let bookingProperties = '';
bookingSchema.eachPath((path) => {
  bookingProperties += ' ';
  bookingProperties += path;
});

export const selectBookingProperties = bookingProperties;
