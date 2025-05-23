import { APPROVALSTATUS, PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../utils/logger";
import {
  CreateInstructorInput,
  IInstructorDetails,
  IInstructorWithUserDetails,
  IUserDetails,
  UpdateInstructorStatusInput,
} from "./instructor.types";
import { IInstructorRepository } from "./instructor.repository.interface";

export class InstructorRepository implements IInstructorRepository {
  constructor(private prisma: PrismaClient) {}

  async createInstructor(
    input: CreateInstructorInput
  ): Promise<IInstructorDetails> {
    const { areaOfExpertise, professionalExperience, about, userId, website } =
      input;

    try {
      // Check if an instructor record already exists for the user
      const existingInstructor = await this.prisma.instructorDetails.findFirst({
        where: { userId },
      });

      let instructorDetails;

      if (existingInstructor) {
        // Update existing record
        instructorDetails = await this.prisma.instructorDetails.update({
          where: { id: existingInstructor.id },
          data: {
            areaOfExpertise,
            professionalExperience,
            about,
            website,
            status: APPROVALSTATUS.PENDING, // Reset to PENDING for reapplication
          },
        });
      } else {
        // Create new record
        instructorDetails = await this.prisma.instructorDetails.create({
          data: {
            areaOfExpertise,
            professionalExperience,
            about,
            userId,
            website,
            status: APPROVALSTATUS.PENDING,
          },
        });
      }

      return {
        id: instructorDetails.id,
        areaOfExpertise: instructorDetails.areaOfExpertise,
        professionalExperience: instructorDetails.professionalExperience,
        about: instructorDetails.about ?? null,
        userId: instructorDetails.userId,
        website: instructorDetails.website ?? null,
        status: instructorDetails.status,
      };
    } catch (error) {
      logger.error("Error creating or updating instructor details", {
        error,
        input,
      });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to create or update instructor details",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "DATABASE_ERROR"
          );
    }
  }

  async updateInstructorStatus(
    input: UpdateInstructorStatusInput
  ): Promise<IInstructorDetails> {
    const { instructorId, status } = input;

    try {
      const instructorDetails = await this.prisma.instructorDetails.update({
        where: { id: instructorId },
        data: { status },
      });

      return {
        id: instructorDetails.id,
        areaOfExpertise: instructorDetails.areaOfExpertise,
        professionalExperience: instructorDetails.professionalExperience,
        about: instructorDetails.about ?? null,
        userId: instructorDetails.userId,
        website: instructorDetails.website ?? null,
        status: instructorDetails.status,
      };
    } catch (error) {
      logger.error("Error updating instructor status", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to update instructor status",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "DATABASE_ERROR"
          );
    }
  }

  async findInstructorById(
    instructorId: string
  ): Promise<IInstructorDetails | null> {
    try {
      const instructorDetails = await this.prisma.instructorDetails.findUnique({
        where: { id: instructorId },
      });

      if (!instructorDetails) return null;

      return {
        id: instructorDetails.id,
        areaOfExpertise: instructorDetails.areaOfExpertise,
        professionalExperience: instructorDetails.professionalExperience,
        about: instructorDetails.about ?? null,
        userId: instructorDetails.userId,
        website: instructorDetails.website ?? null,
        status: instructorDetails.status,
      };
    } catch (error) {
      logger.error("Error finding instructor by ID", { error, instructorId });
      throw new AppError(
        "Failed to find instructor",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "DATABASE_ERROR"
      );
    }
  }

  async findInstructorByUserId(
    userId: string
  ): Promise<IInstructorWithUserDetails> {
    try {
      const instructorDetails = await this.prisma.instructorDetails.findFirst({
        where: { userId },
        include: {
          user: true,
        },
      });

      if (!instructorDetails) {
        throw new AppError(
          "Instructor not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }

      return {
        instructor: {
          id: instructorDetails.id,
          areaOfExpertise: instructorDetails.areaOfExpertise,
          professionalExperience: instructorDetails.professionalExperience,
          about: instructorDetails.about ?? null,
          userId: instructorDetails.userId,
          website: instructorDetails.website ?? null,
          status: instructorDetails.status,
        },
        user: {
          id: instructorDetails.user.id,
          email: instructorDetails.user.email,
          name: instructorDetails.user.name ?? null,
          role: instructorDetails.user.role,
          createdAt: instructorDetails.user.createdAt,
          updatedAt: instructorDetails.user.updatedAt,
        },
      };
    } catch (error) {
      logger.error("Error finding instructor by user ID", { error, userId });
      throw new AppError(
        "Failed to find instructor",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "DATABASE_ERROR"
      );
    }
  }

  async findAllInstructors(): Promise<IInstructorWithUserDetails[]> {
    try {
      // Fetch all instructor details with their associated user data
      const instructors = await this.prisma.instructorDetails.findMany({
        include: {
          user: true, // Include user relation
        },
      });

      return instructors.map((instructor) => {
        const user = instructor.user;
        const userDetails: IUserDetails = {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        const instructorDetails: IInstructorDetails = {
          id: instructor.id,
          areaOfExpertise: instructor.areaOfExpertise,
          professionalExperience: instructor.professionalExperience,
          about: instructor.about ?? null,
          userId: instructor.userId,
          website: instructor.website ?? null,
          status: instructor.status,
        };

        return {
          instructor: instructorDetails,
          user: userDetails,
        };
      });
    } catch (error) {
      logger.error("Error fetching all instructors", { error });
      throw new AppError(
        "Failed to fetch instructors",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "DATABASE_ERROR"
      );
    }
  }
}