import { DatabaseConnection } from "../database/connection";
import { PostgreSQLUserRepository } from "../repositories/PostgreSQLUserRepository";
import { BcryptPasswordHasher } from "../services/BcryptPasswordHasher";
import { UUIDGenerator } from "../services/UUIDGenerator";
import { UserDomainService } from "@/domain/services/UserDomainService";
import { CreateUserUseCase } from "@/application/use-case/user-cases/CreateUserUseCase";
import { GetUserUseCase } from "@/application/use-case/user-cases/GetUserUseCase";
import { UserValidator } from "@/application/validators/UserValidator";
import { UserController } from "@/presentation/controllers/UserController";
import { LoginUserUseCase } from "@/application/use-case/user-cases/LoginUserUseCase";
import { PostgreSQLCourseRepository } from "../repositories/PostgreSQLCourseRepository";
import { CreateCourseUseCase } from "@/application/use-case/course-case/CreateCourseUseCase";
import { CourseController } from "@/presentation/controllers/CourseController";
import { CourseValidator } from "@/application/validators/CourseValidator";
import { GetCourseUserCase } from "@/application/use-case/course-case/GetCourseUseCase";
import { MigrationRunner } from "../database/migrations/runMigration";
import { GetCourse } from "@/application/use-case/course-case/GetCourse";
import { DeleteCourseUseCase } from "@/application/use-case/doc-case/deleteDocUseCase";
import { PostgesSQLDocrepository } from "../repositories/PostgreSQLDocRepository";
import { CloudinaryService } from "../storage/cloudinaryStorage";
import { CreateDocUseCase } from "@/application/use-case/doc-case/createDocUseCase";
import { DocController } from "@/presentation/controllers/DocController";
import { GetDocByCourse } from "@/application/use-case/doc-case/getCourseDocUseCase";
import { PostgreSQLQuestionRepository } from "../repositories/PostgreSQLQuestionRepository";
import { PostgreSQLOptionRepository } from "../repositories/PostgreSQLOptionRepository";
import { AIProvider, AiService } from "../services/AIGenerator";
import dotenv from "dotenv";
import { CreateQuestionUseCase } from "@/application/use-case/question-case/CreateQuestionUseCase";
import { QuestionController } from "@/presentation/controllers/QuestionController";
import { GetCourseQuestionUseCase } from "@/application/use-case/question-case/GetCourseQuestionUseCase";
import { GetQuestionAndOptionUseCase } from "@/application/use-case/question-case/GetQuestionAndOptionUseCase";
import { ResultController } from "@/presentation/controllers/ResultController";
import { CreateResultUseCase } from "@/application/use-case/result-case/CreateResultUseCase";
import { ResultValidator } from "@/application/validators/ResultValidator";
import { PostgresResultRepository } from "../repositories/PostgresResultRepository";
import { PostgresAnserRepository } from "../repositories/PostgresSQLAnswerRepository";
dotenv.config();

export class DIContainer {
  private static instance: DIContainer;
  private dependencies: Map<string, any> = new Map();

