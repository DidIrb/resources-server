import mongoose, { Schema, Document } from 'mongoose';

interface ITopic extends Document {
  value: string;
}

const topicSchema: Schema = new Schema({
  value: { type: String, required: true, unique: true },
});

const Topic = mongoose.model<ITopic>('Topic', topicSchema);

export default Topic;
