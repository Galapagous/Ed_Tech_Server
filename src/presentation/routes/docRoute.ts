import { Router } from "express";
import { DocController } from "../controllers/DocController";

export function createDocRoute(docController: DocController): Router {
  const router = Router();

  router.post("/", docController.createDoc);

  return router;
}
