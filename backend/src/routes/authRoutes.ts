// src/routes/authRoutes.ts
import { Router, Request, Response } from "express";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/tokenUtils";
import { AuthRequest } from "../types";

const router = Router();

// Login route: Simulates user login and sends access_token and refresh_token
router.post("/login", (req: Request, res: Response) => {
  const userId = 1;

  // Create access and refresh tokens
  const accessToken = createAccessToken(userId);
  const refreshToken = createRefreshToken(userId);

  // Send refresh_token as HttpOnly cookie and access_token in response body
  res
    .cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json({ access_token: accessToken });
});

// Refresh token route: Verifies refresh_token and sends new access_token
router.get("/refresh-token", (req: AuthRequest, res: Response) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const userId = verifyRefreshToken(refreshToken); // Verify the refresh token
    const newAccessToken = createAccessToken(userId); // Create new access token
    res.json({ access_token: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
});

export default router;
