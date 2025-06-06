import { User } from "../../../../domain/entities/user.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";
import { IGetCurrentUserUseCase } from "../interfaces/get-current-user.usecase.interface";

export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    if (user.deletedAt) {
      throw new HttpError("User not found", 401);
    }
    return user;
  }
}
