import { encrypt, decrypt } from "paseto-ts/v4";

// Store this in .env as a PASERK string: k4.local.xxxxx
// Generate once with: import { generateKeys } from "paseto-ts/v4"; generateKeys("local")
const key = process.env.PASETO_KEY!; // k4.local.xxxxx format

export async function signToken(payload: Record<string, unknown>) {
  return encrypt(key, {
    ...payload,
    exp: "15 minutes",  
   });
}


export async function verifyToken(token: string) {
  return decrypt(key, token);
}
