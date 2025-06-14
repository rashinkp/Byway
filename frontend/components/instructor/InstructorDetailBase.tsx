import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  BookOpen, 
  Users, 
  Globe, 
  GraduationCap, 
  Award, 
  Briefcase,
  Mail,
  FileText,
  Phone,
  MapPin,
  Settings,
} from "lucide-react";
import { IInstructorDetails } from "@/types/instructor";
import { Course } from "@/types/course";
import { CourseCard } from "@/components/course/CourseCard";
import Link from "next/link";

interface InstructorDetailBaseProps {
  instructor: IInstructorDetails;
  courses?: Course[];
  isCoursesLoading?: boolean;
  renderHeaderActions?: () => React.ReactNode;
  renderStatusBadges?: () => React.ReactNode;
}

export const InstructorDetailBase: React.FC<InstructorDetailBaseProps> = ({
  instructor,
  courses,
  isCoursesLoading,
  renderHeaderActions,
  renderStatusBadges,
}) => {
  const [activeTab, setActiveTab] = useState("about");

  const certifications = instructor.certifications
    ? instructor.certifications
        .split("\n")
        .map((cert) => cert.replace("- ", "").trim())
        .filter(Boolean)
    : [];
  const education = instructor.education
    ? instructor.education
        .split("\n")
        .map((edu) => edu.replace("- ", "").trim())
        .filter(Boolean)
    : [];

  const tabs = [
    {
      id: "about",
      label: "About",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "education",
      label: "Education",
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: "experience",
      label: "Experience",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: "courses",
      label: "Courses",
      icon: <BookOpen className="w-4 h-4" />,
    },
    ...(renderHeaderActions ? [{
      id: "controls",
      label: "Controls",
      icon: <Settings className="w-4 h-4" />,
    }] : []),
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">About</h3>
              <p className="text-gray-600 leading-relaxed">
                {instructor.about || "No bio available"}
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span>{instructor.email}</span>
                </div>
                {instructor.website && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Globe className="w-5 h-5" />
                    <a href={instructor.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {instructor.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case "education":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Education</h3>
            {education.length > 0 ? (
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">{edu}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No education information available</p>
            )}
          </div>
        );
      case "experience":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Area of Expertise</h4>
                <p className="text-gray-600">{instructor.areaOfExpertise}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Professional Experience</h4>
                <p className="text-gray-600 whitespace-pre-line">{instructor.professionalExperience}</p>
              </div>
            </div>
          </div>
        );
      case "courses":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
            {isCoursesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="p-4">
                    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-full mt-2 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-2/3 mt-2 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : courses && courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course: Course) => (
                  <Link key={course.id} href={`/courses/${course.id}`}>
                    <CourseCard
                      id={course.id}
                      thumbnail={course.thumbnail || ""}
                      title={course.title}
                      rating={course.rating || 0}
                      reviewCount={course.reviewCount || 0}
                      lessons={course.totalLessons || 0}
                      price={course.price || 0}
                      formattedDuration={`${course.duration || 0} hours`}
                      bestSeller={course.bestSeller || false}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No courses available</p>
            )}
          </div>
        );
      case "controls":
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Instructor Controls</h3>
            <div className="flex flex-wrap gap-2">
              {renderHeaderActions?.()}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-2xl font-bold">
                  {instructor?.name?.charAt(0) || "I"}
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">{instructor.name}</h1>
                <p className="text-gray-600">{instructor.areaOfExpertise}</p>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="outline"
                    className="capitalize bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined {new Date(instructor.createdAt).toLocaleDateString()}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    <BookOpen className="w-3 h-3 mr-1" />
                    {courses?.length || 0} Courses
                  </Badge>
                  <Badge 
                    variant="outline"
                    className="bg-purple-50 text-purple-700 border-purple-200"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {instructor.totalStudents || 0} Students
                  </Badge>
                  {renderStatusBadges?.()}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {instructor.website && (
                <Badge 
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Globe className="w-3 h-3 mr-1" />
                  <a
                    href={instructor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Visit Website
                  </a>
                </Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Main Content Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          {/* Tabs Section */}
          <div className="border-b border-gray-100">
            <div className="flex space-x-8 px-6 py-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {renderTabContent()}
          </div>
        </Card>
      </div>
    </div>
  );
}; 