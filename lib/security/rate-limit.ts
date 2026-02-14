const requests = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = requests.get(key);

  if (!current || current.resetAt < now) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, retryAt: current.resetAt };
  }

  current.count += 1;
  return { allowed: true, remaining: limit - current.count };
}
