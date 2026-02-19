import { encrypt, decrypt } from "paseto-ts/v4";

const key: any = process.env.PASETO_SECRET_KEY;
if (!key) throw new Error("Missing PASETO_LOCAL_KEY");

export async function signToken(payload: Record<string, unknown>) {

   return encrypt(key, payload);
}

export async function verifyToken(token: string) {
   return decrypt(key, token);
}
