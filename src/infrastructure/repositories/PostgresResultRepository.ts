import { Result } from "@/domain/entities/result";
import { ResultRepository } from "@/domain/repositories/ResultRepository";
import { Pool } from "pg";

// export class PostgresResultRepository implements ResultRepository{
//     constructor(private pool: Pool){}

//     async save(result: Result): Promise<Result> {
//         const query =  `INSERT INTO results (id, attemptId, questionId, answerId, score)`

//     }
// }
