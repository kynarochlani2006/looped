/**
 * EXPLANATION MODE: Every code line has an adjacent explanation comment.
 * Annotated on 2025-10-17. No behavior changes intended.
 */
"use client";
// Enables client-side rendering so hooks like useState and useEffect can run.

// Imports React hooks and helpers for state, memoization, and lifecycle effects.
import { useEffect, useMemo, useState } from "react";
// Imports Framer Motion's AnimatePresence to animate mounting/unmounting components.
import { AnimatePresence } from "framer-motion";
// Imports spinner and refresh icons used within control buttons.
import { Loader2, RefreshCcw } from "lucide-react";

// Imports the video display card component to render individual feed items.
import { VideoCard } from "@/components/VideoCard";
// Imports the drawer component that surfaces quizzes for a given video.
import { QuizDrawer } from "@/components/QuizDrawer";
// Imports API helpers plus associated TypeScript types for feed videos and quizzes.
import { fetchFeed, fetchQuiz, type FeedVideo, type QuizPayload } from "@/lib/api";

// Declares the main feed page component rendered at /feed.
export default function FeedPage() {
  // Maintains the list of videos retrieved from the feed endpoint.
  const [videos, setVideos] = useState<FeedVideo[]>([]);
  // Tracks whether the feed is currently loading to show placeholders.
  const [loading, setLoading] = useState(true);
  // Stores error messages to display when network requests fail.
  const [error, setError] = useState<string | null>(null);
  // Records the currently selected topic filter, defaulting to "All".
  const [activeTopic, setActiveTopic] = useState<string>("All");
  // Holds the quiz payload returned for the active video, if any.
  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  // Indicates whether a quiz fetch is in progress to disable UI or show spinners.
  const [isQuizLoading, setQuizLoading] = useState(false);

  // Runs once on mount to trigger the initial feed fetch.
  useEffect(() => {
    // Invokes the async loader without awaiting inside useEffect.
    loadFeed();
  }, []);

  // Defines the asynchronous function responsible for fetching the feed.
  const loadFeed = async () => {
    // Signals the UI to show the loading state.
    setLoading(true);
    // Clears any previous error before the new request.
    setError(null);
    try {
      // Requests the feed data from the API helper.
      const data = await fetchFeed();
      // Persists the returned videos into local state.
      setVideos(data);
    } catch (err) {
      // Logs the error for debugging in the console.
      console.error(err);
      // Surfaces a user-friendly error message in the UI.
      setError("We couldn’t fetch the feed. Try again in a bit.");
    } finally {
      // Ends the loading state regardless of success or failure.
      setLoading(false);
    }
  };

  // Computes the list of unique topics available for filtering.
  const topics = useMemo(() => {
    // Uses a Set to deduplicate topic names across videos.
    const unique = new Set<string>();
    // Adds each video's topic to the set.
    videos.forEach((video) => unique.add(video.topic));
    // Returns an array starting with "All" followed by unique topics.
    return ["All", ...Array.from(unique)];
  }, [videos]);

  // Derives the subset of videos matching the active topic filter.
  const filteredVideos = useMemo(() => {
    // When "All" is selected, return every video.
    if (activeTopic === "All") return videos;
    // Otherwise filter to videos whose topic matches the active selection.
    return videos.filter((video) => video.topic === activeTopic);
  }, [videos, activeTopic]);

  // Handles quiz fetching for a specific video identifier.
  const handleQuiz = async (videoId: string) => {
    // Marks the quiz drawer as loading while the request is active.
    setQuizLoading(true);
    try {
      // Requests the quiz payload for the given video ID.
      const payload = await fetchQuiz(videoId);
      // Stores the returned quiz so the drawer can display it.
      setQuiz(payload);
    } catch (err) {
      // Logs the error for developer insight.
      console.error(err);
      // Provides a fallback quiz prompting the user to retry.
      setQuiz({
        videoId,
        questions: [
          {
            prompt: "We couldn’t reach the quiz service. Try again?",
            choices: ["Retry", "Cancel", "Refresh feed"],
            answerIndex: 0,
          },
        ],
      });
    } finally {
      // Clears the quiz loading indicator.
      setQuizLoading(false);
    }
  };

  // Renders the feed page layout and interactive elements.
  return (
    // Provides the page background, minimum height, and padding below for the drawer.
    <main className="relative min-h-screen w-full bg-[#0A0A0A] pb-28 text-white">
      {/* Wraps the header and topic filter section with centered layout constraints. */}
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pt-6">
        {/* Aligns the heading and refresh button horizontally with responsive wrapping. */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Contains the title and descriptive subtext. */}
          <div>
            {/* Displays the main heading for the feed page. */}
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Personalized Study Feed
            </h1>
            {/* Provides a sentence describing the feed purpose. */}
            <p className="mt-1 text-sm text-white/70">
              Swipe through AI-crafted micro lessons tuned to what you’re learning today.
            </p>
          </div>
          {/* Button enabling users to manually refresh the feed contents. */}
          <button
            onClick={loadFeed}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/80 hover:bg-white/10 transition-colors"
          >
            {/* Refresh icon visually indicating the action purpose. */}
            <RefreshCcw size={16} />
            {/* Button label instructing users to refresh. */}
            Refresh
          </button>
        </div>

        {/* Renders selectable topic pills for filtering the feed. */}
        <div className="flex flex-wrap gap-2">
          {/* Iterates through each topic to produce a filter button. */}
          {topics.map((topic) => {
            // Determines whether the looped topic is the active filter.
            const active = topic === activeTopic;
            // Returns the button element for the current topic.
            return (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={
                  "rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition-all " +
                  (active
                    ? "border-[#FF6B00]/80 bg-[#FF6B00]/20 text-[#FF6B00]"
                    : "border-white/10 bg-white/5 text-white/70 hover:text-white")
                }
              >
                {/* Displays the topic label inside the pill. */}
                {topic}
              </button>
            );
          })}
        </div>
      </section>

      {/* Contains the vertical snapping feed viewport. */}
      <section className="mt-4 flex w-full justify-center px-3">
        {/* Provides a scrollable column with snap behavior for stacked videos. */}
        <div className="relative flex h-[82vh] w-full max-w-[520px] snap-y snap-mandatory flex-col gap-6 overflow-y-auto pb-10">
          {/* Shows a loading spinner and message while feed data is fetching. */}
          {loading && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-white/70">
              {/* Animated spinner icon communicating active loading. */}
              <Loader2 className="h-6 w-6 animate-spin" />
              {/* Text indicating that study clips are loading. */}
              Loading study clips…
            </div>
          )}

          {/* Displays an error message and retry button when the feed request fails. */}
          {!loading && error && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-sm text-red-400">
              {/* Outputs the current error message to the user. */}
              <p>{error}</p>
              {/* Button allowing users to retry loading the feed. */}
              <button
                onClick={loadFeed}
                className="rounded-full border border-red-400/50 px-4 py-2 text-xs uppercase tracking-[0.3em] hover:bg-red-400/10"
              >
                {/* Retry button label prompting another attempt. */}
                Try Again
              </button>
            </div>
          )}

          {/* Handles the empty state when no videos match the selected topic. */}
          {!loading && !error && filteredVideos.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center text-sm text-white/70">
              {/* Message guiding users to change filters or upload new content. */}
              No clips in this topic yet. Try another filter or upload new material to generate ones instantly.
            </div>
          )}

          {/* Renders each filtered video inside the snapping list when data is available. */}
          {!loading &&
            !error &&
            filteredVideos.map((video) => (
              <div key={video.id} className="snap-start">
                {/* Video card component handles media playback and quiz trigger. */}
                <VideoCard video={video} onQuiz={handleQuiz} />
              </div>
            ))}
        </div>
      </section>

      {/* Wraps the quiz drawer with animation support for smooth entrance and exit. */}
      <AnimatePresence>
        {/* Renders the quiz drawer when a quiz payload is present. */}
        {quiz && (
          <QuizDrawer
            quiz={quiz}
            onClose={() => setQuiz(null)}
            isLoading={isQuizLoading}
          />
        )}
      </AnimatePresence>
    </main>
  );
  // Ends the render output for the FeedPage component.
}
// Closes the FeedPage function declaration.
