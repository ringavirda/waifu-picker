import "reflect-metadata";

import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { access, constants } from "fs/promises";
import { resolve } from "path";
import { CharactersController } from "./controllers/characters";
import { DefaultController } from "./controllers/default";
import { PollingController } from "./controllers/polling";
import {
  errorHandlingMiddleware,
  logger,
  loggingMiddleware,
  notFoundMiddleware,
  useControllerRoutes,
} from "@wp/controllers";
import { JsonSerialization, StaticConfig } from "@wp/common";

logger.info("Server", "Startup begin.");

const serverPort = Number.parseInt(
  process.env.SERVER_API_PORT ?? StaticConfig.apiPort.toString(),
);
const serverHostname =
  process.env.SERVER_API_HOSTNAME ?? StaticConfig.apiHostname;
const clientBasePath = process.env.SERVER_CLIENT_BASE_PATH ?? "/";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(
  express.json({
    reviver: JsonSerialization.reviver,
  }),
);

app.use(loggingMiddleware);
if (process.env.NODE_ENV === "development")
  app.use(cors({ origin: "*", credentials: true }));
else app.use(cors({ origin: "https://felled-stars.org", credentials: true }));

useControllerRoutes(DefaultController, app);
DefaultController.preloadPrincess();
useControllerRoutes(CharactersController, app);
useControllerRoutes(PollingController, app);

try {
  const staticPath = resolve(__dirname, "public");
  console.log(staticPath);
  await access(staticPath, constants.F_OK);
  app.use(
    clientBasePath,
    express.static(staticPath, { index: ["index.html"] }),
  );
  logger.info("Server", `Client routes loaded`);
} catch {
  logger.warn(
    "Server",
    "No `public` folder was found. Running in pure API mode.",
  );
}

app.use(errorHandlingMiddleware);
app.use(notFoundMiddleware);

const server = http.createServer(app);
server.listen(serverPort, serverHostname, () => {
  logger.info(
    "Server",
    "Startup finished!" +
      "\nListening on:" +
      `\n\thttp://${serverHostname}:${serverPort}` +
      "\nClient base path: " +
      `\n\thttp://${serverHostname}:${serverPort}${clientBasePath}` +
      "\nAPI base path: " +
      `\n\thttp://${serverHostname}:${serverPort}/api`,
  );
});

if (process.argv.includes(`--preload`)) {
  logger.info("Server", `--preload was passed, starting to preload media...`);
  await CharactersController.preloadAndPreprocessMedia();
}

const io = new Server();

io.on("connection", (socket) => {
  socket.on("pols-change", (json: string) => {
    socket.broadcast.emit("pols-update", json);
  });
});

io.listen(server);
