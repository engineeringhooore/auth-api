import type { IJWT } from "@/lib/jwt";
import { testClient } from "hono/testing";
import { initAuthHttpHandler } from "./http.handler";
import type { IAuthService } from "./service";

const userId = "random";

const jwtMock: IJWT = {
  Generate: async () => {
    return [userId, userId];
  },
};

const authServiceMock: IAuthService = {
  Login: async () => {
    return userId;
  },
  Register: async () => {
    return userId;
  },
};

const handler = initAuthHttpHandler({
  jwt: jwtMock,
  authService: authServiceMock,
});

it("test login", async () => {
  const res = await testClient(handler.loginHandler).login.$post({
    json: { username: "username", password: "password" },
  });
  expect(await res.text()).toStrictEqual(
    JSON.stringify({
      access_token: userId,
      refresh_token: userId,
    }),
  );
});

it("test register", async () => {
  const res = await testClient(handler.registerHandler).register.$post({
    json: { username: "username", password: "password" },
  });
  expect(await res.text()).toStrictEqual(
    JSON.stringify({
      access_token: userId,
      refresh_token: userId,
    }),
  );
});
