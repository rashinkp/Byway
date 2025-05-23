import {
  AdminUpdateUserInput,
  IGetAllUsersWithSkip,
  IPublicUser,
  IUser,
  IUserWithProfile,
  UpdateUserInput,
  UpdateUserRoleInput,
} from "./user.types";
import { Role } from "@prisma/client";

export interface IUserRepository {
  updateUser(input: UpdateUserInput): Promise<IUserWithProfile>;
  getAllUsers(
    input: IGetAllUsersWithSkip
  ): Promise<{ users: IUser[]; total: number }>;
  updateUserByAdmin(input: AdminUpdateUserInput): Promise<void>;
  findUserByEmail(email: string): Promise<IUser | null>;
  findUserById(userId: string): Promise<IUser | null>;
  updateUserRole(input: UpdateUserRoleInput): Promise<IUser>;
  getUserData(userId: string, requesterRole: Role): Promise<IUser>;
  getPublicUserData(userId: string): Promise<IPublicUser>;
}
