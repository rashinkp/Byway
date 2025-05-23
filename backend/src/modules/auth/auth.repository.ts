import { PrismaClient } from "@prisma/client";
import { IAuthRepository } from "./auth.repository.interface";
import { IAuthUser } from "./auth.types";


export class AuthRepository implements IAuthRepository {
  constructor(private prisma: PrismaClient) {}

  async createAdmin(
    name: string,
    email: string,
    password: string
  ): Promise<IAuthUser> {
    return this.prisma.user.create({
      data: { name, email, password, role: "ADMIN" },
    }) as Promise<IAuthUser>;
  }

  async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<IAuthUser> {
    return this.prisma.user.create({
      data: { name, email, password, isVerified: false },
    }) as Promise<IAuthUser>;
  }

  async createGoogleUser(
    name: string,
    email: string,
    googleId: string
  ): Promise<IAuthUser> {
    return this.prisma.user.create({
      data: {
        name,
        email,
        role: "USER",
        isVerified: true, 
        authProvider: "GOOGLE",
        googleId, 
      },
    }) as Promise<IAuthUser>;
  }


  async createFacebookUser(name:string , email:string , picture:string , userId:string): Promise<IAuthUser> {
    return this.prisma.user.create({
      data: {
        name,
        email,
        role: 'USER',
        isVerified: true,
        authProvider: 'FACEBOOK',
        avatar:picture,
        facebookId:userId
      },
    }) as Promise<IAuthUser>
  }

  async resetPassword(email: string, hashedPassword: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }

  
}
