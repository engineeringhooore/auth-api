import { jwt } from "hono/jwt";

import type { AppType } from "./app";

import { ULID } from "./lib/identifer";
import { JWT } from "./lib/jwt";
import { Argon2id } from "./lib/password";

import { initAuthHttpHandler } from "./features/auth/http.handler";
import { AuthRepository } from "./features/auth/repository";
import { AuthService } from "./features/auth/service";

import { initPermissionHttpHandler } from "./features/permission/http.handler";

export function initRoute(honoApp: AppType) {
  const argon2id = new Argon2id();
  const ulid = new ULID();

  const authzJWT = new JWT(
    process.env.JWT_ACCESS_SECRET,
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_ISSUER,
    process.env.JWT_AUDIENCE.split(","),
  );

  const jwsMiddleware = jwt({
    secret: process.env.JWT_ACCESS_SECRET,
  });

  const authRepository = new AuthRepository();
  const authService = new AuthService(ulid, argon2id, authRepository);
  const authHttpHandler = initAuthHttpHandler({
    authService,
    jwt: authzJWT,
  });
  honoApp.route("/api/v1/auth", authHttpHandler.apiRoute);

  const permissionHttpHandler = initPermissionHttpHandler({}, jwsMiddleware);
  honoApp.route("/api/v1/permissions", permissionHttpHandler.apiRoute);
}
