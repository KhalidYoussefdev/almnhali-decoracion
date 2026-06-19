import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { isAdminAuthenticated } from '@/lib/auth';
import {
  UPLOAD_URL_PREFIX,
  isImageFilename,
  uploadDirs,
  uploadUrlToFilename,
} from '@/lib/media';

export interface MediaItem {
  url: string;
  filename: string;
  size: number;
  createdAt: string;
}

async function listUploads(): Promise<MediaItem[]> {
  const byFilename = new Map<string, MediaItem>();

  for (const dir of uploadDirs()) {
    await fs.mkdir(dir, { recursive: true });

    let entries: string[];
    try {
      entries = await fs.readdir(dir);
    } catch {
      continue;
    }

    for (const filename of entries) {
      if (filename.startsWith('.') || !isImageFilename(filename)) continue;
      const filePath = path.join(dir, filename);
      try {
        const stat = await fs.stat(filePath);
        if (!stat.isFile()) continue;
        byFilename.set(filename, {
          url: `${UPLOAD_URL_PREFIX}${filename}`,
          filename,
          size: stat.size,
          createdAt: stat.mtime.toISOString(),
        });
      } catch {
        // skip unreadable files
      }
    }
  }

  return Array.from(byFilename.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(await listUploads());
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url } = (await req.json()) as { url?: string };
  if (!url) {
    return NextResponse.json({ error: 'URL required' }, { status: 400 });
  }

  const filename = uploadUrlToFilename(url);
  if (!filename) {
    return NextResponse.json({ error: 'Invalid upload URL' }, { status: 400 });
  }

  for (const dir of uploadDirs()) {
    const filePath = path.join(dir, filename);
    try {
      await fs.unlink(filePath);
      return NextResponse.json({ ok: true });
    } catch {
      // try next directory
    }
  }

  return NextResponse.json({ error: 'File not found' }, { status: 404 });
}