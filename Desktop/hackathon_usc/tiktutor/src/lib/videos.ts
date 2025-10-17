export type VideoMeta = {
  id: string;
  title: string;
  subject: string;
  creatorStyle: string;
  duration: string;
  mp4Url?: string;
  embedUrl?: string;
};

export const demoVideos: VideoMeta[] = [
  {
    id: "v1",
    title: "Newton’s Laws Explained in 30s",
    subject: "Physics",
    creatorStyle: "Explainer",
    duration: "0:30",
    mp4Url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
  {
    id: "v2",
    title: "Derivatives: Intuition + Slopes",
    subject: "Calculus",
    creatorStyle: "Whiteboard",
    duration: "0:28",
    mp4Url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  },
  {
    id: "v3",
    title: "Chain Rule in 30s",
    subject: "Calculus",
    creatorStyle: "Animated",
    duration: "0:32",
    mp4Url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
    id: "v4",
    title: "Photosynthesis Visualized",
    subject: "Biology",
    creatorStyle: "Show & tell",
    duration: "0:27",
    mp4Url: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  },
  {
    id: "v5",
    title: "Supply & Demand in 40s",
    subject: "Economics",
    creatorStyle: "Explainer",
    duration: "0:40",
    mp4Url: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
];



