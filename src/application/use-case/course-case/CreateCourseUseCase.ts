import { CourseRepository } from "@/domain/repositories/CourseRepository";
import { CourseResponseDTO, CreateCourse } from "../../dto/CourseDTOs";
import { IdGenerator } from "../../interfaces/IdGenerator";
import { Course } from "@/domain/entities/course";

export class CreateCourseUseCase {
  constructor(
    private courseRepository: CourseRepository,
    private idGenerator: IdGenerator
  ) {}

  async execute(dto: CreateCourse): Promise<CourseResponseDTO> {
    const id = this.idGenerator.generate();
    const course = Course.create(id, dto.title, dto.description, dto.ownerId);
    const savedCourse = await this.courseRepository.save(course);
    return savedCourse;
  }
}
