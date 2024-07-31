import User from "../models/user.model";
import { env } from "./auth.config";
import mongoose from 'mongoose';

const hashedPassword = env.ADMIN_HASHED_PWD as string;
const uri = env.MONGO_URI as string;
const default_user = {
    username: env.ADMIN_USERNAME,
    password: hashedPassword,
    email: env.ADMIN_EMAIL,
    role: "super_admin",
}

async function mongoInit() {
    try {
        await mongoose.connect(uri);
        await mongoose.connection.db.admin().command({ ping: 1 });

        const superAdminUser = await User.findOne({ username: env.ADMIN_USERNAME });
        if (!superAdminUser) {
            await User.create(default_user);
            console.log('Super admin user created successfully.');
        } else {
            // Update the existing user
            // const updatedUser = await User.findOneAndUpdate(
            //     { username: env.ADMIN_USERNAME },
            //     { $set: { password: hashedPassword } },
            //     { new: true, runValidators: true }
            // );
            // console.log(updatedUser);
            console.log('Super admin user already exists.');
        }

        console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}


export default mongoInit;
