import { Request } from "express";

// Extend Request to include refresh_token in cookies
export interface AuthRequest extends Request {
  cookies: {
    refresh_token?: string;
  };
}
