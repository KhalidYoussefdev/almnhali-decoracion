import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getSettings, saveSettings } from '@/lib/data-store';
import type { SiteSettings } from '@/types/product';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json(await getSettings());
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const settings = (await req.json()) as SiteSettings;
  await saveSettings(settings);
  return NextResponse.json(settings);
}