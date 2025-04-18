import { Role } from "@prisma/client";

export interface BaseInstructorDetails {
  areaOfExpertise: string;
  professionalExperience: string;
  about: string | null;
  userId: string;
  website: string | null;
}

export type CreateInstructorInput = BaseInstructorDetails;

export interface IInstructorDetails extends BaseInstructorDetails {
  id: string;
}

export interface IInstructor extends IInstructorDetails {
  email: string;
  role: Role;
}

export type InstructorWithToken = IInstructor & { newToken: string };

export interface IInstructorRepository {
  createInstructor(input: CreateInstructorInput): Promise<IInstructorDetails>;
}
