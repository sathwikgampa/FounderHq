import { NextResponse } from 'next/server';

export async function GET() {
  // SVG favicon string for FounderHQ
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="20" fill="#6C63FF"/><text x="50%" y="65%" font-size="50" font-weight="bold" fill="white" text-anchor="middle" font-family="sans-serif">FH</text></svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600, immutable',
    },
  });
}
