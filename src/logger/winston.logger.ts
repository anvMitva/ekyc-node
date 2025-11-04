// @ts-nocheck

// // import winston from "winston";
// // import path from "path";
// // import util from "util";


// // const levels = {
// //   error: 0,
// //   warn: 1,
// //   info: 2,
// //   http: 3,
// //   debug: 4,
// // };

// // const level = () => {
// //   const env = process.env.NODE_ENV || "development";
// //   return env === "development" ? "debug" : "warn";
// // };

// // const colors = {
// //   error: "red",
// //   warn: "yellow",
// //   info: "blue",
// //   http: "magenta",
// //   debug: "white",
// // };

// // winston.addColors(colors);

// // const format = winston.format.combine(
// //   // winston.format.timestamp({ format: "DD MMM, YYYY - HH:mm:ss:ms" }),
// //   winston.format.timestamp({
// //     format: () => {
// //       const now = new Date();
// //       const pad = (n, z = 2) => ('00' + n).slice(-z);
// //       const hours = now.getHours();
// //       const ampm = hours >= 12 ? 'PM' : 'AM';
// //       const hour12 = hours % 12 || 12;

// //       return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ` +
// //         `${pad(hour12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}:${pad(now.getMilliseconds(), 4)} ${ampm}`;
// //     }
// //   }),
// //   winston.format.colorize({ all: true }),
// //   winston.format.printf((info) => {
// //     const { timestamp, level, message, ...metadata } = info;

// //     // Filter out internal Winston properties
// //     const filteredMetadata = Object.fromEntries(
// //       Object.entries(metadata).filter(([ key ]) => !key.startsWith('Symbol('))
// //     );

// //     const metadataString = Object.keys(filteredMetadata).length > 0
// //       ? `\n${util.inspect(filteredMetadata, { colors: true, depth: null })}`
// //       : "";

// //     return `[${timestamp}] ${level}: ${message}${metadataString}`;
// //   })
// // );

// // const getLogFileName = (level) => {
// //   const date = new Date().toISOString().split("T")[ 0 ]; // YYYY-MM-DD format
// //   return path.join("logs", `${date}-${level}.log`);
// // };

// // const transports = [
// //   new winston.transports.Console(),
// //   new winston.transports.File({
// //     filename: getLogFileName("combined"),
// //   }),
// //   new winston.transports.File({
// //     filename: getLogFileName("error"),
// //     level: "error",
// //   }),
// //   new winston.transports.File({ filename: "logs/combined.log" }),
// //   new winston.transports.File({ filename: "logs/error.log", level: "error" }),
// // ];

// // const logger = winston.createLogger({
// //   level: level(),
// //   levels,
// //   format,
// //   transports,
// // });

// // export default logger;
// import winston from "winston";
// import path from "path";
// import util from "util";

// const levels = {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3,
//   debug: 4,
// };

// const colors = {
//   error: "red",
//   warn: "yellow",
//   info: "blue",
//   http: "magenta",
//   debug: "white",
// };

// winston.addColors(colors);

// const getTimestamp = () => {
//   const now = new Date();
//   const pad = (n, z = 2) => ('00' + n).slice(-z);
//   const hours = now.getHours();
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   const hour12 = hours % 12 || 12;

//   return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ` +
//     `${pad(hour12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}:${pad(now.getMilliseconds(), 4)} ${ampm}`;
// };

// // Format for console output (with colors)
// const consoleFormat = winston.format.combine(
//   winston.format.timestamp({
//     format: getTimestamp
//   }),
//   winston.format.colorize({ all: true }),
//   winston.format.printf((info) => {
//     const { timestamp, level, message, ...metadata } = info;
//     const filteredMetadata = Object.fromEntries(
//       Object.entries(metadata).filter(([key]) => !key.startsWith('Symbol('))
//     );

//     const metadataString = Object.keys(filteredMetadata).length > 0
//       ? `\n${util.inspect(filteredMetadata, { colors: true, depth: null })}`
//       : "";

//     return `[${timestamp}] ${level}: ${message}${metadataString}`;
//   })
// );

