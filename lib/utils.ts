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

export interface WhatsAppFormatting {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  monospace?: boolean;
  codeBlock?: boolean;
}

/**
 * Parses WhatsApp formatted text into parts for rendering
 * @param formattedText - Text with WhatsApp formatting
 * @returns Array of text parts with formatting information
 */
export function parseWhatsAppFormatting(formattedText: string): Array<{ text: string; type: 'bold' | 'italic' | 'strikethrough' | 'monospace' | 'codeBlock' | 'plain' }> {
  if (!formattedText) return [];
  
  const result: Array<{ text: string; type: 'bold' | 'italic' | 'strikethrough' | 'monospace' | 'codeBlock' | 'plain' }> = [];
  let currentIndex = 0;
  
  // First, handle code blocks (```text```) as they can't contain other formatting
  const codeBlockRegex = /```([^`]+)```/g;
  let codeBlockMatch;
  const codeBlockPositions: Array<{ start: number; end: number; text: string }> = [];
  
  while ((codeBlockMatch = codeBlockRegex.exec(formattedText)) !== null) {
    codeBlockPositions.push({
      start: codeBlockMatch.index,
      end: codeBlockMatch.index + codeBlockMatch[0].length,
      text: codeBlockMatch[1]
    });
  }
  
  // Process the text, skipping code blocks
  while (currentIndex < formattedText.length) {
    // Check if we're at a code block
    const codeBlock = codeBlockPositions.find(pos => pos.start === currentIndex);
    if (codeBlock) {
      result.push({
        text: codeBlock.text,
        type: 'codeBlock'
      });
      currentIndex = codeBlock.end;
      continue;
    }
    
    // Check for other formatting patterns
    let foundFormatting = false;
    
    // Check for monospace (`text`) - but not code blocks
    if (formattedText[currentIndex] === '`' && 
        currentIndex + 1 < formattedText.length && 
        !formattedText.startsWith('```', currentIndex)) {
      const endIndex = formattedText.indexOf('`', currentIndex + 1);
      if (endIndex !== -1) {
        const text = formattedText.substring(currentIndex + 1, endIndex);
        result.push({
          text,
          type: 'monospace'
        });
        currentIndex = endIndex + 1;
        foundFormatting = true;
      }
    }
    
    // Check for bold (*text*)
    if (!foundFormatting && formattedText[currentIndex] === '*') {
      const endIndex = formattedText.indexOf('*', currentIndex + 1);
      if (endIndex !== -1) {
        const text = formattedText.substring(currentIndex + 1, endIndex);
        // Recursively parse nested formatting
        const nestedParts = parseWhatsAppFormatting(text);
        if (nestedParts.length > 0) {
          // Apply bold to all nested parts
          nestedParts.forEach(part => {
            result.push({
              text: part.text,
              type: 'bold'
            });
          });
        } else {
          result.push({
            text,
            type: 'bold'
          });
        }
        currentIndex = endIndex + 1;
        foundFormatting = true;
      }
    }
    
    // Check for italic (_text_)
    if (!foundFormatting && formattedText[currentIndex] === '_') {
      const endIndex = formattedText.indexOf('_', currentIndex + 1);
      if (endIndex !== -1) {
        const text = formattedText.substring(currentIndex + 1, endIndex);
        // Recursively parse nested formatting
        const nestedParts = parseWhatsAppFormatting(text);
        if (nestedParts.length > 0) {
          // Apply italic to all nested parts
          nestedParts.forEach(part => {
            result.push({
              text: part.text,
              type: 'italic'
            });
          });
        } else {
          result.push({
            text,
            type: 'italic'
          });
        }
        currentIndex = endIndex + 1;
        foundFormatting = true;
      }
    }
    
    // Check for strikethrough (~text~)
    if (!foundFormatting && formattedText[currentIndex] === '~') {
      const endIndex = formattedText.indexOf('~', currentIndex + 1);
      if (endIndex !== -1) {
        const text = formattedText.substring(currentIndex + 1, endIndex);
        // Recursively parse nested formatting
        const nestedParts = parseWhatsAppFormatting(text);
        if (nestedParts.length > 0) {
          // Apply strikethrough to all nested parts
          nestedParts.forEach(part => {
            result.push({
              text: part.text,
              type: 'strikethrough'
            });
          });
        } else {
          result.push({
            text,
            type: 'strikethrough'
          });
        }
        currentIndex = endIndex + 1;
        foundFormatting = true;
      }
    }
    
    // If no formatting found, add as plain text
    if (!foundFormatting) {
      // Find the next formatting character
      let nextFormatIndex = formattedText.length;
      for (let i = currentIndex; i < formattedText.length; i++) {
        if (['*', '_', '~', '`'].includes(formattedText[i])) {
          // Check if it's a code block start
          if (formattedText[i] === '`' && formattedText.startsWith('```', i)) {
            const codeBlock = codeBlockPositions.find(pos => pos.start === i);
            if (codeBlock) {
              nextFormatIndex = i;
              break;
            }
          } else if (formattedText[i] === '`' && !formattedText.startsWith('```', i)) {
            nextFormatIndex = i;
            break;
          } else {
            nextFormatIndex = i;
            break;
          }
        }
      }
      
      const plainText = formattedText.substring(currentIndex, nextFormatIndex);
      if (plainText.trim()) {
        result.push({
          text: plainText,
          type: 'plain'
        });
      }
      currentIndex = nextFormatIndex;
    }
  }
  
  return result;
}

