import cors from "cors";

const corsMiddleware = cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true, // Allow credentials (cookies)
});

export default corsMiddleware;
