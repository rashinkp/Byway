import { RegisterDto } from "../../../../domain/dtos/auth/register.dto";
import { User } from "../../../../domain/entities/user.entity";

export interface IRegisterUseCase {
  execute(dto: RegisterDto): Promise<User>;
}
