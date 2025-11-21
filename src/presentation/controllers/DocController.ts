// src/presentation/controllers/DocController.ts

import { CreateDocUseCase } from "@/application/use-case/doc-case/createDocUseCase";
import { UserValidator } from "@/application/validators/UserValidator";
import { Request, Response, NextFunction } from "express";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() }); // ← important

export class DocController {
  constructor(
    private createDocUseCase: CreateDocUseCase,
    private userValidator: UserValidator
  ) {}

  createDoc = [
    upload.single("file"),

    async (req: Request, res: Response, next: NextFunction) => {
      try {
        if (!req.file) {
          return res
            .status(400)
            .json({ message: "No file uploaded or wrong field name" });
        }

        const courseId = req.body.courseId as string;

        if (!courseId) {
          return res.status(400).json({ message: "courseId is required" });
        }

        // PASS THE REAL FILE HERE
        const savedDoc = await this.createDocUseCase.execute(
          req.file,
          courseId
        );

        res.status(201).json({
          status: true,
          data: savedDoc,
          message: "Document uploaded successfully",
        });
      } catch (error) {
        next(error);
      }
    },
  ];
}
