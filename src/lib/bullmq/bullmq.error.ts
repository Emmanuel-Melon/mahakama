export class JobError extends Error {
  constructor(
    public message: string,
    public shouldRetry: boolean = true,
    public metadata?: Record<string, any>,
  ) {
    super(message);
    this.name = "JobError";
  }
}
