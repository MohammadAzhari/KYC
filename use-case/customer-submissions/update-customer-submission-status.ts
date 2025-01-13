import { CustomerSubmission, CustomerSubmissionStatus } from "@prisma/client";
import { z } from "zod";
import { vaildate } from "../../utils/validate";
import customerSubmissionDao from "../../dao/customer-submission.dao";

async function updateCustomerSubmissionStatus(input: Input): Promise<Output> {
  const { customerSubmissionId, decision } = vaildate(schema, input);

  return customerSubmissionDao.updateCustomerSubmissionStatus(
    customerSubmissionId,
    decision
  );
}

export default updateCustomerSubmissionStatus;

type Input = {
  customerSubmissionId: number;
  decision: "APPROVED" | "REJECTED";
};

type Output = CustomerSubmission;

const schema = z.object({
  customerSubmissionId: z.number({
    required_error: "customerSubmissionId is required",
  }),
  decision: z.enum(["APPROVED", "REJECTED"], {
    required_error: "Decision is required",
    invalid_type_error: "Decision must be APPROVED or REJECTED",
  }),
});
