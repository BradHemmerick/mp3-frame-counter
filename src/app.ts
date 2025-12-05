import express from "express";
import multer from "multer";
import { countMp3Frames } from "./mp3/frameCounter.ts";

export function buildServer() {
  const app = express();

  app.use(express.json());

  const upload = multer({
    storage: multer.memoryStorage(),
  });  

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/file-upload", upload.single("file"), (req, res) => {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "file is required" });
    }

    const buffer = file.buffer;
    const debug = req.query.debug === "true";

    try {
      const frameCount = countMp3Frames(buffer, debug);
      if (frameCount === 0) {
        return res
          .status(422)
          .json({ error: "no mpeg1 layer 3 frames found in file" });
      }

      return res.json({ frameCount });
    } catch (err) {
      console.error("failed to parse mp3:", err);
      return res.status(400).json({ error: "failed to parse mp3 file" });
    }
  });

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("unhandled error:", err);
    res.status(500).json({ error: "internal server error" });
  });


  return app;
}
