import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { isImageFilename, uploadDirs } from '@/lib/media';

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

async function findUploadFile(filename: string): Promise<string | null> {
  for (const dir of uploadDirs()) {
    const filePath = path.join(dir, filename);
    try {
      const info = await stat(filePath);
      if (info.isFile()) return filePath;
    } catch {
      // try next directory
    }
  }
  return null;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!filename || filename.includes('..') || filename.includes('/') || !isImageFilename(filename)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const filePath = await findUploadFile(filename);
  if (!filePath) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
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