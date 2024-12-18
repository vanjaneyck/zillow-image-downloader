export class ZillowError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ZillowError';
  }
}