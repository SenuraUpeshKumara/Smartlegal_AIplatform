import express from "express";
import dotenv from "dotenv"; // Import dotenv
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ConsultationRouter } from "./routes/consultationRouter.js"; // Adjust the path as needed

// Load environment variables from .env file
dotenv.config(); 

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

const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Register consultation routes
app.use("/consultation", ConsultationRouter);

app.use("/", (req, res) => {
  res.send("Hello");
});

// Export the app as a serverless function
export default app;