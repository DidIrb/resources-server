import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import config from '../config/auth.config';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;
  if (token) {
    console.log("Access token provided");
    try {
      const decoded = jwt.verify(token, config.secret as Secret) as JwtPayload;
      (req as Request & { user?: any }).user = decoded.user;
      next(); 
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ error: 'Access denied, No token provided', isToken: false });
  }
};

export default validateToken;
