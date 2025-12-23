"use client";

/**
 * Analyzer Page - Simple Wrapper
 *
 * ⚠️ PERMANENT FIX FOR VIEW BUTTON - DO NOT MODIFY WITHOUT TESTING ⚠️
 *
 * This is a minimal wrapper. AnalyzerContent reads directly from window.location
 * to ensure it always has the current storyId from the URL.
 */
import { AnalyzerContent } from "./AnalyzerContent";

export default function AnalyzerPage() {
  // Log immediately - before any hooks or logic
  if (typeof window !== "undefined") {
    console.log("[AnalyzerPage] RENDERING - Wrapper component");
    console.log("[AnalyzerPage] Current URL:", window.location.href);
    console.log("[AnalyzerPage] Search params:", window.location.search);
  } else {
    console.log("[AnalyzerPage] RENDERING - SSR (server-side)");
  }

  // AnalyzerContent is self-contained and reads from URL directly
  // No props needed - it will always read the current URL state
  return (
    <>
      {typeof window !== "undefined" && (
        <div style={{ display: "none" }} data-testid="analyzer-page-loaded">
          Analyzer Page Loaded
        </div>
      )}
      <AnalyzerContent />
    </>
  );
}
