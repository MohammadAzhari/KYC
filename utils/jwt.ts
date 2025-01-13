import jwt from "jsonwebtoken";

export const signToken = (userId: number) =>
  jwt.sign({ userId }, process.env.JWT_SECRET as string);

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as string) as {
    userId: number;
  };
