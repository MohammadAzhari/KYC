import { Request, Response, NextFunction } from "express";
import { ServerError } from "../utils/serverError";
import { verifyToken } from "../utils/jwt";

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next(new ServerError("Unauthorized", 401));
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    next(new ServerError("Unauthorized", 401));
    return;
  }

  const { userId } = verifyToken(token);

  res.locals.userId = userId;
  next();
}

export default authMiddleware;
