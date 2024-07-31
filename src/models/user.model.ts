import mongoose, { Schema, Document } from 'mongoose';
import mongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

enum UserRole {
    USER = 'user',
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
}

interface IUser extends Document {
    username: string;
    email: string;
    role: UserRole;
    password: string;
    isDeleted: boolean; 
    deletedAt: Date | null;
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    isDeleted: { type: Boolean, default: false }, 
    deletedAt: { type: Date, default: null }, 
});

userSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

userSchema.statics.updateUserById = async function (
    userId: string,
    updatedData: Partial<IUser>
): Promise<IUser | null> {
    try {
        const updatedUser = await this.findOneAndUpdate(
            { _id: userId },
            { $set: updatedData },
            { new: true }
        );

        return updatedUser;
    } catch (error) {
        throw new Error('Error updating user');
    }
};

const User = mongoose.model<IUser, SoftDeleteModel<IUser>>('User', userSchema);

export default User;
