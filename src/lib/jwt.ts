import { randomBytes } from "crypto";
import { sign } from "hono/jwt";

export interface IJWT {
  Generate(userId: string): Promise<[string, string]>;
}

export class JWT implements IJWT {
  #accessPrivateKey: string;
  #refreshPrivateKey: string;
  #issuer: string;
  #audience: string | string[];

  constructor(
    accessPrivateKey: string,
    refreshPrivateKey: string,
    issuer: string,
    audience: string | string[],
  ) {
    this.#accessPrivateKey = accessPrivateKey;
    this.#refreshPrivateKey = refreshPrivateKey;
    this.#issuer = issuer;
    this.#audience = audience;
  }

  async Generate(userId: string): Promise<[string, string]> {
    const accessBuffer = randomBytes(32);
    const accessRandId = accessBuffer.toString("hex");

    const accessClaims = {
      iss: this.#issuer,
      aud: this.#audience,
      exp: Math.floor((Date.now() + 1 * 60 * 60 * 1000) / 1000), // One hour from now
      nbf: Math.floor(Date.now() / 1000),
      iat: Math.floor(Date.now() / 1000),
      jti: accessRandId,
      sub: userId,
    };

    const accessToken = await sign(
      accessClaims,
      this.#accessPrivateKey,
      "HS256",
    );

    const refreshBuffer = randomBytes(32);
    const refreshRandId = refreshBuffer.toString("hex");

    const refreshClaims = {
      iss: this.#issuer,
      aud: this.#audience,
      exp: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000), // 24 hour from now
      nbf: Math.floor((Date.now() + 59 * 60 * 1000) / 1000), // 59 minute
      iat: Math.floor(Date.now() / 1000),
      jti: refreshRandId,
      sub: userId,
    };

    const refreshToken = await sign(
      refreshClaims,
      this.#refreshPrivateKey,
      "HS256",
    );

    return [accessToken, refreshToken];
  }
}
