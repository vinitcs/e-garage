import connectDB from "./db/db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorHandling from "./middlewares/errorHandler.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 4000;

const app = express();

connectDB().then(() => {
  app.on("error", (error) => {
    console.log("ERR: ", error);
    throw error;
  });
});

// Server running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json({ limit: "16kb" })); // limit use to set how much request will come

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// optional extended:true for now => deals nested objects

app.use(express.static("public")); // use to keep assests, favicon and so on

// Error handling middleware
app.use(errorHandling);

// Routes
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";


app.use("/api/v1", userRoutes);
app.use("/api/v1", adminRoutes);
