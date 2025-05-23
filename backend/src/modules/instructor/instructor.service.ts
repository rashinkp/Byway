import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { JwtUtil } from "../../utils/jwt.util";
import { logger } from "../../utils/logger";
import {
  createInstructorSchema,
  updateInstructorStatusSchema,
} from "./instructor.validators";
import {
  CreateInstructorInput,
  InstructorWithToken,
  IInstructorDetails,
  UpdateInstructorStatusInput,
  IInstructorWithUserDetails,
} from "./instructor.types";
import { UserService } from "../user/user.service";
import { Role, APPROVALSTATUS } from "@prisma/client";
import { IInstructorRepository } from "./instructor.repository.interface";

export class InstructorService {
  constructor(
    private instructorRepository: IInstructorRepository,
    private jwtSecret: string,
    private userService: UserService
  ) {
    if (!jwtSecret) {
      logger.error("JWT_SECRET not configured");
      throw new AppError(
        "JWT_SECRET not configured",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIG_ERROR"
      );
    }
  }

  async createInstructor(
    input: CreateInstructorInput
  ): Promise<InstructorWithToken> {
    const parsedInput = createInstructorSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for createInstructor", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { areaOfExpertise, professionalExperience, about, userId, website } =
      parsedInput.data;

    const user = await this.userService.findUserById(userId);
    if (!user) {
      logger.warn("User not found for instructor creation", { userId });
      throw new AppError("User not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
    }

    try {
      const instructorDetails =
        await this.instructorRepository.createInstructor({
          areaOfExpertise,
          professionalExperience,
          about,
          userId,
          website,
        });

      const instructor = {
        ...instructorDetails,
        email: user.email,
        role: user.role, // Keep the original user role
      };

      const newToken = JwtUtil.generateToken(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        this.jwtSecret
      );

      return { ...instructor, newToken };
    } catch (error) {
      logger.error("Error creating instructor", { error, input });
      console.log(error);
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to create instructor",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async approveInstructor(
    input: UpdateInstructorStatusInput
  ): Promise<IInstructorDetails> {
    const parsedInput = updateInstructorStatusSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for approveInstructor", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { instructorId } = parsedInput.data as { instructorId: string };
    const instructor = await this.instructorRepository.findInstructorById(
      instructorId
    );
    if (!instructor) {
      logger.warn("Instructor not found", { instructorId });
      throw new AppError(
        "Instructor not found",
        StatusCodes.NOT_FOUND,
        "NOT_FOUND"
      );
    }

    if (instructor.status === APPROVALSTATUS.APPROVED) {
      logger.warn("Instructor already approved", { instructorId });
      throw new AppError(
        "Instructor already approved",
        StatusCodes.BAD_REQUEST,
        "ALREADY_APPROVED"
      );
    }

    try {
      // Update instructor status to APPROVED
      const updatedInstructor =
        await this.instructorRepository.updateInstructorStatus({
          instructorId,
          status: APPROVALSTATUS.APPROVED,
        });

      // Update user role to INSTRUCTOR
      await this.userService.updateUserRole(instructor.userId, Role.INSTRUCTOR);

      return updatedInstructor;
    } catch (error) {
      logger.error("Error approving instructor", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to approve instructor",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async declineInstructor(
    input: UpdateInstructorStatusInput
  ): Promise<IInstructorDetails> {
    const parsedInput = updateInstructorStatusSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for declineInstructor", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { instructorId } = parsedInput.data as { instructorId: string };
    const instructor = await this.instructorRepository.findInstructorById(
      instructorId
    );
    if (!instructor) {
      logger.warn("Instructor not found", { instructorId });
      throw new AppError(
        "Instructor not found",
        StatusCodes.NOT_FOUND,
        "NOT_FOUND"
      );
    }

    if (instructor.status === APPROVALSTATUS.DECLINED) {
      logger.warn("Instructor already declined", { instructorId });
      throw new AppError(
        "Instructor already declined",
        StatusCodes.BAD_REQUEST,
        "ALREADY_DECLINED"
      );
    }

    return this.instructorRepository.updateInstructorStatus({
      instructorId,
      status: APPROVALSTATUS.DECLINED,
    });
  }

  async getAllInstructors(): Promise<IInstructorWithUserDetails[]> {
    try {
      return await this.instructorRepository.findAllInstructors();
    } catch (error) {
      logger.error("Error fetching all instructors", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to fetch instructors",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getInstructorByUserId(
    userId: string
  ): Promise<IInstructorWithUserDetails | null> {
    try {
      const instructor = await this.instructorRepository.findInstructorByUserId(
        userId
      );
      if (!instructor) {
        logger.warn("Instructor not found for user", { userId });
        return null;
      }
      return instructor;
    } catch (error) {
      logger.error("Error fetching instructor by user ID", { error, userId });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to fetch instructor",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}