import { User } from "../entities/User";
import { Email } from "../value-objects/Email";

export interface UserRepository {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(limit?: number, offset?: number): Promise<User[]>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
