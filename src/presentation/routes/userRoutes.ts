import { Router } from "express";
import { UserController } from "../controllers/UserController";

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  router.post("/register", userController.createUser);
  router.post("/login", userController.login);
  router.get("/", userController.getUser);

  return router;
}
