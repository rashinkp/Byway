import { ToggleDeleteUserDto } from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";
import { IToggleDeleteUserUseCase } from "../interfaces/toggle-delete-user.usecase.interface";

export class ToggleDeleteUserUseCase implements IToggleDeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    dto: ToggleDeleteUserDto,
    currentUser: { id: string; role: string }
  ): Promise<User> {
    if (currentUser.role !== "ADMIN") {
      throw new HttpError("Unauthorized: Admin role required", 403);
    }


    const user = await this.userRepository.findById(dto.id);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    if (!user.deletedAt) {
      user.softDelete();
    } else {
      user.restore();
    }

    return await this.userRepository.updateUser(user);
  }
}
