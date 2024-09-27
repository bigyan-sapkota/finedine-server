import { model, Model, Schema, Types } from 'mongoose';

export type NotificationSchema = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  title: string;
  description: string | undefined;
  receivedAt: NativeDate;
};

const notificationSchema = new Schema<NotificationSchema, Model<NotificationSchema>>({
  title: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  description: { type: String },
  receivedAt: { type: Date, default: Date.now, required: true }
});

export const Notification = model<NotificationSchema, Model<NotificationSchema>>(
  'Notification',
  notificationSchema
);
