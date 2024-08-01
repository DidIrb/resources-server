import mongoose, { Schema, Document } from 'mongoose';

interface ITag extends Document {
  value: string;
}

const tagSchema: Schema = new Schema({
  value: { type: String, required: true, unique: true },
});

const Tag = mongoose.model<ITag>('Tag', tagSchema);

export default Tag;