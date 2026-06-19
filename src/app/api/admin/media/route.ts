import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { isAdminAuthenticated } from '@/lib/auth';
import { UPLOAD_DIR, UPLOAD_URL_PREFIX, isImageFilename, uploadUrlToFilename } from '@/lib/media';

export interface MediaItem {
  url: string;
  filename: string;
  size: number;
  createdAt: string;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  let entries: string[];
  try {
    entries = await fs.readdir(UPLOAD_DIR);
  } catch {
    return NextResponse.json([]);
  }

  const items: MediaItem[] = [];

  for (const filename of entries) {
    if (filename.startsWith('.') || !isImageFilename(filename)) continue;
    const filePath = path.join(UPLOAD_DIR, filename);
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) continue;
    items.push({
      url: `${UPLOAD_URL_PREFIX}${filename}`,
      filename,
      size: stat.size,
      createdAt: stat.mtime.toISOString(),
    });
  }

  items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(items);
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

  const filePath = path.join(UPLOAD_DIR, filename);
  try {
    await fs.unlink(filePath);
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}