/**
 * Gets CSS classes for WhatsApp formatting types
 * @param type - The formatting type
 * @returns CSS classes string
 */
export function getWhatsAppFormattingClasses(type: 'bold' | 'italic' | 'strikethrough' | 'monospace' | 'codeBlock' | 'plain'): string {
  switch (type) {
    case 'bold':
      return 'font-bold';
    case 'italic':
      return 'italic';
    case 'strikethrough':
      return 'line-through';
    case 'monospace':
      return 'font-mono bg-black/10 dark:bg-white/20 px-1.5 py-0.5 rounded text-sm';
    case 'codeBlock':
      return 'font-mono bg-black/10 dark:bg-white/20 px-3 py-2 rounded-lg text-sm block my-2 border border-black/5 dark:border-white/10';
    default:
      return '';
  }
}

/**
 * Formats text with WhatsApp formatting syntax
 * @param text - The text to format
 * @param formatting - Object containing formatting options
 * @returns Formatted text with WhatsApp syntax
 */
export function formatWhatsAppMessage(text: string, formatting: WhatsAppFormatting): string {
  let formattedText = text;

  if (formatting.codeBlock) {
    formattedText = `\`\`\`${formattedText}\`\`\``;
  } else if (formatting.monospace) {
    formattedText = `\`${formattedText}\``;
  } else {
    if (formatting.bold) {
      formattedText = `*${formattedText}*`;
    }
    if (formatting.italic) {
      formattedText = `_${formattedText}_`;
    }
    if (formatting.strikethrough) {
      formattedText = `~${formattedText}~`;
    }
  }
  return formattedText;
}

/**
 * Formats text with multiple formatting options
 * @param text - The text to format
 * @param formatOptions - Array of formatting options to apply
 * @returns Formatted text with WhatsApp syntax
 */
export function formatWhatsAppMessageAdvanced(
  text: string, 
  formatOptions: Array<{ text: string; formatting: WhatsAppFormatting }>
): string {
  let result = text;
  
  // Sort format options by position in text (descending) to avoid index shifting
  const sortedOptions = [...formatOptions].sort((a, b) => {
    const aIndex = result.indexOf(a.text);
    const bIndex = result.indexOf(b.text);
    return bIndex - aIndex;
  });

  for (const option of sortedOptions) {
    const { text: targetText, formatting } = option;
    const index = result.indexOf(targetText);
    
    if (index !== -1) {
      const formattedText = formatWhatsAppMessage(targetText, formatting);
      result = result.substring(0, index) + formattedText + result.substring(index + targetText.length);
    }
  }

  return result;
}

/**
 * Removes WhatsApp formatting from text
 * @param formattedText - Text with WhatsApp formatting
 * @returns Clean text without formatting
 */
