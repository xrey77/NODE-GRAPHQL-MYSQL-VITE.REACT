import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.utils.js';

interface AuthenticatedRequest extends Request {
  user?: string | jwt.JwtPayload; 
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"

    try {
      const user = verifyToken(token);
      req.user = user;
      next();
    } catch (error) {
      res.status(403).json({
        message: 'Forbidden Access.'
      });          
    }
  } else {
    res.status(404).json({
      message: 'Unauthorized Access.'
    });    
  }
};

