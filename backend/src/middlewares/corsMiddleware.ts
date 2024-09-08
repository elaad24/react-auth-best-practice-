import cors from "cors";

const corsMiddleware = cors({
  origin: "http://localhost:3000", // Frontend URL
  credentials: true, // Allow credentials (cookies)
});

export default corsMiddleware;
