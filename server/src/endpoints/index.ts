/**
 * Endpoints domain.
 * Registers all HTTP routes – thin layer that calls services.
 */

import { Express } from "express";
import { healthEndpoint } from "./health.endpoint";
import { statsEndpoint } from "./stats.endpoint";

export function registerEndpoints(app: Express): void {
  app.use("/health", healthEndpoint);
  app.use("/api/stats", statsEndpoint);
}
