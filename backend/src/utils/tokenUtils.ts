// src/utils/tokenUtils.ts
import jwt from "jsonwebtoken";

// Secret keys for signing JWTs
const ACCESS_TOKEN_SECRET = "your_access_token_secret";
const REFRESH_TOKEN_SECRET = "your_refresh_token_secret";

// Create an access token (short-lived, e.g., 30 minutes)
export function createAccessToken(userId: number): string {
  return jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
}

// Create a refresh token (long-lived, e.g., 7 days)
export function createRefreshToken(userId: number): string {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
}

// Verify the refresh token
export function verifyRefreshToken(token: string): number {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as {
      userId: number;
    };
    return decoded.userId; // Return user ID if valid
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
}
