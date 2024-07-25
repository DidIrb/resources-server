import { Request, Response } from 'express';
import { User } from '../types/app.types';
import bcrypt from "bcryptjs";
import { getNextId, getUserFromJson, update } from "../utils/api";
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash"


const getUsers = (req: Request, res: Response) => {
    try {
        const users = getUserFromJson();
        const usersWithoutPassword = users.map((user: User) => {
            const { password, ...rest } = user;
            return rest;
        });
        res.status(200).json(usersWithoutPassword);
    } catch (error) {
        res.status(500).send({ error: 'Error retrieving users' });
    }
};

const createUser = async (req: Request, res: Response) => {
    try {
        const users = getUserFromJson();
        const newUser = req.body;
        const { secret, ...userData } = newUser;

        const existingUser = users.find(user => user.email === newUser.email || user.username === newUser.username);
        if (existingUser) {
            return res.status(400).json({ error: 'User with same email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        const id = getNextId(users);
        const role = users.length === 0 ? 'super_admin' : 'user';
        const user = { id, ...userData, password: hashedPassword, role, createdAt: new Date(), updatedAt: new Date() };
        
        users.push(user);
        fs.writeFileSync('db/users.json', JSON.stringify(users, null, 2));
        res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        res.status(500).send({ error: 'Error creating user' });
    }
};

const updateUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const users = getUserFromJson();
        const user = users.find((user: User) => user.id === id);

        if (user) {
            const { password, ...otherUpdates } = req.body;

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                otherUpdates.password = hashedPassword;
            }

            const updatedUsers = update(users, id, { ...otherUpdates, updatedAt: new Date() });
            fs.writeFileSync('db/users.json', JSON.stringify(updatedUsers, null, 2));
            res.status(200).json({ message: "User updated successfully" });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error updating user' });
    }
};

const deleteUser = (req: Request, res: Response) => {
    try {
        const users = getUserFromJson();
        const id = parseInt(req.params.id);
        const index = users.findIndex((user: User) => user.id === id);
        if (index !== -1) {
            users.splice(index, 1);
            fs.writeFileSync('db/users.json', JSON.stringify(users, null, 2));
            res.json({ message: 'User deleted successfully' }).status(200)
        } else {
            res.status(404).send({ error: 'User not found' })
        }
    } catch (error) {
        res.status(500).send({ error: 'Error deleting user' });
    }
};

export default { getUsers, updateUser, createUser, deleteUser };