import { Router } from "express";
import { QuestionController } from "../controllers/QuestionController";

export function createQuestionRoute(
  questionController: QuestionController
): Router {
  const router = Router();

  router.post("/:id", questionController.createQuestion);

  return router;
}
