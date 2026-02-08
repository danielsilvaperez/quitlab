import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await req.json();
  const block = await prisma.block.create({
    data: {
      blockerId: (session.user as { id: string }).id,
      blockedId: data.blockedId,
    },
  });

  return NextResponse.json(block);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const blocks = await prisma.block.findMany({
    where: { blockerId: (session.user as { id: string }).id },
    include: {
      blocked: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json(blocks);
}
