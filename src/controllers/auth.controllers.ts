// ALLOW USER LOGIN AND LOGOUT FROM JSON DATA
import { Request, Response } from 'express';
import { getUserFromJson } from '../utils/api';
import bcrypt from "bcryptjs";
import jwt, { Secret } from 'jsonwebtoken';
import config from '../config/auth.config';
import _ from "lodash"

const signin = async (req: Request, res: Response) => {
    const users = getUserFromJson();
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ error: `Username or password can't be empty` });
        }
        const user = users.find(u => u.username === username || u.email === username);
        if (!user) {
            return res.status(400).json({ error: `Incorrect username and password combination` })
        } else {
            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(400).json({ error: `Incorrect password!` })
            // const accessToken = jwt.sign({ user: user.id }, config.secret as Secret, { expiresIn: '30m' });
            // res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 30 * 1000 * 60 });
            const accessToken = jwt.sign({ user: user.id }, config.secret as Secret, { expiresIn: '60h' });
            res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 60 * 60 * 60 * 1000 }); // 60 hours
        }

        const userData = _.omit(user, ["password"]);
        res.status(200).json({
            message: `Login Successful Welcome ${user.username}`,
            data: userData
        })
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}

const signout = async (req: Request, res: Response) => {
    const users = getUserFromJson();
    try {
        const token = req?.cookies?.access_token;
        if (!token) return res.status(500).json({ error: 'Internal Server Error' })
        res.clearCookie('access_token', { httpOnly: true });
        return res.status(200).json({ message: 'User logged out successfully' })
    } catch (error: any) {
        console.error("Error logging out:", error);
        return res.status(200).json({ message: error.message })
    }
};

export default { signin, signout }