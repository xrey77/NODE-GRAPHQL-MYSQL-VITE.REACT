import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'; 

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '8h' }); // Token expires in 1 hour
};

export const verifyToken = (token: string): string | jwt.JwtPayload => {
  return jwt.verify(token, SECRET_KEY);
};

// import jwt, { Secret } from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// export interface JwtPayload {
//   id: number;
//   email: string;
//   roles: string;
// }

// const jwtSecret: Secret = process.env.JWT_SECRET || '';

// export const generateToken = (payload: JwtPayload): string => {
//   const token = jwt.sign(payload, jwtSecret, {
//     expiresIn: '8h',
//   });

//   return token;
// };
