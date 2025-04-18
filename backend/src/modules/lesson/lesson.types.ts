export interface ILesson {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  thumbnail?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateLessonInput {
  courseId: string;
  title: string;
  description?: string | null;
  order: number;
  thumbnail?: string | null;
}

export interface IUserLessonProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateLessonProgressInput {
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
}

export interface IGetProgressInput {
  userId: string;
  courseId: string;
}

export enum ContentType {
  VIDEO = "VIDEO",
  DOCUMENT = "DOCUMENT",
  QUIZ = "QUIZ",
}

export enum ContentStatus {
  DRAFT = "DRAFT",
  PROCESSING = "PROCESSING",
  PUBLISHED = "PUBLISHED",
}

export interface ILessonContent {
  id: string;
  lessonId: string;
  type: ContentType;
  status: ContentStatus;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateLessonContentInput {
  lessonId: string;
  type: ContentType;
  status?: ContentStatus;
  data: Record<string, any>;
}

export interface ILessonRepository {
  createLesson(input: ICreateLessonInput): Promise<ILesson>;
  getLessonById(id: string): Promise<ILesson | null>;
  getLessonsByCourseId(courseId: string): Promise<ILesson[]>;
  updateLessonProgress(
    input: IUpdateLessonProgressInput
  ): Promise<IUserLessonProgress>;
  getCourseProgress(input: IGetProgressInput): Promise<IUserLessonProgress[]>;
}
