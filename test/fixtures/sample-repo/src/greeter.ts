/** Builds the greeting shown to a visitor, falling back to "stranger" for an empty name. */
export function greet(name: string): string {
  return `Hello, ${name.trim() || "stranger"}!`;
}

/** Remembers how many times each visitor has been greeted, in memory only. */
export class GreetingLog {
  private readonly counts = new Map<string, number>();

  record(name: string): number {
    const next = (this.counts.get(name) ?? 0) + 1;
    this.counts.set(name, next);
    return next;
  }
}
