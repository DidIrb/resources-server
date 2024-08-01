import { Request, Response } from 'express';
import bcrypt from "bcryptjs";
import _ from "lodash"
import User from '../models/user.model';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({}, '_id username email role');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error retrieving users' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const data = req.body;
        const existingUser = await User.findOne({ email: data.email });

        if (existingUser) {
            return res.status(400).json({ error: 'User with the same email already exists' });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = new User({
            ...data, password: hashedPassword, role: 'user', 
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully', user});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error creating user' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id; // Assuming the ID is a string (e.g., ObjectId)
        const { password, ...updates } = req.body;

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: id }, 
            { $set: updates },
            { new: true, select: '_id username email role' }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user: updatedUser});
    } catch (error) {
        res.status(500).send({ error: 'Error updating user' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const { password, role, ...updates } = req.body;

        if (role) {
            return res.status(403).json({ error: "You are not allowed to change your role" });
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword;
        }

        const updatedUser = await User.findOneAndUpdate(
            { _id: id }, 
            { $set: updates }, 
            { new: true, select: '-password' } 
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        res.status(500).send({ error: 'Error updating profile' });
    }
};



export const softDeleteUser = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const softDeletedUser = await User.findOneAndUpdate(
            { _id: id },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true, select: '-password' }
        );

        if (!softDeletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User soft-deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error soft-deleting user' });
    }
};


export default { getUsers, updateUser, createUser, softDeleteUser, updateProfile };