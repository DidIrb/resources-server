import mongoose, { Schema, Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import ResourcesPaginateModel from '../types/pagination';

interface ResourcesModel extends Document {
    icon: string;
    title: string;
    description: string;
    type: string;
    topic: string;
    tags: string[];
    link: string;
    updatedAt: Date;
    createdAt: Date;
}

const resourcesSchema = new Schema<ResourcesModel>({
    icon: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    type: { type: String, required: true },
    topic: { type: String, required: true },
    link: { type: String },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

resourcesSchema.plugin(paginate);
const Resources = mongoose.model<ResourcesModel, ResourcesPaginateModel<ResourcesModel>>('Resources', resourcesSchema);

export default Resources;
