import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const plans = await prisma.quitPlan.findMany({
    where: { userId: (session.user as { id: string }).id },
  });

  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const plan = await prisma.quitPlan.create({
    data: {
      userId: (session.user as { id: string }).id,
      substance: data.substance,
      planType: data.planType,
      quitDate: data.quitDate ? new Date(data.quitDate) : null,
      dailyTarget: data.dailyTarget,
      dailyCostBefore: data.dailyCostBefore,
    },
  });

  return NextResponse.json(plan);
}
