import usersDao from "../../../dao/users.dao";
import { hashPassword } from "../../../utils/hash";
import { signToken } from "../../../utils/jwt";
import { ServerError } from "../../../utils/serverError";
import signup from "../signup";

jest.mock("../../../dao/users.dao");
jest.mock("../../../utils/hash");
jest.mock("../../../utils/jwt");

const mockCreateUser = usersDao.createUser as jest.Mock;
const mockGetUserByUsername = usersDao.getUserByUsername as jest.Mock;
const mockHashPassword = hashPassword as jest.Mock;
const mockSignToken = signToken as jest.Mock;

describe("signup", () => {
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

  it("should return a token and username when signup is successful", async () => {
    mockCreateUser.mockResolvedValue(validUser);
    mockHashPassword.mockResolvedValue(validUser.hashedPassword);
    mockGetUserByUsername.mockResolvedValue(null);
    mockSignToken.mockReturnValue("mockedToken");

    const result = await signup(validInput);

    expect(result).toEqual({
      token: "mockedToken",
      username: "testuser",
    });

    expect(mockCreateUser).toHaveBeenCalledWith({
      username: "testuser",
      hashedPassword: "hashedPassword123",
    });
    expect(mockHashPassword).toHaveBeenCalledWith("password123");
    expect(mockSignToken).toHaveBeenCalledWith(1);
  });

  it("should throw an error when the user is already registered", async () => {
    mockGetUserByUsername.mockResolvedValue(validUser);

    const result = signup(validInput);
    expect(result).rejects.toThrow(ServerError);
    expect(result).rejects.toThrow("User already exists");

    expect(mockGetUserByUsername).toHaveBeenCalledWith(validInput.username);
    expect(mockHashPassword).not.toHaveBeenCalled();
    expect(mockSignToken).not.toHaveBeenCalled();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });

  it("should validate input and throw an error for invalid username", async () => {
    const invalidInput = { password: "password123" };

    await expect(signup(invalidInput as any)).rejects.toThrow(
      "Username is required"
    );

    expect(mockGetUserByUsername).not.toHaveBeenCalled();
    expect(mockCreateUser).not.toHaveBeenCalled();
    expect(mockSignToken).not.toHaveBeenCalled();
    expect(mockHashPassword).not.toHaveBeenCalled();
  });

  it("should validate input and throw an error for short password", async () => {
    const invalidInput = { username: "testuser", password: "123" };

    await expect(signup(invalidInput as any)).rejects.toThrow(
      "Password must be at least 6 characters"
    );

    expect(mockGetUserByUsername).not.toHaveBeenCalled();
    expect(mockHashPassword).not.toHaveBeenCalled();
    expect(mockSignToken).not.toHaveBeenCalled();
    expect(mockCreateUser).not.toHaveBeenCalled();
  });
});
