import { v7 as uuidv7 } from "uuid";

export interface IIdentifer {
  Generate(): string;
}

export class Identifier implements IIdentifer {
  Generate(): string {
    return uuidv7();
  }
}
