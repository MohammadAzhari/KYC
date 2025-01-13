import { CustomerSubmission } from "@prisma/client";
import { z } from "zod";
import { vaildate } from "../../utils/validate";
import customerSubmissionDao from "../../dao/customer-submission.dao";

async function createCustomerSubmission(input: Input): Promise<Output> {
  const { email, name, userId, documentFilename } = vaildate(schema, input);

  return customerSubmissionDao.createCustomerSubmission({
    email,
    name,
    userId,
    documentFilename,
  });
}

export default createCustomerSubmission;

type Input = {
  email: string;
  name: string;
  userId: number;
  documentFilename: string;
};

type Output = CustomerSubmission;

const schema = z.object({
  email: z.string({ required_error: "Email is required" }),
  name: z.string({ required_error: "Name is required" }),
  userId: z.number({ required_error: "User ID is required" }),
  documentFilename: z.string({
    required_error: "Document filename is required",
  }),
});
