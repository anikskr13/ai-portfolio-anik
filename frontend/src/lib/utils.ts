import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
export const OWNER_NAME = import.meta.env.VITE_OWNER_NAME || "Anik Sarkar";
export const OWNER_TITLE = import.meta.env.VITE_OWNER_TITLE || "Full-Stack Developer";
export const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || "anik@example.com";
