import { model, Model, Schema, Types } from 'mongoose';

type TableSchema = {
  _id: Types.ObjectId;
  tag: string;
  attribute: string;
  capacity: number;
  available: boolean;
};

const tableSchema = new Schema<TableSchema, Model<TableSchema>>({
  tag: { type: String, required: true },
  attribute: { type: String, required: true },
  capacity: { type: Number, required: true },
  available: { type: Boolean, required: true, default: true }
});

export const Table = model<TableSchema, Model<TableSchema>>('Table', tableSchema);
let tableProperties = '';
tableSchema.eachPath((path) => {
  tableProperties += ' ';
  tableProperties += path;
});

export const selectTableProperties = tableProperties;
