import { Request, Response, NextFunction } from "express";
import { ServerError } from "../utils/serverError";
import jwt from "jsonwebtoken";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ServerError("Unauthorized", 401);
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ServerError("Unauthorized", 401);
  }

  const { userId } = jwt.verify(token, process.env.JWT_SECRET as string) as {
    userId: number;
  };

  res.locals.userId = userId;
  next();
}

export default authMiddleware;
