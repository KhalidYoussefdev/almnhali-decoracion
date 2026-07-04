import { NextResponse } from 'next/server';
import { getCustomerIdFromRequest, toPublicUser } from '@/lib/customer-auth';
import { getUserById } from '@/lib/user-store';

export async function GET(request: Request) {
  const userId = await getCustomerIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  const user = await getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return NextResponse.json(toPublicUser(user));
}