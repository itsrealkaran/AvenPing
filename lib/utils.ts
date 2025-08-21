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
 * Parses WhatsApp formatted text into parts for rendering
 * @param formattedText - Text with WhatsApp formatting
 * @returns Array of text parts with formatting information
 */
export function parseWhatsAppFormatting(formattedText: string): Array<{ text: string; type: 'bold' | 'italic' | 'strikethrough' | 'monospace' | 'codeBlock' | 'plain' }> {
  if (!formattedText) return [];
  
  // Split text by formatting patterns while preserving the delimiters
  const parts = formattedText.split(/(\*[^*]+\*|_[^_]+_|~[^~]+~|`[^`]+`|```[^`]+```)/);
  
  return parts.map((part) => {
    // Bold formatting: *text*
    if (part.startsWith('*') && part.endsWith('*')) {
      return {
        text: part.slice(1, -1),
        type: 'bold' as const
      };
    }
    
    // Italic formatting: _text_
    if (part.startsWith('_') && part.endsWith('_')) {
      return {
        text: part.slice(1, -1),
        type: 'italic' as const
      };
    }
    
    // Strikethrough formatting: ~text~
    if (part.startsWith('~') && part.endsWith('~')) {
      return {
        text: part.slice(1, -1),
        type: 'strikethrough' as const
      };
    }
    
    // Monospace formatting: `text` (but not code blocks)
    if (part.startsWith('`') && part.endsWith('`') && !part.startsWith('```')) {
      return {
        text: part.slice(1, -1),
        type: 'monospace' as const
      };
    }
    
    // Code block formatting: ```text```
    if (part.startsWith('```') && part.endsWith('```')) {
      return {
        text: part.slice(3, -3),
        type: 'codeBlock' as const
      };
    }
    
    // Return plain text as-is
    return {
      text: part,
      type: 'plain' as const
    };
  });
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
      return 'font-mono bg-gray-200 px-1 rounded';
    case 'codeBlock':
      return 'font-mono bg-gray-200 px-2 py-1 rounded block';
    default:
      return '';
  }
}