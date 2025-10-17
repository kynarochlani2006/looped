/**
 * EXPLANATION MODE: Every code line has an adjacent explanation comment.
 * Annotated on 2025-10-17. No behavior changes intended.
 */
// Client-side rendering is required because hooks and browser APIs are used below.
"use client";

// Imports React hooks for managing state, memoizing derived data, and running effects.
import { useEffect, useMemo, useState } from "react";
// Imports Framer Motion to animate the card entries on the explore page.
import { motion } from "framer-motion";
// Imports icons for the library badge and the search input.
import { Search, Sparkles } from "lucide-react";

// Imports the feed fetching helper along with its TypeScript type.
import { fetchFeed, type FeedVideo } from "@/lib/api";
// Imports demo seed videos used to populate the explore grid instantly.
import { demoVideos } from "@/lib/videos";

// Defines an extended video type that optionally tracks creator style metadata.
type ExploreVideo = FeedVideo & { creatorStyle?: string };

// Exports the explore page component rendered at /explore.
export default function ExplorePage() {
  // Holds the merged set of demo and live videos available for browsing.
  const [videos, setVideos] = useState<ExploreVideo[]>([]);
  // Tracks the currently selected subject filter, defaulting to all topics.
  const [subject, setSubject] = useState<string>("All");
  // Tracks the creator style filter to narrow results by presentation approach.
  const [style, setStyle] = useState<string>("All");
  // Stores the free-text search query entered by the user.
  const [search, setSearch] = useState<string>("");

  // Seeds demo videos immediately and then attempts to fetch live feed entries.
  useEffect(() => {
    // Converts demo videos into ExploreVideo entries with normalized fields.
    const seeded: ExploreVideo[] = demoVideos.map((video) => ({
      id: `demo-${video.id}`,
      title: video.title,
      topic: video.subject,
      summary: `Creator style: ${video.creatorStyle}. Duration ${video.duration}.`,
      script: "",
      keyPoints: [],
      filepath: video.mp4Url || "",
      duration: parseDuration(video.duration),
      thumbnail: null,
      createdAt: new Date().toISOString(),
      creatorStyle: video.creatorStyle,
    }));
    // Stores the seeded demo videos so the grid renders instantly.
    setVideos(seeded);

    // Fetches live feed data and prepends it to the seeded list.
    fetchFeed()
      .then((feed) => {
        // Adds live videos (tagged as AI style) before the demo entries.
        setVideos((prev) => [
          ...feed.map((item) => ({ ...item, creatorStyle: "AI" })),
          ...prev,
        ]);
      })
      .catch((err) => {
        // Logs a warning if the live feed fetch fails but keeps the page usable.
        console.warn("Failed to load live feed for explore", err);
      });
  }, []);

  // Memoizes the list of available subjects derived from the video dataset.
  const subjects = useMemo(() => {
    // Initializes a set with the default "All" option.
    const set = new Set<string>(["All"]);
    // Adds each video's subject to the set to deduplicate values.
    videos.forEach((video) => set.add(video.topic));
    // Returns the subjects as an array for rendering in the select element.
    return Array.from(set);
  }, [videos]);

  // Memoizes the list of available creator styles derived from videos.
  const styles = useMemo(() => {
    // Starts with the "All" filter option.
    const set = new Set<string>(["All"]);
    // Adds creator styles when they are defined on the video record.
    videos.forEach((video) => {
      if (video.creatorStyle) set.add(video.creatorStyle);
    });
    // Returns the styles as an array for population in the select menu.
    return Array.from(set);
  }, [videos]);

  // Filters the video dataset based on subject, style, and search query.
  const filtered = useMemo(() => {
    // Applies all active filters and returns the matching videos.
    return videos.filter((video) => {
      // Checks whether the subject filter matches or is set to all.
      const matchesSubject = subject === "All" || video.topic === subject;
      // Checks whether the style filter matches or is set to all.
      const matchesStyle = style === "All" || video.creatorStyle === style;
      // Checks whether the search term appears in the title or summary.
      const matchesSearch =
        search.length === 0 ||
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.summary.toLowerCase().includes(search.toLowerCase());
      // Returns true only when every individual filter passes.
      return matchesSubject && matchesStyle && matchesSearch;
    });
  }, [videos, subject, style, search]);

  // Renders the explore page layout and filter controls.
  return (
    // Provides the page background, overall height, and horizontal padding.
    <main className="min-h-screen w-full bg-[#0A0A0A] px-4 pb-28 text-white">
      {/* Centers the content within a max width and adds vertical spacing. */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pt-10">
        {/* Introductory header explaining the explore experience. */}
        <div className="flex flex-col gap-3">
          {/* Badge highlighting that this section is a library of reels. */}
          <span className="inline-flex max-w-max items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-white/70">
            {/* Sparkles icon draws attention to the library indicator. */}
            <Sparkles size={14} />
            {/* Label text for the badge. */}
            Library
          </span>
          {/* Page headline inviting users to browse curated reels. */}
          <h1 className="text-3xl font-semibold tracking-tight">
            Browse Looped community reels & creator decks.
          </h1>
          {/* Supporting text suggesting how to use the filters and search. */}
          <p className="text-sm text-white/70">
            Filter by subject, creator style, or search for a concept you want to review fast.
          </p>
        </div>

        {/* Filter toolbar containing search, subject, and style controls. */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          {/* Search input with an inline icon. */}
          <div className="relative flex-1 min-w-[200px]">
            {/* Positions the search icon inside the input field. */}
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            {/* Text input bound to the search state for filtering by keywords. */}
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search derivatives, revolutions, supply & demand…"
              className="w-full rounded-xl border border-white/15 bg-black/30 py-2 pl-9 pr-4 text-sm text-white placeholder:text-white/40 focus:border-[#FF6B00] focus:outline-none"
            />
          </div>
          {/* Subject filter select menu for narrowing by topic. */}
          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
          >
            {/* Renders each available subject as an option inside the select. */}
            {subjects.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
          {/* Style filter select menu to choose a creator presentation style. */}
          <select
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            className="rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm"
          >
            {/* Renders each available creator style option. */}
            {styles.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </div>

        {/* Responsive grid displaying the filtered video cards. */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Maps filtered videos to animated cards with slight stagger. */}
          {filtered.map((video, index) => (
            <motion.div
              key={video.id + index}
              className="overflow-hidden rounded-[24px] border border-white/10 bg-white/5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              {/* Video preview area maintaining a 9:16 aspect ratio. */}
              <div className="relative aspect-[9/16] overflow-hidden">
                {/* Autoplaying muted video showing the reel preview. */}
                <video
                  src={video.filepath}
                  className="h-full w-full object-cover"
                  muted
                  loop
                  autoPlay
                  playsInline
                />
                {/* Gradient overlay to keep overlay text legible. */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                {/* Top-left badge cluster showing topic and creator style. */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  {/* Topic badge showing the subject of the reel. */}
                  <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.28em]">
                    {video.topic}
                  </span>
                  {/* Optional badge showing the creator style if present. */}
                  {video.creatorStyle && (
                    <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-white/70">
                      {video.creatorStyle}
                    </span>
                  )}
                </div>
                {/* Bottom overlay containing the title and summary snippet. */}
                <div className="absolute bottom-4 left-4 right-4 space-y-2 text-white">
                  {/* Reel title displayed in bold for readability. */}
                  <h3 className="text-lg font-semibold leading-tight">
                    {video.title}
                  </h3>
                  {/* Summary line describing the reel details. */}
                  <p className="text-xs text-white/80">{video.summary}</p>
                </div>
              </div>
              {/* Metadata section containing key points and duration/date. */}
              <div className="space-y-3 border-t border-white/10 p-4 text-xs text-white/70">
                {/* Shows up to three key points as pill-like tags. */}
                <div className="flex flex-wrap gap-2">
                  {video.keyPoints.slice(0, 3).map((point, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-white/10 bg-white/8 px-2 py-1"
                    >
                      {point || "Concept highlight"}
                    </span>
                  ))}
                </div>
                {/* Displays the duration and created date aligned on a single row. */}
                <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em]">
                  <span>{video.duration ? `${Math.round(video.duration)}s` : "Quick"}</span>
                  <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
  // Concludes the rendered JSX for the explore page component.
}

// Parses duration strings like "0:45" into seconds for consistent display.
function parseDuration(duration: string): number {
  // Provides a default duration when the input is absent.
  if (!duration) return 30;
  // Splits the duration into minute and second parts converted to numbers.
  const [minutesPart, secondsPart] = duration.split(":").map((part) => Number(part));
  // Falls back to the default when conversion to numbers fails.
  if (Number.isNaN(minutesPart) || Number.isNaN(secondsPart)) return 30;
  // Converts minutes and seconds into total seconds for downstream use.
  return minutesPart * 60 + secondsPart;
}
