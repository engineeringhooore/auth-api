import type { AppType } from "@/app";
import { validator } from "hono/validator";
import { zValidator } from "@/middlewares/zod-validator";
import { Hono, type MiddlewareHandler } from "hono";
import { verifySchema } from "./request.schema";

type InitPermissionHttpHandlerOptions = object;

export function initPermissionHttpHandler(
  _: InitPermissionHttpHandlerOptions,
  ...midlewareHandler: MiddlewareHandler[]
) {
  const apiRoute: AppType = new Hono();

  apiRoute.use("*", ...midlewareHandler);

  const verifyHandler = apiRoute.post(
    "/verify",
    validator("json", zValidator(verifySchema)),
    async (c) => {
      const payload = c.get("jwtPayload");
      return c.json({ user_id: payload.sub }, 200);
    },
  );

  return { apiRoute, verifyHandler };
}
