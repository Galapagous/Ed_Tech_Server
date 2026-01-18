import { CourseResponseDTO } from "@/application/dto/CourseDTOs";
import { Course } from "@/domain/entities/course";
import { CourseRepository } from "@/domain/repositories/CourseRepository";
import { QuestionRepository } from "@/domain/repositories/QuestionRepository";

export class GetCourse {
  constructor(
    private courseRepository: CourseRepository,
    private QuestionRepository: QuestionRepository
  ) {}

  async execute(dto: string): Promise<CourseResponseDTO> {
    const course = await this.courseRepository.findById(dto);
    let questions = null;
    // attach number of questions in course
    if (course) {
      questions = await this.QuestionRepository.findByCourse(course.id);
    }
    return {
      ...course,
      questions: questions ? questions?.length : 0,
    } as unknown as Course;
  }
}
