// src/server.ts
import express from "express";
import cookieParser from "cookie-parser";
import corsMiddleware from "./middlewares/corsMiddleware";
import authRoutes from "./routes/authRoutes";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

// Routes
app.use("/api", authRoutes);

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
