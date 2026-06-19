import { NextResponse } from 'next/server';
import { adminCookieOptions, getAdminPassword } from '@/lib/auth';

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  const opts = adminCookieOptions(password);
  res.cookies.set(opts.name, opts.value, opts);
  return res;
}