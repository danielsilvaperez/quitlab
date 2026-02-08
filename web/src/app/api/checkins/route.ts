import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const checkIns = await prisma.dailyCheckIn.findMany({
    where: { userId: (session.user as { id: string }).id },
    orderBy: { date: 'desc' },
  });

  return NextResponse.json(checkIns);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const checkIn = await prisma.dailyCheckIn.create({
    data: {
      userId: (session.user as { id: string }).id,
      cravings: data.cravings,
      used: data.used,
      amount: data.amount,
      mood: data.mood,
      sleep: data.sleep,
      triggers: data.triggers,
      notes: data.notes,
    },
  });

  return NextResponse.json(checkIn);
}
