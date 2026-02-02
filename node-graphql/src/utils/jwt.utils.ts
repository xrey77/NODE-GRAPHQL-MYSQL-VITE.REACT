import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'; 

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '8h' }); // Token expires in 8 hour
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, SECRET_KEY);
};