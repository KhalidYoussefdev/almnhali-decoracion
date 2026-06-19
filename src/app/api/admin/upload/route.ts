import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { isAdminAuthenticated } from '@/lib/auth';
import {
  UPLOAD_DIR,
  UPLOAD_URL_PREFIX,
  getImageExtension,
  isAllowedImageUpload,
} from '@/lib/media';

const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 });
  }

  const file = formData.get('file');

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!isAllowedImageUpload(file)) {
    return NextResponse.json({ error: 'Invalid file type. Use JPG, PNG, WebP, GIF, or SVG.' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Max 5 MB.' }, { status: 400 });
  }

  const ext = getImageExtension(file.name) ?? 'jpg';
  const safeExt = ext === 'jpeg' ? 'jpg' : ext;
  const filename = `${Date.now()}-${randomBytes(6).toString('hex')}.${safeExt}`;

  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  } catch (err) {
    console.error('Upload write failed:', err);
    return NextResponse.json(
      { error: 'Could not save file on server. Check folder permissions.' },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: `${UPLOAD_URL_PREFIX}${filename}` });
}