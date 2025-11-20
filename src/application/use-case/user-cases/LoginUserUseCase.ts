import { UserRepository } from "@/domain/repositories/UserRepository";
import { LoginUserDTO, UserResponseDTO } from "../../dto/UserDTOs";
import { Email } from "@/domain/value-objects/Email";
import { User } from "@/domain/entities/User";
import { PasswordHasher } from "../../interfaces/PasswordHasher";

export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: PasswordHasher
  ) {}
  async execute(dto: LoginUserDTO): Promise<UserResponseDTO> {
    const email = new Email(dto.email);
    const user = await this.userRepository.findByEmail(email);
    if (user === null) {
      throw new Error("Invalid Email or password");
    }
    const isValidPassword = await this.passwordHasher.compare(
      dto.password,
      user.hashedPassword
    );
    if (!isValidPassword) {
      throw new Error("Invalid Email or password");
    }

    return this.mapToResponseDTO(user);
  }

  private mapToResponseDTO(user: User): UserResponseDTO {
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
