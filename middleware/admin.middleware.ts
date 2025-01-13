import { Request, Response, NextFunction } from "express";
import { ServerError } from "../utils/serverError";
import usersDao from "../dao/users.dao";
import { Role } from "@prisma/client";

async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = res.locals.userId;

  if (!userId) {
    next(new ServerError("Unauthorized", 401));
    return;
  }

  const user = await usersDao.getUserById(userId);

  if (!user) {
    next(new ServerError("Unauthorized", 401));
    return;
  }

  if (user.role !== Role.ADMIN) {
    next(new ServerError("Forbidden", 403));
    return;
  }

  next();
}

export default adminMiddleware;
