import { v4 as uuidv4 } from "uuid";
import { LessonOrder } from "../value-object/lesson-order";
import { LessonStatus } from "../enum/lesson.enum";
import { LessonContent } from "./lesson-content.entity";
import { ILessonContentInputDTO } from "../dtos/lesson/lesson.dto";

export interface LessonProps {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  order: LessonOrder;
  status: LessonStatus;
  content?: LessonContent | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export class Lesson {
  private readonly _id: string;
  private _courseId: string;
  private _title: string;
  private _description: string | null;
  private _order: LessonOrder;
  private _status: LessonStatus;
  private _content: LessonContent | null;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  private constructor(props: LessonProps) {
    this._id = props.id;
    this._courseId = props.courseId;
    this._title = props.title;
    this._description = props.description ?? null;
    this._order = props.order;
    this._status = props.status;
    this._content = props.content ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._deletedAt = props.deletedAt ?? null;
  }

  static create(dto: {
    courseId: string;
    title: string;
    description?: string | null;
    order: number;
    status?: LessonStatus;
    content?: ILessonContentInputDTO | null;
  }): Lesson {
    if (!dto.courseId) {
      throw new Error("Course ID is required");
    }
    if (!dto.title || dto.title.trim() === "") {
      throw new Error("Lesson title cannot be empty");
    }

    const content = dto.content
      ? LessonContent.fromPersistence({
          id: dto.content.id || uuidv4(), // Generate ID if not provided
          lessonId: dto.content.lessonId,
          type: dto.content.type,
          status: dto.content.status,
          title: dto.content.title ?? null,
          description: dto.content.description ?? null,
          fileUrl: dto.content.fileUrl ?? null,
          thumbnailUrl: dto.content.thumbnailUrl ?? null,
          quizQuestions: dto.content.quizQuestions ?? null,
          createdAt: dto.content.createdAt
            ? new Date(dto.content.createdAt)
            : new Date(),
          updatedAt: dto.content.updatedAt
            ? new Date(dto.content.updatedAt)
            : new Date(),
          deletedAt: dto.content.deletedAt
            ? new Date(dto.content.deletedAt)
            : null,
        })
      : null;

    return new Lesson({
      id: uuidv4(),
      courseId: dto.courseId,
      title: dto.title.trim(),
      description: dto.description?.trim() ?? null,
      order: new LessonOrder(dto.order),
      status: dto.status || LessonStatus.DRAFT,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });
  }

  static update(
    existingLesson: Lesson,
    dto: {
      title?: string;
      description?: string | null;
      order?: number;
      status?: LessonStatus;
      content?: ILessonContentInputDTO | null | undefined;
    }
  ): Lesson {
    const props: LessonProps = {
      ...existingLesson.getProps(),
      updatedAt: new Date(),
    };

    if (dto.title && dto.title.trim() !== "") {
      props.title = dto.title.trim();
    }
    if (dto.description !== undefined) {
      props.description = dto.description?.trim() ?? null;
    }
    if (dto.order !== undefined) {
      props.order = new LessonOrder(dto.order);
    }
    if (dto.status) {
      props.status = dto.status;
    }
    if (dto.content !== undefined) {
      props.content = dto.content
        ? LessonContent.fromPersistence({
            id: dto.content.id || existingLesson.content?.id || uuidv4(),
            lessonId: dto.content.lessonId,
            type: dto.content.type,
            status: dto.content.status,
            title: dto.content.title ?? null,
            description: dto.content.description ?? null,
            fileUrl: dto.content.fileUrl ?? null,
            thumbnailUrl: dto.content.thumbnailUrl ?? null,
            quizQuestions: dto.content.quizQuestions ?? null,
            createdAt: dto.content.createdAt
              ? new Date(dto.content.createdAt)
              : existingLesson.content?.createdAt || new Date(),
            updatedAt: dto.content.updatedAt
              ? new Date(dto.content.updatedAt)
              : new Date(),
            deletedAt: dto.content.deletedAt
              ? new Date(dto.content.deletedAt)
              : existingLesson.content?.deletedAt || null,
          })
        : null;
    }

    return new Lesson(props);
  }

  static fromPersistence(data: {
    id: string;
    courseId: string;
    title: string;
    description?: string | null;
    order: number;
    status: LessonStatus;
    content?: LessonContent | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
  }): Lesson {
    return new Lesson({
      id: data.id,
      courseId: data.courseId,
      title: data.title,
      description: data.description ?? null,
      order: new LessonOrder(data.order),
      status: data.status,
      content: data.content ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      deletedAt: data.deletedAt ?? null,
    });
  }

  softDelete(): void {
    if (this._deletedAt) {
      throw new Error("Lesson is already deleted");
    }
    this._deletedAt = new Date();
    this._updatedAt = new Date();
  }

  recover(): void {
    if (!this._deletedAt) {
      throw new Error("Lesson is not deleted");
    }
    this._deletedAt = null;
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get courseId(): string {
    return this._courseId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string | null {
    return this._description;
  }

  get order(): number {
    return this._order.value;
  }

  get status(): LessonStatus {
    return this._status;
  }

  get content(): LessonContent | null {
    return this._content;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  private getProps(): LessonProps {
    return {
      id: this._id,
      courseId: this._courseId,
      title: this._title,
      description: this._description,
      order: this._order,
      status: this._status,
      content: this._content,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }

  isActive(): boolean {
    return !this._deletedAt;
  }

  toJSON(): any {
    return {
      id: this._id,
      courseId: this._courseId,
      title: this._title,
      description: this._description,
      order: this._order.value,
      status: this._status,
      content: this._content?.toJSON() ?? null,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      deletedAt: this._deletedAt?.toISOString() ?? null,
    };
  }
}