// // Format for file output (without colors)
// const fileFormat = winston.format.combine(
//   winston.format.timestamp({
//     format: getTimestamp
//   }),
//   winston.format.printf((info) => {
//     const { timestamp, level, message, ...metadata } = info;
//     const filteredMetadata = Object.fromEntries(
//       Object.entries(metadata).filter(([key]) => !key.startsWith('Symbol('))
//     );

//     const metadataString = Object.keys(filteredMetadata).length > 0
//       ? `\n${JSON.stringify(filteredMetadata, null, 2)}`
//       : "";

//     return `[${timestamp}] ${level}: ${message}${metadataString}`;
//   })
// );

// const getLogFileName = (level) => {
//   const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
//   return path.join("logs", `${date}-${level}.log`);
// };

// const transports = [
//   new winston.transports.Console({
//     format: consoleFormat
//   }),
//   new winston.transports.File({
//     filename: getLogFileName("combined"),
//     format: fileFormat
//   }),
//   new winston.transports.File({
//     filename: getLogFileName("error"),
//     level: "error",
//     format: fileFormat
//   }),
//   new winston.transports.File({ 
//     filename: "logs/combined.log",
//     format: fileFormat 
//   }),
//   new winston.transports.File({ 
//     filename: "logs/error.log", 
//     level: "error",
//     format: fileFormat 
//   }),
// ];

// const logger = winston.createLogger({
//   level: "debug",
//   levels,
//   transports,
// });

// export default logger;
import winston from "winston";
import path from "path";
import util from "util";
import correlationIds from './correlation.logger.js';
import { SERVER_CONFIG } from "../config/index.js";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};
const level = () => {
  const env = SERVER_CONFIG.NODE_ENV || "development";
  return env === "development" ? "debug" : "http";
};
const colors = {
  error: "red",
  warn: "yellow",
  info: "blue",
  http: "magenta",
  debug: "grey",
};

winston.addColors(colors);

const getTimestamp = () => {
  const now = new Date();
  const pad = (n, z = 2) => ('00' + n).slice(-z);
  const hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  return `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ` +
    `${pad(hour12)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}:${pad(now.getMilliseconds(), 4)} ${ampm}`;
};

// Format for console output (with colors)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({
    format: getTimestamp
  }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...metadata } = info;
    const correlationId = correlationIds.get() || 'NO_CORRELATION_ID';
    const filteredMetadata = Object.fromEntries(
      Object.entries(metadata).filter(([ key ]) => !key.startsWith('Symbol('))
    );

    const metadataString = Object.keys(filteredMetadata).length > 0
      ? `\n${util.inspect(filteredMetadata, { colors: true, depth: null })}`
      : "";

    return `[${timestamp}] [${correlationId}] ${level}: ${message}${metadataString}`;
  })
);

// Format for file output (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({
    format: getTimestamp
  }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...metadata } = info;
    const correlationId = correlationIds.get() || 'NO_CORRELATION_ID';
    const filteredMetadata = Object.fromEntries(
      Object.entries(metadata).filter(([ key ]) => !key.startsWith('Symbol('))
    );

    const metadataString = Object.keys(filteredMetadata).length > 0
      ? `\n${JSON.stringify(filteredMetadata, null, 2)}`
      : "";

    return `[${timestamp}] [${correlationId}] ${level}: ${message}${metadataString}`;
  })
);

const getLogFileName = (level) => {
  const date = new Date().toISOString().split("T")[ 0 ]; // YYYY-MM-DD format
  return path.join("logs", `${date}-${level}.log`);
};

const transports = [
  new winston.transports.Console({
    format: consoleFormat
  }),
  new winston.transports.File({
    filename: getLogFileName("combined"),
    format: fileFormat
  }),
  new winston.transports.File({
    filename: getLogFileName("error"),
    level: "error",
    format: fileFormat
  }),
  new winston.transports.File({
    filename: "logs/combined.log",
    format: fileFormat
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
    format: fileFormat
  }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
});

export default logger;
