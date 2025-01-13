import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authController from "./controller/auth.controller";
import customerSubmissionController from "./controller/customers-submissions.controller";
import { ServerError } from "./utils/serverError";
import path from "path";
import { homedir } from "os";
import fs from "fs";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authController);
app.use("/api/customers-submissions", customerSubmissionController);

app.use("/uploads", express.static(path.join(homedir(), "uploads")));

// create dir if not exist
if (!fs.existsSync(path.join(homedir(), "uploads"))) {
  fs.mkdirSync(path.join(homedir(), "uploads"));
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  // Check if the error is a known type
  if (err instanceof ServerError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  // For generic errors, return a 500 status code and a generic error message
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
