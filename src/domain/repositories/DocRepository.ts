import { Doc } from "../entities/doc";

export interface DocRepository {
  save(doc: Doc): Promise<Doc>;
  findById(id: string): Promise<Doc | null>;
  findByCourseId(courseid: string): Promise<Doc[] | null>;
  delete(id: string): Promise<boolean>;
}
