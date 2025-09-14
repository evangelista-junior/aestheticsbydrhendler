import { SignJWT, jwtVerify } from "jose";

const ISSUER = "aestheticsbydrhendler.com.au";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET missing");
  return new TextEncoder().encode(secret);
}

export async function createToken({
  jti,
  audience,
  scope,
  unreservedClaims,
  issuedAt,
  expireAt,
}) {
  const jwtToken = await new SignJWT({
    scope,
    ...unreservedClaims,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(issuedAt)
    .setExpirationTime(expireAt)
    .setJti(jti)
    .setIssuer(ISSUER)
    .setAudience(audience)
    .sign(getSecret());

  return jwtToken;
}

export async function decodeToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());

    return { valid: true, payload };
  } catch (error) {
    if (error.code === "ERR_JWT_EXPIRED") {
      return { valid: false, reason: "expired" };
    }
    return { valid: false, reason: "Something wrong" };
  }
}
