/**
 * Stats endpoint – endpoints domain.
 * HTTP layer: maps service result to response.
 */

import { Router, Request, Response } from "express";
import { getStats } from "../services/stats.service";

const router = Router();

router.get("/statistics", (_req: Request, res: Response) => {
  const result = getStats();
  res.json(result);
});

export const statsEndpoint = router;
