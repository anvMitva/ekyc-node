// @ts-nocheck
import figlet from "figlet";
import { httpServer } from "../app.js";
import boxen from "boxen";
import { SERVER_CONFIG } from "../config/index.js";

const startServer = () => {
  const port = SERVER_CONFIG.PORT || 8090;
  const server = SERVER_CONFIG.HOST || "localhost";
  httpServer.listen(port, server, () => {
    const url = `http://${server}:${port}`;
    const message = `Server is running on ${url}`;

    // Calculate dynamic left padding for centering
    const terminalWidth = process.stdout.columns || 80;
    const boxWidth = message.length + 8; // Adjust for box padding and borders
    const leftPadding = Math.max(0, Math.floor((terminalWidth - boxWidth) / 2));

    const box = boxen(message, {
      padding: { top: 2, bottom: 2, left: 2, right: 2 },
      margin: { top: 1, bottom: 1, left: leftPadding, right: 0 },
      borderStyle: "round",
      borderColor: "blue",
      title: "Reports",
      titleAlignment: "center",
    });

    console.log(box);

    figlet("E-KYC", (err, data) => {
      if (err) {
        console.error("Something went wrong with figlet");
        return;
      }

      // Center the figlet output
      const terminalWidth = process.stdout.columns || 80;
      const lines = data.split("\n");
      const centeredFiglet = lines
        .map(line => line.padStart(Math.floor((terminalWidth + line.length) / 2)))
        .join("\n");

      console.log(centeredFiglet);
    });
  });
};

export default startServer;
