"use client";

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { storyInputSchema, type StoryInput } from "@/lib/validations/story";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Sparkles, X } from "lucide-react";
import type { INVESTAnalysisResult } from "@/types/database";
import type { UserStory } from "@/types/database";
import { AnalysisResults } from "@/components/feature/AnalysisResults";

const MAX_STORY_LENGTH = 5000;
const MAX_ACCEPTANCE_CRITERIA_LENGTH = 2000;

export function AnalyzerContent() {
  // Log immediately - before any hooks
  if (typeof window !== 'undefined') {
    console.log('[AnalyzerContent] COMPONENT RENDERING - Mount/Remount');
    console.log('[AnalyzerContent] Current URL:', window.location.href);
    console.log('[AnalyzerContent] Search params:', window.location.search);
  }
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Read storyId directly from URL - this is the source of truth
  const getStoryIdFromUrl = (): string | null => {
    if (typeof window !== 'undefined') {
      const storyId = new URLSearchParams(window.location.search).get('story');
      console.log('[AnalyzerContent] getStoryIdFromUrl - window.location.search:', window.location.search, 'storyId:', storyId);
      return storyId;
    }
    const storyId = searchParams.get('story');
    console.log('[AnalyzerContent] getStoryIdFromUrl - SSR fallback, storyId:', storyId);
    return storyId;
  };
  
  const [storyId, setStoryId] = useState<string | null>(() => {
    const id = getStoryIdFromUrl();
    console.log('[AnalyzerContent] useState initializer - storyId:', id);
    return id;
  });
  
  console.log('[AnalyzerContent] RENDER - Current storyId state:', storyId, 'Pathname:', pathname);
  
  // IMMEDIATE CHECK: If we have a storyId in URL but state is null, fix it immediately
  if (typeof window !== 'undefined') {
    const urlStoryId = new URLSearchParams(window.location.search).get('story');
    if (urlStoryId && urlStoryId !== storyId) {
      console.log('[AnalyzerContent] RENDER-TIME FIX: URL has storyId but state is null/mismatch. URL:', urlStoryId, 'State:', storyId);
      // Use queueMicrotask to update state after render
      queueMicrotask(() => {
        console.log('[AnalyzerContent] queueMicrotask - Setting storyId from URL:', urlStoryId);
        setStoryId(urlStoryId);
      });
    }
  }
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingStory, setIsLoadingStory] = useState(false);
  const [analysisResult, setAnalysisResult] =
    useState<INVESTAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  
  // Track the last loaded storyId to prevent duplicate API calls
  const lastLoadedStoryIdRef = useRef<string | null>(null);
  const isLoadingRef = useRef<boolean>(false);
  const lastUrlRef = useRef<string>(
    typeof window !== 'undefined' ? window.location.href : ''
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<StoryInput>({
    resolver: zodResolver(storyInputSchema),
    defaultValues: {
      tags: [],
    },
  });

  const loadStory = useCallback(async (id: string) => {
    if (!id) {
      console.log('[AnalyzerContent] loadStory called with no ID');
      setIsLoadingStory(false);
      isLoadingRef.current = false;
      return;
    }

    console.log('[AnalyzerContent] loadStory called for:', id, 'Currently loading:', isLoadingRef.current, 'Last loaded:', lastLoadedStoryIdRef.current);

    // Prevent concurrent loads of the same story
    if (isLoadingRef.current && lastLoadedStoryIdRef.current === id) {
      console.log('[AnalyzerContent] Already loading this story, skipping');
      return;
    }

    console.log('[AnalyzerContent] Starting to load story:', id);
    isLoadingRef.current = true;
    setIsLoadingStory(true);
    setError(null);
    // Clear any existing analysis result while loading
    setAnalysisResult(null);

    try {
      console.log('[AnalyzerContent] Fetching story from API:', `/api/stories/${id}`);
      const response = await fetch(`/api/stories/${id}`, {
        credentials: 'include', // Ensure cookies are sent
      });
      console.log('[AnalyzerContent] API response status:', response.status);
      
      if (response.status === 401) {
        // Unauthorized - redirect to login
        router.push('/login');
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to load story");
      }

      if (!result.data) {
        throw new Error("Story not found");
      }

      const story: UserStory = result.data;

      // Populate form with story data (in case user wants to edit)
      setValue("title", story.title);
      setValue("storyText", story.story_text);
      setValue("acceptanceCriteria", story.acceptance_criteria || "");
      
      // Set tags if they exist
      if (story.tags && Array.isArray(story.tags)) {
        setTags(story.tags);
      }

      // If analysis result exists, parse and show it
      if (story.analysis_result) {
        // Handle case where analysis_result might be a string (JSON) or already parsed
        let analysis: INVESTAnalysisResult;
        if (typeof story.analysis_result === 'string') {
          try {
            analysis = JSON.parse(story.analysis_result);
          } catch (parseError) {
            console.error("Failed to parse analysis_result:", parseError);
            setError("Failed to load analysis results. The data may be corrupted.");
            setIsLoadingStory(false);
            return;
          }
        } else {
          analysis = story.analysis_result as unknown as INVESTAnalysisResult;
        }
        setAnalysisResult(analysis);
        // Mark this story as loaded
        lastLoadedStoryIdRef.current = id;
      } else {
        // If no analysis result, show informational message (not an error)
        // The form will be shown with pre-filled data, allowing user to analyze
        setError(null);
        // Still mark as loaded even without analysis result
        lastLoadedStoryIdRef.current = id;
      }
    } catch (err) {
      console.error("Error loading story:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load story"
      );
      // Don't show form if there's an error loading
      setAnalysisResult(null);
      // Don't mark as loaded if there was an error - allow retry
      lastLoadedStoryIdRef.current = null;
    } finally {
      setIsLoadingStory(false);
      isLoadingRef.current = false;
    }
  }, [setValue, router]);

  // CRITICAL: Monitor URL changes using multiple methods
  // 1. useLayoutEffect for immediate synchronous check
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    
    const currentUrl = window.location.href;
    const currentStoryId = getStoryIdFromUrl();
    
    console.log('[AnalyzerContent] useLayoutEffect - URL:', currentUrl, 'storyId:', currentStoryId, 'Last loaded:', lastLoadedStoryIdRef.current);
    
    // If URL changed, update storyId
    if (currentUrl !== lastUrlRef.current) {
      console.log('[AnalyzerContent] URL changed detected in useLayoutEffect');
      lastUrlRef.current = currentUrl;
      setStoryId(currentStoryId);
    } else if (currentStoryId !== storyId) {
      // URL didn't change but storyId mismatch - sync it
      console.log('[AnalyzerContent] StoryId mismatch, syncing');
      setStoryId(currentStoryId);
    }
  }, [pathname, searchParams, storyId]);
  
  // 2. Poll URL every 50ms as backup (very aggressive)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkUrl = () => {
      const currentStoryId = getStoryIdFromUrl();
      const currentUrl = window.location.href;
      
      if (currentUrl !== lastUrlRef.current || currentStoryId !== storyId) {
        console.log('[AnalyzerContent] Poll detected change - storyId:', currentStoryId, 'URL:', currentUrl);
        lastUrlRef.current = currentUrl;
        setStoryId(currentStoryId);
      }
    };
    
    // Check immediately
    checkUrl();
    
    // Poll every 50ms
    const interval = setInterval(checkUrl, 50);
    
    return () => clearInterval(interval);
  }, [storyId]);
  
  // 3. Listen to popstate for browser back/forward
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handlePopState = () => {
      const currentStoryId = getStoryIdFromUrl();
      console.log('[AnalyzerContent] popstate event - storyId:', currentStoryId);
      lastUrlRef.current = window.location.href;
      setStoryId(currentStoryId);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  // 4. Load story when storyId changes - CRITICAL EFFECT
  useEffect(() => {
    console.log('[AnalyzerContent] useEffect [storyId] TRIGGERED');
    console.log('[AnalyzerContent] - storyId:', storyId);
    console.log('[AnalyzerContent] - lastLoadedStoryIdRef.current:', lastLoadedStoryIdRef.current);
    console.log('[AnalyzerContent] - isLoadingRef.current:', isLoadingRef.current);
    console.log('[AnalyzerContent] - window.location.search:', typeof window !== 'undefined' ? window.location.search : 'N/A (SSR)');
    
    // Get fresh storyId from URL as double-check
    const urlStoryId = typeof window !== 'undefined' 
      ? new URLSearchParams(window.location.search).get('story')
      : null;
    
    console.log('[AnalyzerContent] - urlStoryId from window.location:', urlStoryId);
    
    // Use URL storyId if state is out of sync
    const effectiveStoryId = urlStoryId || storyId;
    
    if (effectiveStoryId) {
      // Only load if we haven't loaded this story yet and we're not currently loading
      if (effectiveStoryId !== lastLoadedStoryIdRef.current && !isLoadingRef.current) {
        console.log('[AnalyzerContent] ✅ CONDITION MET - Loading story:', effectiveStoryId);
        loadStory(effectiveStoryId);
      } else {
        console.log('[AnalyzerContent] ⚠️ SKIPPING LOAD - Already loaded or loading');
        console.log('[AnalyzerContent]   - effectiveStoryId === lastLoaded?', effectiveStoryId === lastLoadedStoryIdRef.current);
        console.log('[AnalyzerContent]   - isLoadingRef.current?', isLoadingRef.current);
      }
    } else {
      // No storyId - clear state
      console.log('[AnalyzerContent] No storyId in URL, clearing state');
      if (lastLoadedStoryIdRef.current || analysisResult) {
        lastLoadedStoryIdRef.current = null;
        isLoadingRef.current = false;
        setAnalysisResult(null);
        setIsLoadingStory(false);
        reset();
        setTags([]);
        setTagInput("");
        setError(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId, loadStory]);
  
  // 5. AGGRESSIVE: Check URL on mount and load immediately if storyId exists
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    console.log('[AnalyzerContent] MOUNT EFFECT - Checking URL for storyId');
    
    const checkAndLoad = () => {
      const urlStoryId = new URLSearchParams(window.location.search).get('story');
      console.log('[AnalyzerContent] AGGRESSIVE CHECK - urlStoryId:', urlStoryId);
      console.log('[AnalyzerContent] AGGRESSIVE CHECK - lastLoaded:', lastLoadedStoryIdRef.current);
      console.log('[AnalyzerContent] AGGRESSIVE CHECK - isLoading:', isLoadingRef.current);
      console.log('[AnalyzerContent] AGGRESSIVE CHECK - current storyId state:', storyId);
      
      if (urlStoryId) {
        // Always update state to match URL
        if (urlStoryId !== storyId) {
          console.log('[AnalyzerContent] AGGRESSIVE CHECK - Updating storyId state from', storyId, 'to', urlStoryId);
          setStoryId(urlStoryId);
        }
        
        // Load if we haven't loaded this story yet
        if (urlStoryId !== lastLoadedStoryIdRef.current && !isLoadingRef.current) {
          console.log('[AnalyzerContent] ✅ AGGRESSIVE CHECK - LOADING STORY NOW:', urlStoryId);
          loadStory(urlStoryId);
        } else {
          console.log('[AnalyzerContent] ⚠️ AGGRESSIVE CHECK - Skipping load (already loaded or loading)');
        }
      } else {
        console.log('[AnalyzerContent] AGGRESSIVE CHECK - No storyId in URL');
      }
    };
    
    // Check immediately
    checkAndLoad();
    
    // Check after 50ms delay (very short, catches any timing issues)
    const timeout1 = setTimeout(checkAndLoad, 50);
    
    // Check after 200ms delay (backup)
    const timeout2 = setTimeout(checkAndLoad, 200);
    
    // Check after 500ms delay (final backup)
    const timeout3 = setTimeout(checkAndLoad, 500);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  const storyText = watch("storyText") || "";
  const acceptanceCriteria = watch("acceptanceCriteria") || "";

  const addTag = () => {
    if (tagInput.trim() && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    reset();
    setTags([]);
    setTagInput("");
    setAnalysisResult(null);
    setError(null);
    // Clear the story query parameter from URL
    if (storyId) {
      router.replace("/analyzer");
      setStoryId(null);
    }
  };

  const onSubmit = async (data: StoryInput) => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Check usage limit first
      const usageResponse = await fetch("/api/usage/check");
      const usageData = await usageResponse.json();

      if (!usageData.allowed) {
        setError(
          `You've reached your monthly limit of ${usageData.limit} analyses. Please upgrade your plan to continue.`
        );
        setIsAnalyzing(false);
        // Show upgrade button or link
        return;
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storyText: data.storyText,
          acceptanceCriteria: data.acceptanceCriteria,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || "Analysis failed");
      }

      setAnalysisResult(result.analysis);

      // Track usage
      await fetch("/api/usage/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feature: "story_analysis" }),
      });

      // Auto-save to database
      try {
        const saveResponse = await fetch("/api/stories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: data.title,
            story_text: data.storyText,
            acceptance_criteria: data.acceptanceCriteria,
            tags: tags.length > 0 ? tags : undefined,
            score: result.analysis.overall_score,
            analysis_result: result.analysis,
          }),
        });

        if (!saveResponse.ok) {
          console.error("Failed to save story");
        }
      } catch (saveError) {
        console.error("Error saving story:", saveError);
        // Don't fail the whole operation if save fails
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Story Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze your user stories against INVEST criteria using AI
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isLoadingStory ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading story...</span>
        </div>
      ) : analysisResult ? (
        <div className="space-y-6">
          <AnalysisResults analysis={analysisResult} />
          <div className="flex gap-4">
            <Button onClick={handleClear} variant="outline">
              Analyze Another Story
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-card rounded-lg border p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Story Title *</Label>
              <Input
                id="title"
                placeholder="e.g., User login functionality"
                {...register("title")}
                disabled={isAnalyzing}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="storyText">User Story *</Label>
                <span className="text-sm text-muted-foreground">
                  {storyText.length} / {MAX_STORY_LENGTH}
                </span>
              </div>
              <Textarea
                id="storyText"
                placeholder="As a [user type], I want [goal] so that [benefit]..."
                className="min-h-[200px]"
                {...register("storyText")}
                disabled={isAnalyzing}
                maxLength={MAX_STORY_LENGTH}
              />
              {errors.storyText && (
                <p className="text-sm text-red-500">
                  {errors.storyText.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Example: As a business analyst, I want to analyze user stories
                against INVEST criteria so that I can ensure quality and
                completeness.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="acceptanceCriteria">
                  Acceptance Criteria (Optional)
                </Label>
                <span className="text-sm text-muted-foreground">
                  {acceptanceCriteria.length} / {MAX_ACCEPTANCE_CRITERIA_LENGTH}
                </span>
              </div>
              <Textarea
                id="acceptanceCriteria"
                placeholder="Given... When... Then..."
                className="min-h-[120px]"
                {...register("acceptanceCriteria")}
                disabled={isAnalyzing}
                maxLength={MAX_ACCEPTANCE_CRITERIA_LENGTH}
              />
              {errors.acceptanceCriteria && (
                <p className="text-sm text-red-500">
                  {errors.acceptanceCriteria.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  disabled={isAnalyzing || tags.length >= 10}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  disabled={isAnalyzing || tags.length >= 10}
                  variant="outline"
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="hover:text-destructive"
                        disabled={isAnalyzing}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum 10 tags. Press Enter or click Add to add a tag.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isAnalyzing} size="lg">
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze Story
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              disabled={isAnalyzing}
            >
              Clear
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

