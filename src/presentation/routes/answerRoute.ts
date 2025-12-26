import { Router } from "express";
import { AnswerController } from "../controllers/AnswerController";

export function createAnswerRoute(answerController: AnswerController): Router {
  const router = Router();

  router.get("/:id", answerController.getAnswer);

  return router;
}
