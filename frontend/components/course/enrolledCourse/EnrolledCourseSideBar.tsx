import { ILesson } from "@/types/lesson";
import { ChevronLeft, ChevronRight, Lock, CheckCircle } from "lucide-react";
import { LessonList } from "./EnrolledCourseLessonList";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
  isLocked?: boolean;
  score?: number;
}

interface CourseSidebarProps {
  courseTitle: string;
  progressPercentage: number;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  allLessons: LessonWithCompletion[];
  selectedLesson: LessonWithCompletion | null;
  handleLessonSelect: (lesson: LessonWithCompletion) => void;
  data: any; // Replace with proper type from your hook
  page: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
}

export function EnrolledCourseSidebar({
  courseTitle,
  progressPercentage,
  isLoading,
  isError,
  error,
  allLessons,
  selectedLesson,
  handleLessonSelect,
  data,
  page,
  goToPreviousPage,
  goToNextPage,
}: CourseSidebarProps) {
  return (
    <div className="lg:w-80 bg-white shadow-lg lg:min-h-screen p-6 overflow-y-auto transition-all">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">{courseTitle}</h2>
        <div className="mt-4">
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {progressPercentage.toFixed(0)}% complete
          </p>
        </div>
      </div>
      <LessonList
        isLoading={isLoading}
        isError={isError}
        error={error}
        allLessons={allLessons.map(lesson => ({
          ...lesson,
          isLocked: lesson.isLocked
        }))}
        selectedLesson={selectedLesson}
        handleLessonSelect={handleLessonSelect}
      >
        {lesson => (
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-gray-600 truncate">
              {lesson.title}
            </span>
            {lesson.completed && (
              <div className="flex items-center gap-2">
                {lesson.score !== undefined && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                    {lesson.score}%
                  </span>
                )}
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              </div>
            )}
          </div>
        )}
      </LessonList>
      {data && data.totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            onClick={goToPreviousPage}
            disabled={page === 1}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm text-gray-600">
            Page {data.page} of {data.totalPages}
          </span>
          <button
            className="px-3 py-1 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            onClick={goToNextPage}
            disabled={page === data.totalPages}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
