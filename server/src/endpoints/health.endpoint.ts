/**
 * Health endpoint – endpoints domain.
 * HTTP layer: maps service result to response.
 */

import { Router, Request, Response } from "express";
import { getHealth } from "../services/health.service";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  const result = getHealth();
  res.json(result);
});

export const healthEndpoint = router;
