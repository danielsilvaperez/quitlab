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
  const report = await prisma.report.create({
    data: {
      reporterId: (session.user as { id: string }).id,
      postId: data.postId,
      commentId: data.commentId,
      reason: data.reason,
    },
  });

  return NextResponse.json(report);
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Return pending reports (for moderation queue)
  const reports = await prisma.report.findMany({
    where: { status: 'pending' },
    include: {
      post: true,
      comment: true,
      reporter: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(reports);
}
