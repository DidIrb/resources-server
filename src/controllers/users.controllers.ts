import { Request, Response } from 'express';
import { User } from '../types/app.types';
import bcrypt from "bcryptjs";
import { getUserFromJson, update } from "../utils/api";
import fs from 'fs';
import _ from "lodash"
const users = getUserFromJson();


const getUsers = (req: Request, res: Response) => {
    const users = getUserFromJson();
    const usersWithoutPassword = users.map((user: User) => {
        const { password, ...rest } = user;
        return rest;
    });
    res.status(200).json(usersWithoutPassword);
};

const createUser = async (req: Request, res: Response) => {
    const newUser: User = req.body;
    const newUserId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.id = newUserId;
    newUser.password = hashedPassword;
    const userData = _.omit(newUser, ["secret"]);
    users.push(newUser);
    fs.writeFileSync('db/users.json', JSON.stringify(users, null, 2));
    res.status(200).json({message: "User created successfully"});
};

const updateUser = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = users.find((user: User) => user.id === id);
    if (user) {
        const updatedUsers = update(users, id, req.body);
        fs.writeFileSync('db/users.json', JSON.stringify(updatedUsers, null, 2));
        res.send('User updated successfully');
    } else {
        res.status(404).send({ error: 'User not found' });
    }
};

const deleteUser = (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex((user: User) => user.id === id);
    if (index !== -1) {
        users.splice(index, 1);
        fs.writeFileSync('db/users.json', JSON.stringify(users, null, 2));
        res.send({ message: 'User deleted successfully' }).status(200)
    } else {
        res.status(404).send({ error: 'User not found' })
    }
};

export default { getUsers, updateUser, createUser, deleteUser };