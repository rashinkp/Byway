export interface ICourse {
  id: string;
  title: string;
  description?: string | null;
  level: "BEGINNER" | "MEDIUM" | "ADVANCED";
  price?: number | null;
  thumbnail?: string | null;
  duration?: number | null;
  offer?: number | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  details?: ICourseDetails | null;
}

export interface ICourseDetails {
  id: string;
  courseId: string;
  prerequisites?: string | null;
  longDescription?: string | null;
  objectives?: string | null;
  targetAudience?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCourseInput {
  title: string;
  description?: string | null;
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED";
  price?: number | null;
  thumbnail?: string | null;
  duration?: number | null;
  offer?: number | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: string;
  createdBy: string;
  details?: {
    prerequisites?: string | null;
    longDescription?: string | null;
    objectives?: string | null;
    targetAudience?: string | null;
  } | null;
}

export interface IUpdateCourseInput {
  id: string;
  title?: string;
  description?: string | null;
  level?: "BEGINNER" | "MEDIUM" | "ADVANCED";
  price?: number | null;
  thumbnail?: string | null;
  duration?: number | null;
  offer?: number | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId?: string;
  createdBy: string;
  details?: {
    prerequisites?: string | null;
    longDescription?: string | null;
    objectives?: string | null;
    targetAudience?: string | null;
  } | null;
}

export interface IGetAllCoursesInput {
  page?: number;
  limit?: number;
  sortBy?: "title" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
}

export interface ICreateEnrollmentInput {
  userId: string;
  courseId: string;
}

export interface IEnrollment {
  userId: string;
  courseId: string;
  enrolledAt: Date;
}

export interface ICourseRepository {
  createCourse(input: ICreateCourseInput): Promise<ICourse>;
  getAllCourses(
    input: IGetAllCoursesInput
  ): Promise<{ courses: ICourse[]; total: number }>;
  getCourseById(id: string): Promise<ICourse | null>;
  getCourseByName(title: string): Promise<ICourse | null>;
  updateCourse(input: IUpdateCourseInput): Promise<ICourse>;
  softDeleteCourse(id: string): Promise<ICourse>;
  createEnrollment(input: ICreateEnrollmentInput): Promise<IEnrollment>;
  getEnrollment(userId: string, courseId: string): Promise<IEnrollment | null>;
}
