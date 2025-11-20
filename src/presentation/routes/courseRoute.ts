import { Router } from "express";
import { CourseController } from "../controllers/CourseController";

export function createCourseRoute(courseController: CourseController): Router {
  const router = Router();

  router.get("/", courseController.getCourses);
  router.get("/:id", courseController.getACourse);
  router.post("/", courseController.createCourse);
  router.delete("/:id", courseController.deleteCourse);

  return router;
}
