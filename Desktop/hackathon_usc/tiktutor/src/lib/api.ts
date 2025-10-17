export type FeedVideo = {
  id: string;
  title: string;
  topic: string;
  summary: string;
  script: string;
  keyPoints: string[];
  filepath: string;
  duration: number;
  thumbnail: string | null;
  createdAt: string;
};

export type QuizQuestion = {
  prompt: string;
  choices: string[];
  answerIndex: number;
};

export type QuizPayload = {
  videoId: string;
  questions: QuizQuestion[];
};

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:4000";

export async function fetchFeed(topic?: string): Promise<FeedVideo[]> {
  const params = topic ? `?topic=${encodeURIComponent(topic)}` : "";
  const res = await fetch(`${SERVER_URL}/api/feed${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch feed");
  const data = await res.json();
  return (data.videos ?? []) as FeedVideo[];
}

export async function uploadPdf(file: File): Promise<{ ok: boolean; jobId: string; videos: FeedVideo[] }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${SERVER_URL}/api/upload`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Failed to upload");
  return res.json();
}

export async function fetchQuiz(videoId: string): Promise<QuizPayload> {
  const res = await fetch(`${SERVER_URL}/api/quiz/${videoId}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to generate quiz");
  return res.json();
}


