import type { AppType } from "@/app";
import type { IJWT } from "@/lib/jwt";
import { validator } from "hono/validator";
import { zValidator } from "@/middlewares/zod-validator";
import { Hono, type MiddlewareHandler } from "hono";
import { loginSchema } from "./request.schema";
import type { IAuthService } from "./service";

type InitAuthHttpHandlerOptions = {
  jwt: IJWT;
  authService: IAuthService;
};

export function initAuthHttpHandler(
  { authService, jwt }: InitAuthHttpHandlerOptions,
  ...midlewareHandler: MiddlewareHandler[]
) {
  const apiRoute: AppType = new Hono();

  apiRoute.use("*", ...midlewareHandler);

  const generateJWT = async (userId: string) => {
    return jwt.Generate(userId);
  };

  const loginHandler = apiRoute.post(
    "/login",
    validator("json", zValidator(loginSchema)),
    async (c) => {
      const data = c.req.valid("json");
      const userId = await authService.Login(data);
      const [accessToken, refreshToken] = await generateJWT(userId);

      return c.json(
        {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
        200,
      );
    },
  );

  const registerHandler = apiRoute.post(
    "/register",
    validator("json", zValidator(loginSchema)),
    async (c) => {
      const data = c.req.valid("json");
      const userId = await authService.Register(data);
      const [accessToken, refreshToken] = await generateJWT(userId);

      return c.json(
        {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
        200,
      );
    },
  );

  return { apiRoute, loginHandler, registerHandler };
}
