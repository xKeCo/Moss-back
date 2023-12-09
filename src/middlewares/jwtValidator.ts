import { response } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  uid: string;
  name: string;
}

export const jwtValidator = (req: any, res = response, next: any) => {
  // Read token
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: 'There is no token in the request',
    });
  }

  try {
    const { uid, name } = jwt.verify(
      token,
      // process.env.SECRET_JWT_SEED ||
      '3sTeS3cReT0-s33Ddd-D3SaRr0lL0pArA-UAOPR0j3Ct-b4Ck3end'
    ) as JwtPayload;

    req.uid = uid;
    req.name = name;
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: 'Token is not valid',
    });
  }

  next();
};
