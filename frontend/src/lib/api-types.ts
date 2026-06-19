export interface HealthStatus {
  status: string;
}

export interface TypingTest {
  id: number;
  username: string;
  mode: string;
  language: string;
  wpm: number;
  accuracy: number;
  errors: number;
  duration: number;
  linesCount?: number | null;
  codeTheme?: string | null;
  createdAt: string;
}

export interface TypingTestInput {
  username: string;
  mode: string;
  language: string;
  wpm: number;
  accuracy: number;
  errors: number;
  duration: number;
  linesCount?: number | null;
  codeTheme?: string | null;
}

export interface ModeStats {
  mode: string;
  bestWpm: number;
  averageWpm: number;
  totalTests: number;
}

export interface StatsSummary {
  bestWpm: number;
  averageWpm: number;
  totalTests: number;
  averageAccuracy: number;
  bestAccuracy: number;
  byMode?: ModeStats[];
}

export interface TrendPoint {
  date: string;
  wpm: number;
  accuracy: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  wpm: number;
  accuracy: number;
  mode: string;
  language?: string;
  createdAt: string;
}

export type ContentRequestDifficulty =
  (typeof ContentRequestDifficulty)[keyof typeof ContentRequestDifficulty];

export const ContentRequestDifficulty = {
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced",
} as const;

export interface ContentRequest {
  mode: string;
  language: string;
  difficulty?: ContentRequestDifficulty;
  linesCount?: number;
  topic?: string | null;
}

export interface GeneratedContent {
  text: string;
  language: string;
  mode: string;
  title?: string | null;
}

export interface FeedbackRequest {
  wpm: number;
  accuracy: number;
  errors: number;
  duration: number;
  mode: string;
  language: string;
  targetWpm?: number | null;
}

export interface AiFeedback {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  targetWpm: number;
  summary?: string;
}

export interface PlatformStats {
  totalUsers: number;
  totalTests: number;
  highestWpm: number;
  languagesSupported: number;
}

export type ListTypingTestsParams = {
  limit?: number;
  mode?: string;
};

export type GetStatsSummaryParams = {
  username?: string;
};

export type GetStatsTrendsParams = {
  username?: string;
  mode?: string;
  days?: number;
};

export type GetLeaderboardParams = {
  category?: string;
  period?: GetLeaderboardPeriod;
  limit?: number;
};

export type GetLeaderboardPeriod =
  (typeof GetLeaderboardPeriod)[keyof typeof GetLeaderboardPeriod];

export const GetLeaderboardPeriod = {
  daily: "daily",
  weekly: "weekly",
  monthly: "monthly",
  all_time: "all_time",
} as const;
