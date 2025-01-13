import { z, ZodRawShape } from "zod";
import { ServerError } from "./serverError";

export function vaildate<T extends ZodRawShape = any>(
  schema: z.ZodObject<T>,
  data: any
) {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ServerError(
      result.error.errors.map((e) => e.message).join(", "),
      400
    );
  }

  return result.data;
}
