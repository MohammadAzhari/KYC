import { CustomerSubmission, CustomerSubmissionStatus } from "@prisma/client";
import customerSubmissionDao from "../../dao/customer-submission.dao";

async function listCustomerSubmissions(input: Input): Promise<Output> {
  if (!input.pageNumber || input.pageNumber < 1) {
    input.pageNumber = 1;
  }

  if (!input.pageSize || input.pageSize < 1 || input.pageSize > 50) {
    input.pageSize = 10;
  }

  return customerSubmissionDao.getCustomerSubmissions({
    pageNumber: input.pageNumber,
    pageSize: input.pageSize,
    status: input.status,
    userId: input.userId,
  });
}

export default listCustomerSubmissions;

type Input = {
  pageNumber: number;
  pageSize: number;
  userId?: number;
  status?: CustomerSubmissionStatus;
};

type Output = CustomerSubmission[];
