/**
 * Server bootstrap.
 * Wires Express, middleware, and domain endpoints.
 */

import express from "express";
import cors from "cors";
import { registerEndpoints } from "./endpoints";
import { logger } from "./library/tools";

const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

registerEndpoints(app);

app.listen(Number(port), host, () => {
  logger.info("Server listening", { url: `http://${host}:${port}` });
});
