import Joi from "joi";
import { createDoc } from "../dto/DocDTO";

interface CreateDoc {
  url: string;
  courseId: string;
}

export class DocValidator {
  private createDocSchema = Joi.object<createDoc>({
    url: Joi.string().required(),
    courseId: Joi.string().min(5).required(),
  });

  validateDoc(data: unknown): CreateDoc {
    const { error, value } = this.createDocSchema.validate(data);
    if (error) {
      throw new Error(
        `Validation error: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    return value;
  }
}
