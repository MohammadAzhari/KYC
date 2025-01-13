import { z } from "zod";
import { vaildate } from "../../utils/validate";
import { comparePassword } from "../../utils/hash";
import usersDao from "../../dao/users.dao";
import { signToken } from "../../utils/jwt";
import { ServerError } from "../../utils/serverError";

async function login(input: Input): Promise<Output> {
  const { username, password } = vaildate(schema, input);

  const user = await usersDao.getUserByUsername(username);

  if (!user) {
    throw new ServerError("User not found", 404);
  }

  const isPasswordValid = await comparePassword(password, user.hashedPassword);

  if (!isPasswordValid) {
    throw new ServerError("Invalid password", 401);
  }

  const token = signToken(user.id);
  return { token, username: user.username };
}

export default login;

type Input = {
  username: string;
  password: string;
};

type Output = {
  token: string;
  username: string;
};

const schema = z.object({
  username: z.string({ required_error: "Username is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});
