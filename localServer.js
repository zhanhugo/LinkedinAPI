import express from "express";
import { connectDB } from "./utils/db.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { createServer } from "https";
import { fileURLToPath } from "url";

dotenv.config();

// Convert __dirname to ES module equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB database
(async () => await connectDB())();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:3001",
    "https://boatie.vercel.app",
    "https://insect-patient-moose.ngrok-free.app",
  ],
  credentials: true, // access-control-allow-credentials:true
  optionsSuccessStatus: 200,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));

// Routers
import home from "./routes/home.js";
import user from "./routes/user.js";
import restaurant from "./routes/restaurant.js";
import order from "./routes/order.js";
import notification from "./routes/notification.js";
import driver from "./routes/driver.js";
import { rescheduleAllCron } from "./utils/cron.js";
import { reorderRestaurantSections } from "./utils/uploadRestaurantCSV.js";

// Middleware
app.use(express.json());

// Routes
app.use("/", home);
app.use("/user", user);
app.use("/restaurant", restaurant);
app.use("/order", order);
app.use("/notification", notification);
app.use("/driver", driver);

// Real IP Address
app.set("trust proxy", true);

// Load HTTPS certificate and key files
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, "./localhost-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "./localhost.pem")),
};

const port = process.env.PORT || 5000;
const server = createServer(httpsOptions, app).listen(port, () => {
  console.log(`Listening on https://localhost:${port}`);
});

process.on("SIGTERM", () => {
  server.close();
});

process.on("SIGINT", () => {
  server.close();
});

// rescheduleAllCron();
// uploadRestaurantCSV();
// addRestaurantSections();
// reorderRestaurantSections();

export default app;
