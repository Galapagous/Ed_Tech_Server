import { UserRepository } from "@/domain/repositories/UserRepository";
import { UserDomainService } from "@/domain/services/UserDomainService";
import { PasswordHasher } from "../../interfaces/PasswordHasher";
import { IdGenerator } from "../../interfaces/IdGenerator";
import { CreateUserDTO, UserResponseDTO } from "../../dto/UserDTOs";
import { Email } from "@/domain/value-objects/Email";
import { User } from "@/domain/entities/User";

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private userDomainService: UserDomainService,
    private passwordHasher: PasswordHasher,
    private idGenerator: IdGenerator
  ) {}
  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    const email = new Email(dto.email);
    const isEmailUnique = await this.userDomainService.isEmailUnique(email);
    if (isEmailUnique === false) {
      throw new Error("Email already exist");
    }

    const hashedPassword = await this.passwordHasher.hash(dto.password);

    const userId = this.idGenerator.generate();

    const user = User.create(userId, dto.email, dto.username, hashedPassword);
    const savedUser = await this.userRepository.save(user);

    return this.mapToResponseDTO(savedUser);
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
