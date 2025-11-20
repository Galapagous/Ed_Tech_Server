import { UserRepository } from "../repositories/UserRepository";
import { Email } from "../value-objects/Email";

export class UserDomainService {
  constructor(private userRepository: UserRepository) {}

  async isEmailUnique(email: Email, excludeUserId?: string): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser === null || existingUser === undefined) {
      return true;
    }

    return excludeUserId ? existingUser.id !== excludeUserId : false;
  }

  async canUserBeDeleted(userId: string): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    return user !== null && user.isActive;
  }
}
