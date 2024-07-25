import { NextFunction, Request , Response} from 'express';
import config from '../config/auth.config';

export const checkSecretPassword = (req: Request, res: Response, next: NextFunction) => {
    const { secret } = req.body;
    if (secret === config.secret_key) {
        next(); 
    } else {
        return res.status(401).json({ error: 'ACCESS DENIED' });
    }
}