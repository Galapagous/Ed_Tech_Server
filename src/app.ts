import express from "express";
import cors from "cors";
import helmet from "helmet";
import { DIContainer } from "./infrastructure/container/DIContainer";
import { createUserRoutes } from "./presentation/routes/userRoutes";
import { errorMiddleware } from "./presentation/middleware/errorMiddleware";
import { UserController } from "./presentation/controllers/UserController";
import { createCourseRoute } from "./presentation/routes/courseRoute";
import { CourseController } from "./presentation/controllers/CourseController";
import { DocController } from "./presentation/controllers/DocController";
import { createDocRoute } from "./presentation/routes/docRoute";
import { QuestionController } from "./presentation/controllers/QuestionController";
import { createQuestionRoute } from "./presentation/routes/questionRoute";
import { ResultController } from "./presentation/controllers/ResultController";
import { createResultRoute } from "./presentation/routes/resultRoute";
import { createAnswerRoute } from "./presentation/routes/answerRoute";
import { AnswerController } from "./presentation/controllers/AnswerController";

export function createApp(): express.Application {
  const app = express();
  const container = DIContainer.getInstance();

  // Middleware
  app.use(helmet());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  const corsOpts = {
    origin: "*",
    methods: ["GET", "POST", "DELETE"],
    // allowedHeaders: ["Content-Type"],
  };
  app.use(cors(corsOpts));

  app.get("/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  const userController = container.get<UserController>("userController");
  const courseController = container.get<CourseController>("courseController");
  const docController = container.get<DocController>("docController");
  const questionController =
    container.get<QuestionController>("questionController");
  const resultController = container.get<ResultController>("resultController");
  const answerController = container.get<AnswerController>("answerController");
  app.use("/api/auth", createUserRoutes(userController));
  app.use("/api/course", createCourseRoute(courseController));
  app.use("/api/doc", createDocRoute(docController));
  app.use("/api/question", createQuestionRoute(questionController));
  app.use("/api/result", createResultRoute(resultController));
  app.use("/api/answer", createAnswerRoute(answerController));

  app.use("/", (req, res) => {
    res.send("Hello from backend");
  });

  app.use(errorMiddleware);

  return app;
}
