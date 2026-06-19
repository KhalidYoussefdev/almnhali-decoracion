import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { UPLOAD_DIR, isImageFilename } from '@/lib/media';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!filename || filename.includes('..') || filename.includes('/') || !isImageFilename(filename)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const filePath = path.join(UPLOAD_DIR, filename);

  try {
    const info = await stat(filePath);
    if (!info.isFile()) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const buffer = await readFile(filePath);
    const ext = path.extname(filename).toLowerCase();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': MIME[ext] ?? 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}