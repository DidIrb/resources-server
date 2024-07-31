import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import config from '../config/auth.config';
import User from '../models/user.model';

const signin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: `Username or password can't be empty` });
        }

        const user = await User.findOne({ $or: [{ username }, { email: username }] });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: `Incorrect username and password combination` });
        }
        
        const accessToken = jwt.sign({ user: user.id }, config.secret as Secret, { expiresIn: '30m' });
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            maxAge: 30 * 1000 * 60,
            sameSite: 'none',
            secure: true,
        });

        const userData = { _id: user._id, username: user.username, email: user.email };
        res.status(200).json({
            message: `Login Successful. Welcome, ${user.username}`,
            data: userData,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

const signout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('access_token', { httpOnly: true });
        return res.status(200).json({ message: 'User logged out successfully' });
    } catch (error: any) {
        console.error("Error logging out:", error);
        return res.status(200).json({ message: error.message });
    }
};

export default { signin, signout };
