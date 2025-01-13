import usersDao from "../../../dao/users.dao";
import { comparePassword } from "../../../utils/hash";
import { signToken } from "../../../utils/jwt";
import { ServerError } from "../../../utils/serverError";
import login from "../login";

jest.mock("../../../dao/users.dao");
jest.mock("../../../utils/hash");
jest.mock("../../../utils/jwt");

const mockGetUserByUsername = usersDao.getUserByUsername as jest.Mock;
const mockComparePassword = comparePassword as jest.Mock;
const mockSignToken = signToken as jest.Mock;

describe("login", () => {
  const validInput = {
    username: "testuser",
    password: "password123",
  };

  const validUser = {
    id: 1,
    username: "testuser",
    hashedPassword: "hashedPassword123",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return a token and username when login is successful", async () => {
    mockGetUserByUsername.mockResolvedValue(validUser);
    mockComparePassword.mockResolvedValue(true);
    mockSignToken.mockReturnValue("mockedToken");

    const result = await login(validInput);

    expect(result).toEqual({
      token: "mockedToken",
      username: "testuser",
    });

    expect(mockGetUserByUsername).toHaveBeenCalledWith("testuser");
    expect(mockComparePassword).toHaveBeenCalledWith(
      "password123",
      "hashedPassword123"
    );
    expect(mockSignToken).toHaveBeenCalledWith(1);
  });

  it("should throw an error when the user is not found", async () => {
    mockGetUserByUsername.mockResolvedValue(null);

    await expect(login(validInput)).rejects.toThrow(ServerError);
    await expect(login(validInput)).rejects.toThrow("User not found");

    expect(mockGetUserByUsername).toHaveBeenCalledWith("testuser");
    expect(mockComparePassword).not.toHaveBeenCalled();
    expect(mockSignToken).not.toHaveBeenCalled();
  });

  it("should throw an error when the password is invalid", async () => {
    mockGetUserByUsername.mockResolvedValue(validUser);
    mockComparePassword.mockResolvedValue(false);

    await expect(login(validInput)).rejects.toThrow(ServerError);
    await expect(login(validInput)).rejects.toThrow("Invalid password");

    expect(mockGetUserByUsername).toHaveBeenCalledWith("testuser");
    expect(mockComparePassword).toHaveBeenCalledWith(
      "password123",
      "hashedPassword123"
    );
    expect(mockSignToken).not.toHaveBeenCalled();
  });

  it("should validate input and throw an error for invalid username", async () => {
    const invalidInput = { password: "password123" };

    await expect(login(invalidInput as any)).rejects.toThrow(
      "Username is required"
    );

    expect(mockGetUserByUsername).not.toHaveBeenCalled();
    expect(mockComparePassword).not.toHaveBeenCalled();
    expect(mockSignToken).not.toHaveBeenCalled();
  });

  it("should validate input and throw an error for short password", async () => {
    const invalidInput = { username: "testuser", password: "123" };

    await expect(login(invalidInput as any)).rejects.toThrow(
      "Password must be at least 6 characters"
    );

    expect(mockGetUserByUsername).not.toHaveBeenCalled();
    expect(mockComparePassword).not.toHaveBeenCalled();
    expect(mockSignToken).not.toHaveBeenCalled();
  });
});
