import { CustomerSubmissionStatus } from "@prisma/client";
import customerSubmissionDao from "../../dao/customer-submission.dao";
import usersDao from "../../dao/users.dao";

async function customerSubmissionsReport(): Promise<Output> {
  const statusCounts =
    await customerSubmissionDao.aggregateCustomerSubmissions();

  let totalSubmissions = 0;
  const statuses = statusCounts.map((entry) => {
    totalSubmissions += entry._count.status;
    return {
      count: entry._count.status,
      status: entry.status,
    };
  });

  const totalUsers = await usersDao.countUsers();

  return {
    totalSubmissions,
    statuses,
    totalUsers,
  };
}

export default customerSubmissionsReport;

type Output = {
  totalSubmissions: number;
  statuses: {
    count: number;
    status: CustomerSubmissionStatus;
  }[];
  totalUsers: number;
};
