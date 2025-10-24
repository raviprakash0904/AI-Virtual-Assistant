import express from "express";
import dotenv from "dotenv";
import connectDb from "./Config/db.js";
import authRouter from "./Routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./Routes/user.routes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// DB + Server
connectDb().then(() => {
    app.listen(port, () => {
        console.log("Server started on port", port);
    });
}).catch(err => console.log("DB connection failed:", err));
