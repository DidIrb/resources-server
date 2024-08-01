import mongoose, { Schema, Document } from 'mongoose';

interface IType extends Document {
  value: string;
}

const typeSchema: Schema = new Schema({
  value: { type: String, required: true, unique: true },
});

const Type = mongoose.model<IType>('Type', typeSchema);

export default Type;
