import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import usersDao from "../dao/users.dao";
import jwt from "jsonwebtoken";
import { ServerError } from "../utils/serverError";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await usersDao.createUser({
        username,
        hashedPassword,
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string
      );
      res.json({ token, username: user.username });
    } catch (error) {
      next(error);
    }
  }
);

authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;

      const user = await usersDao.getUserByUsername(username);

      if (!user) {
        throw new ServerError("User not found", 404);
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.hashedPassword
      );

      if (!isPasswordValid) {
        throw new ServerError("Invalid password", 401);
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string
      );

      res.json({ token, username: user.username });
    } catch (error) {
      next(error);
    }
  }
);

export default authRouter;
