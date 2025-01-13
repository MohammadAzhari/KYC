import express, { Request, Response } from "express";
import getUploadMiddleware from "../utils/upload";
import { ServerError } from "../utils/serverError";
import createCustomerSubmission from "../use-case/customer-submissions/create-customer-submission";
import adminMiddleware from "../middleware/admin.middleware";
import { CustomerSubmissionStatus } from "@prisma/client";
import listCustomerSubmissions from "../use-case/customer-submissions/list-customer-submissions";
import updateCustomerSubmissionStatus from "../use-case/customer-submissions/update-customer-submission-status";
import authMiddleware from "../middleware/auth.middleware";
import customerSubmissionsReport from "../use-case/customer-submissions/customer-submissions-report";
import { asyncHandler } from "../utils/asyncHandler";

const customersSubmissionsController = express.Router();

customersSubmissionsController.use(authMiddleware);

customersSubmissionsController.post(
  "/",
  getUploadMiddleware({
    isSingle: true,
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
    bodyKey: "file",
    maxFileSize: 5 * 1024 * 1024, // 5MB
  }),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ServerError("No file uploaded", 400);
    }

    const input = {
      email: req.body.email,
      name: req.body.name,
      documentFilename: req.file.filename,
      userId: res.locals.userId,
    };

    const output = await createCustomerSubmission(input);

    res.status(201).json(output);
  })
);

customersSubmissionsController.get(
  "/",
  adminMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const input = {
      pageNumber: req.query.pageNumber
        ? parseInt(req.query.pageNumber as string)
        : 1,
      pageSize: req.query.pageSize
        ? parseInt(req.query.pageSize as string)
        : 10,
      userId: req.query.userId
        ? parseInt(req.query.userId as string)
        : undefined,
      status: req.query.status
        ? (req.query.status as CustomerSubmissionStatus)
        : undefined,
    };

    const output = await listCustomerSubmissions(input);

    res.status(200).json(output);
  })
);

customersSubmissionsController.put(
  "/:id/status",
  adminMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const input = {
      customerSubmissionId: parseInt(req.params.id),
      decision: req.body.decision as "APPROVED" | "REJECTED",
    };

    const output = await updateCustomerSubmissionStatus(input);

    res.status(200).json(output);
  })
);

customersSubmissionsController.get(
  "/report",
  adminMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const output = await customerSubmissionsReport();

    res.status(200).json(output);
  })
);

export default customersSubmissionsController;
