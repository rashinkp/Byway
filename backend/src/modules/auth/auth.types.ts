

export interface IResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}


export interface IForgotPasswordInput {
  email: string;
}



export interface IAuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  password?: string;
  avatar?: string;
  isVerified?: boolean;
  authProvider?: string;
  deletedAt?: Date | null;
}


export interface IAuthRepository {
  createAdmin(
    name: string,
    email: string,
    password: string
  ): Promise<IAuthUser>;
  createUser(name: string, email: string, password: string): Promise<IAuthUser>;
  resetPassword(email: string, hashedPassword: string): Promise<void>;
}
