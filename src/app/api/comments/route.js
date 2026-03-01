// src/app/api/comments/route.js
import { NextResponse } from 'next/server';

// In production, use a database. For Vercel deployment, comments are stored client-side.
// This route exists as a placeholder for future database integration.

export async function GET(request) {
  return NextResponse.json({ message: 'Comments are stored locally' });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({ success: true, ...body });
}
