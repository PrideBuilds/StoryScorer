/**
 * Custom hook to reliably get storyId from URL query parameter
 *
 * WHY THIS EXISTS:
 * Next.js App Router's useSearchParams() doesn't reliably trigger re-renders
 * on client-side navigation, especially when components are already mounted.
 * This hook uses window.location as the source of truth, which always reflects
 * the current URL state.
 *
 * USAGE:
 * const storyId = useStoryIdFromUrl();
 *
 * This will always return the current storyId from ?story=xxx in the URL,
 * or null if not present.
 */

import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export function useStoryIdFromUrl(): string | null {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Helper to get storyId from URL - always use window.location as source of truth
  const getStoryIdFromUrl = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("story");
    }
    return searchParams.get("story");
  };

  // Initialize from URL on mount
  const [storyId, setStoryId] = useState<string | null>(() =>
    getStoryIdFromUrl()
  );

  // Use ref to track last known URL to detect changes
  const lastUrlRef = useRef<string>(() => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  });

  // Synchronous check on mount and when pathname/searchParams change
  // useLayoutEffect runs synchronously before paint, ensuring immediate update
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const currentUrl = window.location.href;
    const currentStoryId = getStoryIdFromUrl();

    // Check if URL actually changed
    if (currentUrl !== lastUrlRef.current) {
      lastUrlRef.current = currentUrl;
      setStoryId(currentStoryId);
    } else if (currentStoryId !== storyId) {
      // URL didn't change but storyId in state doesn't match - sync it
      setStoryId(currentStoryId);
    }
  }, [pathname, searchParams, storyId]);

  // Also listen to popstate for browser back/forward
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handlePopState = () => {
      const currentStoryId = getStoryIdFromUrl();
      setStoryId(currentStoryId);
      lastUrlRef.current = window.location.href;
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Backup check: verify URL matches state on every render
  // This is a safety net that runs after layout effect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentStoryId = getStoryIdFromUrl();
    if (currentStoryId !== storyId) {
      setStoryId(currentStoryId);
      lastUrlRef.current = window.location.href;
    }
  }, [pathname, searchParams, storyId]);

  return storyId;
}
