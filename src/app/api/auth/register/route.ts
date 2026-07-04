import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createUser, getUserByEmail } from '@/lib/user-store';
import { createSessionToken, customerCookieOptions, toPublicUser } from '@/lib/customer-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim().toLowerCase();
    const phone = body.phone ? String(body.phone).trim() : undefined;
    const password = String(body.password ?? '');
    const confirmPassword = String(body.confirmPassword ?? body.password ?? '');

    if (!name || name.length < 2) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const user = await createUser({ name, email, phone, password });
    const token = createSessionToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set(customerCookieOptions(token));

    return NextResponse.json({ user: toPublicUser(user), token });
  } catch {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}