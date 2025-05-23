// File: components/course/CourseContent.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ILesson } from "@/types/lesson";
import { useGetAllLessonsInCourse } from "@/hooks/lesson/useGetAllLesson";
import { useGetContentByLessonId } from "@/hooks/content/useGetContentByLessonId";
import { LessonNavigation } from "@/components/course/enrolledCourse/EnrolledCourseLessonNavigation";
import { LessonContent } from "@/components/course/enrolledCourse/EnrolledLessonContent";
import { EnrolledCourseSidebar } from "@/components/course/enrolledCourse/EnrolledCourseSideBar";

interface LessonWithCompletion extends ILesson {
  completed: boolean;
}

export default function CourseContent() {
  const [selectedLesson, setSelectedLesson] =
    useState<LessonWithCompletion | null>(null);
  const [lessonsWithCompletion, setLessonsWithCompletion] = useState<
    LessonWithCompletion[]
  >([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  const params = useParams();
  const courseId = params.courseId as string;

  // Fetch lessons
  const { data, isLoading, isError, error } = useGetAllLessonsInCourse({
    courseId,
    page,
    limit,
    sortBy: "order",
    sortOrder: "asc",
    filterBy: "PUBLISHED",
    includeDeleted: false,
  });

  // Fetch content for the selected lesson
  const {
    data: content,
    isLoading: isContentLoading,
    isError: isContentError,
    error: contentError,
  } = useGetContentByLessonId(selectedLesson?.id || "");

  // Initialize lessons with completion status
  useEffect(() => {
    if (data?.lessons) {
      const initializedLessons: LessonWithCompletion[] = data.lessons.map(
        (lesson) => ({
          ...lesson,
          completed: false,
        })
      );
      setLessonsWithCompletion(initializedLessons);
      if (initializedLessons.length > 0) {
        setSelectedLesson(initializedLessons[0]);
      } else {
        setSelectedLesson(null);
      }
    }
  }, [data]);

  const allLessons = lessonsWithCompletion;
  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.id === selectedLesson?.id
  );

  const handleLessonSelect = (lesson: LessonWithCompletion) => {
    setSelectedLesson(lesson);
  };

  const markLessonComplete = () => {
    // Implementation remains commented as in original
  };

  const goToNextLesson = () => {
    if (
      currentLessonIndex < allLessons.length - 1 &&
      selectedLesson?.completed
    ) {
      setSelectedLesson(allLessons[currentLessonIndex + 1]);
    }
  };

  const goToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      setSelectedLesson(allLessons[currentLessonIndex - 1]);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToNextPage = () => {
    if (data && page < data.totalPages) {
      setPage(page + 1);
    }
  };

  const completedLessons = allLessons.filter(
    (lesson) => lesson.completed
  ).length;
  const progressPercentage =
    allLessons.length > 0 ? (completedLessons / allLessons.length) * 100 : 0;

  return (
    <div className="flex flex-col lg:flex-row w-full bg-gray-100 min-h-screen">
      <EnrolledCourseSidebar
        courseTitle="Introduction to User Experience Design"
        progressPercentage={progressPercentage}
        isLoading={isLoading}
        isError={isError}
        error={error}
        allLessons={allLessons}
        selectedLesson={selectedLesson}
        handleLessonSelect={handleLessonSelect}
        data={data}
        page={page}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
      />
      <div className="flex-1 p-6 lg:p-10">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-600 text-lg">Error: {error?.message}</p>
          </div>
        ) : selectedLesson ? (
          <div className="max-w-4xl mx-auto">
            <LessonContent
              selectedLesson={selectedLesson}
              content={content}
              isContentLoading={isContentLoading}
              isContentError={isContentError}
              contentError={contentError}
              currentLessonIndex={currentLessonIndex}
              allLessons={allLessons}
              goToPrevLesson={goToPrevLesson}
              goToNextLesson={goToNextLesson}
              markLessonComplete={markLessonComplete}
            />
            <LessonNavigation
              currentLessonIndex={currentLessonIndex}
              allLessons={allLessons}
              selectedLesson={selectedLesson}
              goToPrevLesson={goToPrevLesson}
              goToNextLesson={goToNextLesson}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">Select a lesson to begin</p>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        video::-webkit-media-controls-panel {
          background-color: rgba(0, 0, 0, 0.7);
        }
        video::-webkit-media-controls-play-button,
        video::-webkit-media-controls-volume-slider,
        video::-webkit-media-controls-mute-button,
        video::-webkit-media-controls-timeline,
        video::-webkit-media-controls-current-time-display {
          filter: brightness(1.2);
        }
      `}</style>
    </div>
  );
}


