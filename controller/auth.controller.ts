import express, { Request, Response } from "express";
import signup from "../use-case/users/signup";
import login from "../use-case/users/login";
import { asyncHandler } from "../utils/asyncHandler";

const authController = express.Router();

authController.post(
  "/signup",
  asyncHandler(async (req: Request, res: Response) => {
    const input = {
      username: req.body.username,
      password: req.body.password,
    };

    const output = await signup(input);

    res.status(201).json(output);
  })
);

authController.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const input = {
      username: req.body.username,
      password: req.body.password,
    };

    const output = await login(input);

    res.status(200).json(output);
  })
);

export default authController;
