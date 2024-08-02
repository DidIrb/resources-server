import { Document, PaginateModel } from 'mongoose';

interface ResourcesPaginateModel<T extends Document> extends PaginateModel<T> {}

export default ResourcesPaginateModel;
