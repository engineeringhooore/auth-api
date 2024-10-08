export class Auth {
  #id: string;
  #username: string;
  #password: string;

  constructor(id: string, username: string, password: string) {
    this.#id = id;
    this.#username = username;
    this.#password = password;
  }

  GetId(): string {
    return this.#id;
  }

  GetUsername(): string {
    return this.#username;
  }

  GetPassword(): string {
    return this.#password;
  }
}
