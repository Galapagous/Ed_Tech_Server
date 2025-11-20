import Joi from "joi";

interface CreateCourseDTO {
  title: string;
  description: string;
}

export class CourseValidator {
  private createCourseSchema = Joi.object<CreateCourseDTO>({
    title: Joi.string().min(2).max(50).required(),
    description: Joi.string().min(2).required(),
  });

  validateCreate(data: unknown): CreateCourseDTO {
    const { error, value } = this.createCourseSchema.validate(data);
    if (error) {
      throw new Error(
        `Validation error: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    return value;
  }
}
