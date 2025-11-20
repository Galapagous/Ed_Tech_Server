import express from "express";
import cors from "cors";
import helmet from "helmet";
import { DIContainer } from "./infrastructure/container/DIContainer";
import { createUserRoutes } from "./presentation/routes/userRoutes";

import { errorMiddleware } from "./presentation/middleware/errorMiddleware";
import { UserController } from "./presentation/controllers/UserController";
import { createCourseRoute } from "./presentation/routes/courseRoute";
import { CourseController } from "./presentation/controllers/CourseController";

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
  app.use("/api/auth", createUserRoutes(userController));
  app.use("/api/course", createCourseRoute(courseController));
  app.use("/", (req, res) => {
    res.send("Hello from backend");
  });

  app.use(errorMiddleware);

  return app;
}
