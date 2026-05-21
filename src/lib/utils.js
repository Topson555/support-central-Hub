import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function parseJsonSafe(response) {
  // Read raw text first to avoid JSON parse errors on empty/non-JSON responses
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch (e) {
    return { text };
  }
}
