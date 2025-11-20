import { CourseResponseDTO } from "@/application/dto/CourseDTOs";
import { IdGenerator } from "@/application/interfaces/IdGenerator";
import { ICloudStorage } from "@/domain/entities/cloudinary";
import { CourseRepository } from "@/domain/repositories/CourseRepository";

export class UpdateCourseUseCase {
  constructor(
    private courseRepository: CourseRepository,
    private idGenerator: IdGenerator,
    private storage: ICloudStorage
  ) {}

  async execute(dto: File, courseId: string): Promise<CourseResponseDTO> {
    const course = await this.courseRepository.findById(courseId);
    if (!course) throw new Error("Course does not exits");
    const id = this.idGenerator.generate();
    const fileUrl: Promise<string> = this.storage.upload(dto);
    if (!fileUrl) {
      throw new Error("Error uploading file");
    }
    const updatedCourse = await this.courseRepository.update(
      {
        url: fileUrl as unknown as string,
        courseId,
        id,
      },
      id
    );
    // --- Run background jobs to generate questions from pdf uploaded----

    return updatedCourse;
  }
}
