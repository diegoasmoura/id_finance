import { hash, verify, type Options } from "@node-rs/argon2";

const argonOptions: Options = {
  algorithm: 2,
  memoryCost: 65536,
  outputLen: 32,
  parallelism: 2,
  timeCost: 3,
};

export function hashPassword(password: string): Promise<string> {
  return hash(password, argonOptions);
}

export function verifyPassword(data: { password: string; hash: string }): Promise<boolean> {
  return verify(data.hash, data.password, argonOptions);
}
