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

async function walkUploads(dir: string, relativeDir = ''): Promise<MediaItem[]> {
  const items: MediaItem[] = [];
  let entries: import('fs').Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return items;
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      items.push(...await walkUploads(fullPath, relativePath));
      continue;
    }
    if (!isImageFilename(entry.name)) continue;
    try {
      const stat = await fs.stat(fullPath);
      if (!stat.isFile()) continue;
      items.push({
        url: `${UPLOAD_URL_PREFIX}${relativePath.replace(/\\/g, '/')}`,
        filename: relativePath.replace(/\\/g, '/'),
        size: stat.size,
        createdAt: stat.mtime.toISOString(),
      });
    } catch {
      // skip unreadable files
    }
  }

  return items;
}

async function listUploads(): Promise<MediaItem[]> {
  const byPath = new Map<string, MediaItem>();
  for (const dir of uploadDirs()) {
    await fs.mkdir(dir, { recursive: true });
    for (const item of await walkUploads(dir)) {
      byPath.set(item.filename, item);
    }
  }
  return Array.from(byPath.values()).sort(
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