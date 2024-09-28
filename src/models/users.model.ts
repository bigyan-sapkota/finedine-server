import { Document, model, Model, Schema, Types } from 'mongoose';

export type UserRole = 'user' | 'admin';
type UserSchema = {
  _id: Types.ObjectId;
  createdAt: NativeDate;
  updatedAt: NativeDate;

  name: string;
  email: string;
  image: string | undefined;
  role: UserRole;
  phone: number | undefined;
};

const userSchema = new Schema<UserSchema, Model<UserSchema>>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    phone: { type: String }
  },
  { timestamps: true }
);

export const User = model<UserSchema, Model<UserSchema>>('User', userSchema);
export type TUser = Document & UserSchema;

let userProperties = '';
userSchema.eachPath((path) => {
  userProperties += ' ';
  userProperties += path;
});
export const selectUserProperties = userProperties;
