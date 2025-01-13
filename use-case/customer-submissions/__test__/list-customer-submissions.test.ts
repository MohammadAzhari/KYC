import { CustomerSubmissionStatus } from "@prisma/client";
import customerSubmissionDao from "../../../dao/customer-submission.dao";
import listCustomerSubmissions from "../list-customer-submissions";

jest.mock("../../../dao/customer-submission.dao");

const mockGetCustomerSubmissions =
  customerSubmissionDao.getCustomerSubmissions as jest.Mock;

describe("list customer submissions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("test with passing all filters", async () => {
    const input = {
      pageNumber: 1,
      pageSize: 10,
      status: CustomerSubmissionStatus.APPROVED,
      userId: 1,
    };

    await listCustomerSubmissions(input);

    expect(mockGetCustomerSubmissions).toHaveBeenCalledWith(input);
  });

  it("test without passing status", async () => {
    const input = {
      pageNumber: 1,
      pageSize: 10,
      userId: 1,
    };

    await listCustomerSubmissions(input);

    expect(mockGetCustomerSubmissions).toHaveBeenCalledWith(input);
  });

  it("test without passing userId", async () => {
    const input = {
      pageNumber: 1,
      pageSize: 10,
      status: CustomerSubmissionStatus.APPROVED,
    };

    await listCustomerSubmissions(input);

    expect(mockGetCustomerSubmissions).toHaveBeenCalledWith(input);
  });

  it("test without passing page number", async () => {
    const input = {
      pageSize: 10,
      status: CustomerSubmissionStatus.APPROVED,
      userId: 1,
    };

    await listCustomerSubmissions(input as any);

    expect(mockGetCustomerSubmissions).toHaveBeenCalledWith({
      ...input,
      pageNumber: 1,
    });
  });

  it("test without passing page size", async () => {
    const input = {
      pageNumber: 1,
      status: CustomerSubmissionStatus.APPROVED,
      userId: 1,
    };

    await listCustomerSubmissions(input as any);

    expect(mockGetCustomerSubmissions).toHaveBeenCalledWith({
      ...input,
      pageSize: 10,
    });
  });

  it("test with passing page number less than 1", async () => {
    const input = {
      pageNumber: 0,
      pageSize: 10,
      status: CustomerSubmissionStatus.APPROVED,
      userId: 1,
    };

    await listCustomerSubmissions(input);

    expect(mockGetCustomerSubmissions).toHaveBeenCalledWith({
      ...input,
      pageNumber: 1,
    });
  });

  it("test without passing page size less than 1", async () => {
    const input = {
      pageNumber: 1,
      pageSize: 0,
      status: CustomerSubmissionStatus.APPROVED,
      userId: 1,
    };

    await listCustomerSubmissions(input);

    expect(mockGetCustomerSubmissions).toHaveBeenCalledWith({
      ...input,
      pageSize: 10,
    });
  });

  it("test without passing page size more than 50", async () => {
    const input = {
      pageNumber: 1,
      pageSize: 51,
      status: CustomerSubmissionStatus.APPROVED,
      userId: 1,
    };

    await listCustomerSubmissions(input);

    expect(mockGetCustomerSubmissions).toHaveBeenCalledWith({
      ...input,
      pageSize: 10,
    });
  });
});