export function unformatWhatsAppMessage(formattedText: string): string {
  let unformattedText = formattedText;

  // Remove code blocks first (```text```)
  unformattedText = unformattedText.replace(/```([^`]+)```/g, '$1');
  
  // Remove monospace formatting (`text`)
  unformattedText = unformattedText.replace(/`([^`]+)`/g, '$1');
  
  // Remove bold formatting (*text*)
  unformattedText = unformattedText.replace(/\*([^*]+)\*/g, '$1');
  
  // Remove italic formatting (_text_)
  unformattedText = unformattedText.replace(/_([^_]+)_/g, '$1');
  
  // Remove strikethrough formatting (~text~)
  unformattedText = unformattedText.replace(/~([^~]+)~/g, '$1');

  return unformattedText;
}

/**
 * Extracts formatting information from WhatsApp formatted text
 * @param formattedText - Text with WhatsApp formatting
 * @returns Array of formatting information with text and formatting type
 */
export function extractWhatsAppFormatting(formattedText: string): Array<{ text: string; formatting: WhatsAppFormatting }> {
  const formatting: Array<{ text: string; formatting: WhatsAppFormatting }> = [];
  
  // Extract code blocks
  const codeBlockRegex = /```([^`]+)```/g;
  let match;
  while ((match = codeBlockRegex.exec(formattedText)) !== null) {
    formatting.push({
      text: match[1],
      formatting: { codeBlock: true }
    });
  }
  
  // Extract monospace
  const monospaceRegex = /`([^`]+)`/g;
  while ((match = monospaceRegex.exec(formattedText)) !== null) {
    formatting.push({
      text: match[1],
      formatting: { monospace: true }
    });
  }
  
  // Extract bold
  const boldRegex = /\*([^*]+)\*/g;
  while ((match = boldRegex.exec(formattedText)) !== null) {
    formatting.push({
      text: match[1],
      formatting: { bold: true }
    });
  }
  
  // Extract italic
  const italicRegex = /_([^_]+)_/g;
  while ((match = italicRegex.exec(formattedText)) !== null) {
    formatting.push({
      text: match[1],
      formatting: { italic: true }
    });
  }
  
  // Extract strikethrough
  const strikethroughRegex = /~([^~]+)~/g;
  while ((match = strikethroughRegex.exec(formattedText)) !== null) {
    formatting.push({
      text: match[1],
      formatting: { strikethrough: true }
    });
  }
  
  return formatting;
}

/**
 * Checks if text contains WhatsApp formatting
 * @param text - Text to check
 * @returns True if text contains formatting
 */
export function hasWhatsAppFormatting(text: string): boolean {
  const formattingRegex = /[*_~`]/;
  return formattingRegex.test(text);
}

/**
 * Gets the length of text without WhatsApp formatting
 * @param formattedText - Text with WhatsApp formatting
 * @returns Length of unformatted text
 */
export function getWhatsAppMessageLength(formattedText: string): number {
  return unformatWhatsAppMessage(formattedText).length;
}

/**
 * Generates a random pastel color
 * @returns A pastel color hex string
 */
export function generateRandomPastelColor(): string {
  const hue = Math.floor(Math.random() * 360);
  const saturation = Math.floor(Math.random() * 30) + 70; // 70-100%
  const lightness = Math.floor(Math.random() * 20) + 70; // 70-90%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Generates a consistent color based on a string input
 * Useful for avatar placeholders where you want the same name to always have the same color
 * @param str - The string to generate a color for
 * @returns A pastel color hex string
 */
export function generateColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash) % 360;
  const saturation = 70 + (Math.abs(hash) % 20); // 70-90%
  const lightness = 75 + (Math.abs(hash) % 15); // 75-90%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Gets the first letter of a string, handling edge cases
 * @param str - The input string
 * @returns The first letter or a fallback character
 */
export function getFirstLetter(str: string): string {
  if (!str || typeof str !== 'string') return '?';
  const trimmed = str.trim();
  if (trimmed.length === 0) return '?';
  return trimmed.charAt(0).toUpperCase();
}