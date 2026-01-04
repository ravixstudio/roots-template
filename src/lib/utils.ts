import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get initials from first name and optional last name
 * @param firstName - First name
 * @param lastName - Last name (optional)
 * @returns Uppercase initials (e.g., "AC" for "Ayush Chugh")
 */
export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName) return "U";

  const firstInitial = firstName.charAt(0);
  const lastInitial = lastName?.charAt(0) || "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}
