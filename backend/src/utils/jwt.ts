import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (payload: object): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET as string, options);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
