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

export const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
};

export function normalizePhoneNumber(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export function formatPhoneNumber(phone: string) {
  return `+${phone}`;
}

export function formatPin(pin: string) {
  const digits = pin.replace(/[^\d]/g, "").slice(0, 6);
  return digits
    .split("")
    .map((digit, idx, arr) => (idx < arr.length - 1 ? digit + "-" : digit))
    .join("");
}

export function unformatPin(formatted: string) {
  return formatted.replace(/-/g, "");
}