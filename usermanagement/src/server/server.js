import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
//import { UserRouter } from "./routes/.js";
import { UserRouter } from "./routes/userRouter.js";
import clientRouter from "./routes/clientRouter.js";

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

// CORS configuration for frontend to access the server
app.use(
  cors({
    origin: ["http://localhost:5173"], // Update this to your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Allow cookies
  })
);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Use the UserRouter for routes starting with /user
app.use("/user", UserRouter);
app.use("/clientmanagement",clientRouter)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



app.use("/", (req, res) => {
  res.send("successful");
});

// Keep this at the END of all routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Export the app as a serverless function
export default app;