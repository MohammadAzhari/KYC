import { CustomerSubmission } from "@prisma/client";
import customerSubmissionDao from "../../../dao/customer-submission.dao";
import updateCustomerSubmissionStatus from "../update-customer-submission-status";

jest.mock("../../../dao/customer-submission.dao");

const mockUpdateCustomerSubmissionStatus =
  customerSubmissionDao.updateCustomerSubmissionStatus as jest.Mock;

describe("updateCustomerSubmissionStatus", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should update the customer submission status and return the updated record", async () => {
    const input = { customerSubmissionId: 1, decision: "APPROVED" };
    const mockUpdatedSubmission: CustomerSubmission = {
      id: 1,
      name: "John Doe",
      email: "johndoe@example.com",
      status: "APPROVED",
      userId: 1,
      documentFilename: "doc.pdf",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockUpdateCustomerSubmissionStatus.mockResolvedValue(mockUpdatedSubmission);

    const result = await updateCustomerSubmissionStatus(input as any);

    expect(result).toEqual(mockUpdatedSubmission);
    expect(mockUpdateCustomerSubmissionStatus).toHaveBeenCalledWith(
      1,
      "APPROVED"
    );
  });

  it("should throw an error if customerSubmissionId is missing", async () => {
    const input = { decision: "APPROVED" } as any;

    await expect(updateCustomerSubmissionStatus(input)).rejects.toThrow(
      "customerSubmissionId is required"
    );

    expect(mockUpdateCustomerSubmissionStatus).not.toHaveBeenCalled();
  });

  it("should throw an error if decision is missing", async () => {
    const input = { customerSubmissionId: 1 } as any;

    await expect(updateCustomerSubmissionStatus(input)).rejects.toThrow(
      "Decision is required"
    );

    expect(mockUpdateCustomerSubmissionStatus).not.toHaveBeenCalled();
  });

  it("should throw an error if decision is invalid", async () => {
    const input = { customerSubmissionId: 1, decision: "INVALID" } as any;

    await expect(updateCustomerSubmissionStatus(input)).rejects.toThrow(
      `Invalid enum value. Expected 'APPROVED' | 'REJECTED', received 'INVALID'`
    );

    expect(mockUpdateCustomerSubmissionStatus).not.toHaveBeenCalled();
  });

  it("should throw an error if the DAO method fails", async () => {
    const input = { customerSubmissionId: 1, decision: "REJECTED" };
    const errorMessage = "Database error";

    mockUpdateCustomerSubmissionStatus.mockRejectedValue(
      new Error(errorMessage)
    );

    await expect(updateCustomerSubmissionStatus(input as any)).rejects.toThrow(
      errorMessage
    );

    expect(mockUpdateCustomerSubmissionStatus).toHaveBeenCalledWith(
      1,
      "REJECTED"
    );
  });
});
