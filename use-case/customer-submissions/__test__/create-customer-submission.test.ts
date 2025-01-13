import customerSubmissionDao from "../../../dao/customer-submission.dao";
import { ServerError } from "../../../utils/serverError";
import createCustomerSubmission from "../create-customer-submission";

jest.mock("../../../dao/customer-submission.dao");

const mockCreateCustomerSubmission =
  customerSubmissionDao.createCustomerSubmission as jest.Mock;

describe("create-customer-submission", () => {
  const validInput = {
    email: "a@a.com",
    name: "a",
    userId: 1,
    documentFilename: "a.pdf",
  };

  const validOutput = {
    ...validInput,
    id: 1,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("test valid submission", async () => {
    mockCreateCustomerSubmission.mockResolvedValue(validOutput);

    const result = await createCustomerSubmission(validInput);

    expect(result).toEqual(validOutput);
    expect(mockCreateCustomerSubmission).toHaveBeenCalledWith(validInput);
  });

  it("test missing email", async () => {
    const invalidInput = {
      ...validInput,
      email: undefined,
    };

    const result = createCustomerSubmission(invalidInput as any);

    expect(result).rejects.toThrow(ServerError);
    expect(result).rejects.toThrow("Email is required");
    expect(mockCreateCustomerSubmission).not.toHaveBeenCalled();
  });

  it("test missing name", async () => {
    const invalidInput = {
      ...validInput,
      name: undefined,
    };

    const result = createCustomerSubmission(invalidInput as any);

    expect(result).rejects.toThrow(ServerError);
    expect(result).rejects.toThrow("Name is required");
    expect(mockCreateCustomerSubmission).not.toHaveBeenCalled();
  });

  it("test missing userId", async () => {
    const invalidInput = {
      ...validInput,
      userId: undefined,
    };

    const result = createCustomerSubmission(invalidInput as any);

    expect(result).rejects.toThrow(ServerError);
    expect(result).rejects.toThrow("User ID is required");
    expect(mockCreateCustomerSubmission).not.toHaveBeenCalled();
  });

  it("test missing documentFilename", async () => {
    const invalidInput = {
      ...validInput,
      documentFilename: undefined,
    };

    const result = createCustomerSubmission(invalidInput as any);

    expect(result).rejects.toThrow(ServerError);
    expect(result).rejects.toThrow("Document filename is required");
    expect(mockCreateCustomerSubmission).not.toHaveBeenCalled();
  });
});
