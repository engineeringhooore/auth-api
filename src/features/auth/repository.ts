import { NotFoundError } from "@/exceptions/not-found.error";
import { sql } from "@/lib/db";
import { Auth,  } from "@/types/auth";
import type { AuthTable } from "@/types/auth-table";

export interface IAuthRepository {
  Insert(auth: Auth): Promise<void>;
  GetByUsername(username: string): Promise<Auth>;
}

export class AuthRepository implements IAuthRepository {
  async Insert(auth: Auth): Promise<void> {
    await sql`INSERT INTO auth (id, username, password) VALUES (${auth.GetId()}, ${auth.GetUsername()}, ${auth.GetPassword()})`;
  }

  async GetByUsername(username: string): Promise<Auth> {
    const [auth]: [AuthTable?] =
      await sql`SELECT id, username, password FROM auth WHERE username = ${username}`;

    if (!auth) {
      throw new NotFoundError(`${username} not found.`);
    }

    return new Auth(auth.id, auth.username, auth.password);
  }
}