  private constructor() {
    this.setupDependencies();
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  private setupDependencies(): void {
    // infrastructure
    const aiProvider =
      AIProvider.GEMINI || AIProvider.OPENAI || AIProvider.HUGGINGFACE;
    const geminiKey: string = process?.env?.GEMINI_API_KEY as string;
    const dbConnection = DatabaseConnection.getInstance();
    const pool = dbConnection.getPool();
    this.register("pool", pool);

    // run migrations
    const migrations = new MigrationRunner(pool).runMigrations();

    // repositories
    const userRepository = new PostgreSQLUserRepository(pool);
    this.register("userRepository", userRepository);
    const courseRepository = new PostgreSQLCourseRepository(pool);
    this.register("courseRepository", courseRepository);
    const docRepository = new PostgesSQLDocrepository(pool);
    this.register("docRepository", docRepository);
    const questionRepository = new PostgreSQLQuestionRepository(pool);
    this.register("questionRepository", questionRepository);
    const optionRepository = new PostgreSQLOptionRepository(pool);
    this.register("optionRepository", optionRepository);
    const resultRepository = new PostgresResultRepository(pool);
    this.register("resultRepository", resultRepository);
    const answerRepository = new PostgresAnserRepository(pool);
    this.register("answerRepository", answerRepository);
    //   Services

    const passwordHasher = new BcryptPasswordHasher();
    const idGenerator = new UUIDGenerator();
    const userDomainService = new UserDomainService(userRepository);
    const cloudinaryService = new CloudinaryService();
    const aiService = new AiService(geminiKey, aiProvider);

    this.register("passwordHasher", passwordHasher);
    this.register("idGenerator", idGenerator);
    this.register("userDomainService", userDomainService);
    this.register("cloudinaryService", cloudinaryService);
    this.register("AIService", aiService);

    // ============== use cases ==============
    const createUserUseCase = new CreateUserUseCase(
      userRepository,
      userDomainService,
      passwordHasher,
      idGenerator
    );
    const getUserUseCase = new GetUserUseCase(userRepository);
    const loginUserUseCase = new LoginUserUseCase(
      userRepository,
      passwordHasher
    );
    // === ===
    const createCourseUseCase = new CreateCourseUseCase(
      courseRepository,
      idGenerator
    );
    const getUserCourseUseCase = new GetCourseUserCase(courseRepository);
    const getCourse = new GetCourse(courseRepository);
    const deleteUserCourse = new DeleteCourseUseCase(courseRepository);
    // === ===
    const createDocUseCase = new CreateDocUseCase(
      docRepository,
      idGenerator,
      cloudinaryService
    );
    const getDocByCourse = new GetDocByCourse(docRepository);
    // === ===
    const createQuestionUseCase = new CreateQuestionUseCase(
      questionRepository,
      optionRepository,
      idGenerator,
      docRepository,
      aiService,
      courseRepository
    );

    const getCourseQuestionUseCase = new GetCourseQuestionUseCase(
      questionRepository
    );
    const getQuestionAndOptionUseCase = new GetQuestionAndOptionUseCase(
      questionRepository,
      optionRepository
    );
    // === ===
    const createResultUseCase = new CreateResultUseCase(
      idGenerator,
      resultRepository,
      questionRepository,
      optionRepository,
      answerRepository
    );

    this.register("createUserUseCase", createUserUseCase);
    this.register("getUserUseCase", getUserUseCase);
    this.register("createCourseUseCase", createCourseUseCase);
    this.register("getCourse", getCourse);
    this.register("deleteUserCourse", deleteUserCourse);
    this.register("createDocUseCase", createDocUseCase);
    this.register("createCourseUseCase", createQuestionUseCase);
    this.register("getCourseQuestionUseCase", getCourseQuestionUseCase);
    this.register("getQuestionAndOptionUseCase", getQuestionAndOptionUseCase);

    // ============== Validators ==============
    const userValidator = new UserValidator();
    const courseValidator = new CourseValidator();
    const resultValidator = new ResultValidator();
    this.register("userValidator", userValidator);
    this.register("courseValidator", courseValidator);
    this.register("resultValidator", resultValidator);

    //  ============== controllers ==============
    const userController = new UserController(
      createUserUseCase,
      getUserUseCase,
      userValidator,
      loginUserUseCase
    );
    const courseController = new CourseController(
      createCourseUseCase,
      courseValidator,
      userValidator,
      getUserCourseUseCase,
      getCourse,
      deleteUserCourse,
      getDocByCourse
    );
    const docController = new DocController(createDocUseCase, userValidator);
    const questionController = new QuestionController(
      createQuestionUseCase,
      userValidator,
      getCourseQuestionUseCase,
      getQuestionAndOptionUseCase
    );
    const resultController = new ResultController(
      createResultUseCase,
      resultValidator
    );
    this.register("userController", userController);
    this.register("courseController", courseController);
    this.register("docController", docController);
    this.register("questionController", questionController);
    this.register("resultController", resultController);
  }

  public register<T>(name: string, dependencies: T): void {
    this.dependencies.set(name, dependencies);
  }

  public get<T>(name: string): T {
    const dependency = this.dependencies.get(name);
    if (!dependency) {
      throw new Error(`Dependency ${name} not found`);
    }
    return dependency;
  }
}
