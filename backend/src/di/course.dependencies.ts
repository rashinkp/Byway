import { CourseController } from "../presentation/http/controllers/course.controller";
import { CreateCourseUseCase } from "../app/usecases/course/implementations/create-course.usecase";
import { GetAllCoursesUseCase } from "../app/usecases/course/implementations/get-all-courses.usecase";
import { GetCourseByIdUseCase } from "../app/usecases/course/implementations/get-course-by-Id.usecase";
import { UpdateCourseUseCase } from "../app/usecases/course/implementations/update-course.usecase";
import { DeleteCourseUseCase } from "../app/usecases/course/implementations/delete-course.usecase";
import { GetEnrolledCoursesUseCase } from "../app/usecases/course/implementations/get-enrolled-courses.usecases";
import { ApproveCourseUseCase } from "../app/usecases/course/implementations/approve-course.usecase";
import { DeclineCourseUseCase } from "../app/usecases/course/implementations/decline-course.usecase";
import { EnrollCourseUseCase } from "../app/usecases/course/implementations/enroll-course.usecase";
import { SharedDependencies } from "./shared.dependencies";

export interface CourseDependencies {
  courseController: CourseController;
}

export function createCourseDependencies(
  deps: SharedDependencies
): CourseDependencies {
  const {
    courseRepository,
    categoryRepository,
    userRepository,
    enrollmentRepository,
  } = deps;

  const createCourseUseCase = new CreateCourseUseCase(
    courseRepository,
    categoryRepository,
    userRepository
  );
  const getAllCoursesUseCase = new GetAllCoursesUseCase(courseRepository);
  const getCourseByIdUseCase = new GetCourseByIdUseCase(
    courseRepository,
    enrollmentRepository
  );
  const updateCourseUseCase = new UpdateCourseUseCase(
    courseRepository,
  );
  const deleteCourseUseCase = new DeleteCourseUseCase(courseRepository);
  const getEnrolledCoursesUseCase = new GetEnrolledCoursesUseCase(
    courseRepository,
    userRepository
  );
  const approveCourseUseCase = new ApproveCourseUseCase(courseRepository);
  const declineCourseUseCase = new DeclineCourseUseCase(courseRepository);
  const enrollCourseUseCase = new EnrollCourseUseCase(
    courseRepository,
    enrollmentRepository,
    userRepository
  );

  const courseController = new CourseController(
    createCourseUseCase,
    getAllCoursesUseCase,
    getCourseByIdUseCase,
    updateCourseUseCase,
    deleteCourseUseCase,
    getEnrolledCoursesUseCase,
    approveCourseUseCase,
    declineCourseUseCase,
    enrollCourseUseCase,
    deps.httpErrors,
    deps.httpSuccess,
  );

  return {
    courseController,
  };
}
