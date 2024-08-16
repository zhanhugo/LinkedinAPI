import express from "express";
import { connectDB } from "./utils/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB database
// (async () => await connectDB())();

const app = express();
const corsOptions = {
  origin: [
    "https://localhost:3000",
    "http://localhost:3000",
    "https://insect-patient-moose.ngrok-free.app",
  ],
  credentials: true, //access-control-allow-credentials:true
  optionsSuccessStatus: 200,
};
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routers
import home from "./routes/home.js";

// middleware
app.use(express.json());

// Routes
app.use("/", home);

// Real IP Address
app.set("trust proxy", true);

const port = process.env.PORT || 5001;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

process.on("SIGTERM", () => {
  server.close();
});

process.on("SIGINT", () => {
  server.close();
});

export default app;
