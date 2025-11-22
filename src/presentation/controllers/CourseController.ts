import { CreateCourseUseCase } from "@/application/use-case/course-case/CreateCourseUseCase";
import { GetCourse } from "@/application/use-case/course-case/GetCourse";
import { GetCourseUserCase } from "@/application/use-case/course-case/GetCourseUseCase";
import { DeleteCourseUseCase } from "@/application/use-case/doc-case/deleteDocUseCase";
import { GetDocByCourse } from "@/application/use-case/doc-case/getCourseDocUseCase";
import { CourseValidator } from "@/application/validators/CourseValidator";
import { UserValidator } from "@/application/validators/UserValidator";
import { NextFunction, Request, Response } from "express";

export class CourseController {
  constructor(
    private createCourseUseCase: CreateCourseUseCase,
    private courseValidator: CourseValidator,
    private userValidator: UserValidator,
    private getUserCourses: GetCourseUserCase,
    private getCourse: GetCourse,
    private deleteUserCourse: DeleteCourseUseCase,
    private getDocByCourse: GetDocByCourse
  ) {}

  createCourse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto = this.courseValidator.validateCreate(req.body);
      const owner = this.userValidator.validateToken(req, res);
      const course = this.createCourseUseCase.execute({
        ...dto,
        ownerId: owner as string,
      });
      res.status(201).json({
        status: true,
        data: course,
        message: "Course created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getCourses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const owner = this.userValidator.validateToken(req, res);
      const courses = await this.getUserCourses.execute(owner as string);
      res.status(201).json({
        status: true,
        data: courses,
        message: "Course sent successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getACourse = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id;
      const owner = this.userValidator.validateToken(req, res);
      const course = await this.getCourse.execute(id);
      if (course.ownerid !== owner) {
        res.status(400).json({
          status: false,
          message: "You cannot access someone else course",
        });
      }
      // ---  grab corresponding document attached ----
      const docs = await this.getDocByCourse.execute((await course).id);
      // ---  grab total questions in course ----
      res.status(200).json({
        status: true,
        data: { ...course, docs },
        message: "Course fetch successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteCourse = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    console.log("1");
    const owner = this.userValidator.validateToken(req, res);
    console.log("2");
    const course = await this.getCourse.execute(id);
    console.log("3");
    if (course.ownerid !== owner) {
      res.status(401).json({
        status: false,
        message: "You are not authorize to perform this operation",
      });
      return;
    }
    console.log("4");
    await this.deleteUserCourse.execute(id);
    res.status(200).json({
      status: true,
      message: "Course deleted successfully",
    });
  };
}
