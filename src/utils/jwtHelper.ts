import { ROLE } from "@prisma/client";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { TJwtUser } from "../types";

const generateToken = (payload: any, secret: Secret, expiresIn: any) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: expiresIn,
  });

  return token;
};

const verifyToken = (token: string, secret: Secret) => {
  try {
    return jwt.verify(token, secret) as TJwtUser;
  } catch (error) {
    return null;
  }
};

export const jwtHelpers = { generateToken, verifyToken };
