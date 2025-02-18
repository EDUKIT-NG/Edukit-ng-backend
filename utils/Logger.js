import winston from "winston";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Fix `__dirname` for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define custom colors for log levels
const customColors = {
  info: "cyan",
  warn: "yellow",
  error: "red",
};

const transports = [];

dotenv.config();
if (process.env.PRODUCTION !== 'development') {
  transports.push(
    new winston.transports.Console(),
    new winston.transports.File({
      level: 'error',
      filename: `${logDir}/logs`,
      format: winston.format.uncolorize(),
    })
  );
} else {
  transports.push(new winston.transports.Console());
}

winston.addColors(customColors);

// Create logger instance
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, context }) => {
      return `[${timestamp}] [${level.toUpperCase()}] [${context || "App"}]: ${message}`;
    }),
    winston.format.colorize({ all: true }),
  ),
  transports,
});

// Function to create a logger with context
const Logger = (context) => ({
  info: (message) => logger.info({ message, context }),
  warn: (message) => logger.warn({ message, context }),
  error: (message) => logger.error({ message, context }),
});

export default Logger;
