export const LawSourceJobs = {
  DiffCheck: "law-source-diff-check",
} as const;

export type LawSourceJobType =
  (typeof LawSourceJobs)[keyof typeof LawSourceJobs];
