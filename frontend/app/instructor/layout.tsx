"use client";
import CommonLayout from "@/components/common/layout/CommonLayout";
import { INSTRUCTOR_NAV_ITEMS } from "@/types/nav";
import { ReactNode } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface InstructorLayoutProps {
  children: ReactNode;
}

export default function InstructorLayout({ children }: InstructorLayoutProps) {
  return (
    <CommonLayout
      sidebarHeaderTitle="Instructor Panel"
      sidebarHeaderSubtitle="Teaching Console"
      navItems={INSTRUCTOR_NAV_ITEMS}
      role="INSTRUCTOR"
      isCollapsible={true}
      skeleton={<LoadingSpinner />}
    >
      {children}
    </CommonLayout>
  );
}
