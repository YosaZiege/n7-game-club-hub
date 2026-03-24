import { encrypt, decrypt } from "paseto-ts/v4";

function getKey(): string {
  const key = process.env.PASETO_SECRET_KEY;
  if (!key) throw new Error("Missing PASETO_LOCAL_KEY");
  return key;
}

export async function signToken(payload: Record<string, unknown>) {
  return encrypt(getKey(), payload);
}

export async function verifyToken(token: string) {
  return decrypt(getKey(), token);
}
