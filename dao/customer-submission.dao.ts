import { CustomerSubmissionStatus } from "@prisma/client";
import prisma from "../config/prisma";

const customerSubmissionDao = {
  createCustomerSubmission: async (data: CustomerSubmission) => {
    return prisma.customerSubmission.create({
      data: {
        userId: data.userId,
        email: data.email,
        name: data.name,
        status: CustomerSubmissionStatus.PENDING,
        documentFilename: data.documentFilename,
      },
    });
  },
  getCustomerSubmissions: async (data: CustomerSubmissionsFilters) => {
    return prisma.customerSubmission.findMany({
      where: {
        status: data.status,
        userId: data.userId,
      },
      skip: (data.pageNumber - 1) * data.pageSize,
      take: data.pageSize,
    });
  },
  updateCustomerSubmissionStatus: async (
    id: number,
    status: CustomerSubmissionStatus
  ) => {
    return prisma.customerSubmission.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  },
  aggregateCustomerSubmissions: async () => {
    return prisma.customerSubmission.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });
  },
};

export default customerSubmissionDao;

type CustomerSubmission = {
  userId: number;
  email: string;
  name: string;
  documentFilename: string;
};

type CustomerSubmissionsFilters = {
  pageNumber: number;
  pageSize: number;
  status?: CustomerSubmissionStatus;
  userId?: number;
};
