import "reflect-metadata";

import express from "express";
// import cors from "cors";
import http from "http";
import https from "https";
import { Server } from "socket.io";
import { access, constants } from "fs/promises";
import { resolve } from "path";
import { readFileSync } from "fs";

import { CharactersController } from "./controllers/characters";
import { DefaultController } from "./controllers/default";
import { PollingController } from "./controllers/polling";
import {
  corsMiddleware,
  errorHandlingMiddleware,
  logger,
  loggingMiddleware,
  notFoundMiddleware,
  useControllerRoutes,
} from "@wp/controllers";
import { MapSerializationFixes, StaticConfig } from "@wp/common";

logger.info("Server", "Startup begin.");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    reviver: MapSerializationFixes.reviver,
  }),
);

// app.use(cors({ origin: "https://felled-stars.org", credentials: true }));
app.use(corsMiddleware);
app.use(loggingMiddleware);

try {
  const staticPath = resolve(__dirname, "public");
  await access(staticPath, constants.F_OK);
  StaticConfig.clientRoutes.forEach((r) =>
    app.use(r, express.static(staticPath)),
  );
  logger.info(
    "Server",
    `Client routes loaded: [ ${StaticConfig.clientRoutes.join(", ")} ]`,
  );
} catch {
  logger.warn(
    "Server",
    "No `public` folder was found. Running in pure API mode.",
  );
}

useControllerRoutes(DefaultController, app);
DefaultController.preloadPrincess();
useControllerRoutes(CharactersController, app);
useControllerRoutes(PollingController, app);

app.use(errorHandlingMiddleware);
app.use(notFoundMiddleware);

const server = http.createServer(app);
server.listen(StaticConfig.commonPort, () => {
  logger.info(
    "Server",
    "Startup finished, listening on:" +
      `\nhttp://${StaticConfig.commonHostname}:${StaticConfig.commonPort}`,
  );
});

// const options = {
//   key: readFileSync(resolve(__dirname, "cert", "key.pem")),
//   cert: readFileSync(resolve(__dirname, "cert", "cert.pem")),
// };
// const secServer = https.createServer(options, app);
// secServer.listen(StaticConfig.commonSecPort, () => {
//   logger.info(
//     "Server",
//     "Secure server is listening on:" +
//       `\nhttps://localhost:${StaticConfig.commonSecPort}`,
//   );
// });

if (process.argv.includes(`--${StaticConfig.serverPreloadFlag}`)) {
  logger.info(
    "Server",
    `--${StaticConfig.serverPreloadFlag} was passed, starting to preload media...`,
  );
  await CharactersController.preloadAndPreprocessMedia();
}

const io = new Server();

io.on("connection", (socket) => {
  socket.on("pols-change", (json: string) => {
    socket.broadcast.emit("pols-update", json);
  });
});

io.listen(server);
