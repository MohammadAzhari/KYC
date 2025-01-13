import { z } from "zod";
import { vaildate } from "../../utils/validate";
import { hashPassword } from "../../utils/hash";
import usersDao from "../../dao/users.dao";
import { signToken } from "../../utils/jwt";
import { ServerError } from "../../utils/serverError";

async function signup(input: Input): Promise<Output> {
  const { username, password } = vaildate(schema, input);

  const existingUser = await usersDao.getUserByUsername(username);

  if (existingUser) {
    throw new ServerError("User already exists", 409);
  }

  const hashedPassword = await hashPassword(password);

  const user = await usersDao.createUser({
    username,
    hashedPassword,
  });

  const token = signToken(user.id);
  return { token, username: user.username };
}

export default signup;

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
