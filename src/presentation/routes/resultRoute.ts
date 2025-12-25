import { Router } from "express";
import { ResultController } from "../controllers/ResultController";

export function createResultRoute(resultController: ResultController): Router {
  const router = Router();
  router.post("/", resultController.createResult);
  router.get("/:courseId", resultController.getCourseResult);
  return router;
}
