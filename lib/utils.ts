import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

export const calculateTableHeight = () => {
  const viewportHeight = window.innerHeight;
  const headerHeight = 64;
  const padding = 64;
  const searchBarHeight = 55;
  const paginationHeight = 56;

  return viewportHeight - (headerHeight + padding + searchBarHeight + paginationHeight);
};