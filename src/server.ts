import { buildServer } from "./app";
import "dotenv/config";

const PORT = process.env.PORT || 3000;
const app = buildServer();
const server = app.listen(PORT);

server.on("listening", () => {
  console.log(`server listening on port ${PORT}`);
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`port ${PORT} is already in use`);
  } else {
    console.error("server failed to start:", err);
  }
});