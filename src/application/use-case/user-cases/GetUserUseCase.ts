import { UserRepository } from "@/domain/repositories/UserRepository";
import { UserResponseDTO } from "../../dto/UserDTOs";
import { NotFoundError } from "@/shared/errors/NotFoundError";

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
