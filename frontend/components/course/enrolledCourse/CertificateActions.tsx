import React, { useState, useMemo, useEffect } from "react";
import { useCertificate } from "@/hooks/certificate/useCertificate";

export function CertificateActions({ courseId }: { courseId: string }) {
  const { certificate, loading: certLoading, fetchCertificate, createCertificate } = useCertificate(courseId);
  const [regenError, setRegenError] = useState<string | null>(null);

  // Fetch certificate on mount
  useEffect(() => {
    fetchCertificate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  // Helper to calculate remaining days for regeneration
  const getRemainingDays = (updatedAt: string) => {
    const lastUpdate = new Date(updatedAt);
    const now = new Date();
    const daysSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(30 - daysSinceUpdate));
  };

  // Memoized remaining days and eligibility
  const { canRegenerate, remainingDays } = useMemo(() => {
    if (certificate?.updatedAt) {
      const days = getRemainingDays(certificate.updatedAt);
      return { canRegenerate: days <= 0, remainingDays: days };
    }
    return { canRegenerate: true, remainingDays: 0 };
  }, [certificate?.updatedAt]);

  return (
    <div className="max-w-3xl mx-auto relative animate-fade-in">
      {/* Celebration Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full mb-4">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-2">
          Congratulations!
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-300">You've successfully completed the course</p>
      </div>

      {/* Certificate Actions Only */}
      <div className="flex flex-col items-center gap-4">
        {certificate?.pdfUrl && (
          <a
            href={certificate.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-yellow-400 dark:bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2 text-lg">📄</span>
            View & Download Certificate
          </a>
        )}
        <button
          onClick={async () => {
            setRegenError(null);
            try {
              await createCertificate();
              await fetchCertificate();
            } catch (err: any) {
              setRegenError(err?.message || "Failed to regenerate certificate");
            }
          }}
          disabled={certLoading || !canRegenerate}
          className={`inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold transition-colors duration-200 ${certLoading || !canRegenerate ? "bg-gray-400 text-white dark:bg-gray-700 dark:text-gray-300" : "bg-yellow-400 dark:bg-yellow-500 text-black hover:bg-yellow-500 dark:hover:bg-yellow-600"}`}
        >
          {certLoading ? (
            <span className="flex items-center justify-center w-full">
              <svg className="animate-spin h-5 w-5 mr-2 text-white dark:text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              Regenerating...
            </span>
          ) : regenError ? (
            <span className="text-red-600 dark:text-red-400">{regenError}</span>
          ) : (
            "Regenerate Certificate"
          )}
        </button>
        {!canRegenerate && remainingDays > 0 && (
          <div className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            You can regenerate your certificate in <b>{remainingDays} day{remainingDays > 1 ? "s" : ""}</b>.
          </div>
        )}
      </div>
    </div>
  );
} 