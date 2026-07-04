import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserByEmail } from '@/lib/user-store';
import {
  createSessionToken,
  customerCookieOptions,
  toPublicUser,
  verifyPassword,
} from '@/lib/customer-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = createSessionToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set(customerCookieOptions(token));

    return NextResponse.json({ user: toPublicUser(user), token });
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}