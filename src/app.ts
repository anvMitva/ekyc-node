// @ts-nocheck
import express from "express";
import { createServer } from "http";
import cors from "cors";
import { errorHandler } from "./middlewares/error.middlewares.js";
import morganMiddleware from "./logger/morgan.logger.js";
import { APP, SERVER_CONFIG } from "./config/index.js";
import os from "os";
import path from "path";
import correlationIds from "../src/logger/correlation.logger.js";
import { Server } from "socket.io";
import { initializeSocketIO } from "./socket/index.js";

const app = express();
app.use(correlationIds.middleware);
const httpServer = createServer(app);
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'Templates/Esign'));
app.set('views', path.join(process.cwd(), 'Templates/Esign')); // You can change this path if needed

const serverStartTime = new Date();

app.use(cors({
  origin: true,       // reflects the request origin automatically
  credentials: true
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.set('trust proxy', true);

app.use(morganMiddleware);

app.get("/", (req, res) => {
  res.send(`Welcome to App ${APP}`);
});

import newKycRoutes from "./routes/newKyc.route.js";
app.use("/v2/new-kyc", newKycRoutes);

app.get("/connect/v2/health", (req, res) => {
  const healthCheck = {
    status: "UP",
    uptime: formatUptime(process.uptime()),
    environment: SERVER_CONFIG.NODE_ENV,
    os: os.platform(),
    startTime: serverStartTime.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    }),
    system: os.cpus()[0].model,
  };

  res.status(200).json(new ApiResponse(200, healthCheck, "Connect Backend is healthy"));
});


const io = new Server(httpServer, {
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  cors: {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "authToken"]
  },
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  }
});

app.set("io", io);

console.log("Initializing Socket.IO...");
initializeSocketIO(io);
console.log("Socket.IO initialized.");

app.use(errorHandler);

export { httpServer };
