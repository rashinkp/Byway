"use client";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Course } from "@/types/course"; // Ensure Course type includes isEnrolled
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface CourseSidebarProps {
  course: Course | undefined;
  isLoading: boolean;
  handleAddToCart: () => void;
  isCartLoading: boolean;
}

export default function CourseSidebar({
  course,
  isLoading,
  handleAddToCart,
  isCartLoading,
}: CourseSidebarProps) {
  const router = useRouter();

  const handleLearnNow = () => {
    if (course?.id) {
      router.push(`/user/my-courses/${course.id}`);
    }
  };

  const formatPrice = (price: number | string | null | undefined) => {
    if (!price) return "Free";
    const numPrice = typeof price === 'number' ? price : Number(price);
    return `$${numPrice.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="py-4">
        <LoadingSpinner size="sm" text="Loading course details..." />
      </div>
    );
  }

  return (
    <div className="sticky top-4">
      <div className="aspect-w-16 aspect-h-10 relative">
        <img
          src={course?.thumbnail || "/placeholder-image.jpg"} 
          alt="Course Preview"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {course?.offer
                ? formatPrice(course.offer)
                : formatPrice(course?.price)}
            </span>
            {course?.offer && course?.price && (
              <span className="ml-2 text-gray-500 line-through">
                {formatPrice(course.price)}
              </span>
            )}
          </div>
        </div>
        {course?.isEnrolled ? (
          <button
            onClick={handleLearnNow}
            disabled={isCartLoading}
            className={`w-full bg-green-600 rounded-lg text-white font-medium py-3 mb-2 transition ${
              isCartLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-700"
            }`}
            aria-label="Learn Now"
          >
            Learn Now
          </button>
        ) : (
          <>
            <button
              onClick={handleAddToCart}
              disabled={isCartLoading}
              className={`w-full bg-blue-600 rounded-lg text-white font-medium py-3 mb-2 transition ${
                isCartLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-blue-700"
              }`}
              aria-label="Add to Cart"
            >
              {isCartLoading ? "Adding..." : "Add to Cart"}
            </button>
            {course ? (
              <Link
                href={`/user/checkout?courseId=${course.id}`}
                className={`w-full border rounded-lg border-gray-300 text-gray-800 font-medium py-3 transition block text-center ${
                  isCartLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
                aria-label="Enroll Now"
              >
                Enroll Now
              </Link>
            ) : (
              <Link
                href={`/login`}
                className={`w-full border rounded-lg border-gray-300 text-gray-800 font-medium py-3 transition block text-center ${
                  isCartLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
                aria-label="Enroll Now"
              >
                Enroll Now
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
