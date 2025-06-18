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
  const mainMargin = 4;
  const pageHeader = 48;

  return (
    viewportHeight -
    (headerHeight + padding + searchBarHeight + paginationHeight + mainMargin + pageHeader)
  );
};