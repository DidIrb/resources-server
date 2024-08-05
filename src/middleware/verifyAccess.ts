// Simple middleware to protect routes through roles
// Use access token to verify users role
import { Request, Response, NextFunction } from 'express';

export const verifyAccess = (req: Request, res: Response, next: NextFunction) => {
    const { role, id } = req.params;
    if (role === 'admin' || role === 'super_admin') {
        next();
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
}
