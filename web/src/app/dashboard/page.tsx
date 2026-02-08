'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

// Mock data for demo
const mockCheckIns = [
  { date: '2026-02-07', cravings: 4, used: false, mood: 4 },
  { date: '2026-02-06', cravings: 6, used: true, amount: 2, mood: 3 },
  { date: '2026-02-05', cravings: 3, used: false, mood: 5 },
  { date: '2026-02-04', cravings: 7, used: false, mood: 3 },
  { date: '2026-02-03', cravings: 5, used: false, mood: 4 },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    redirect('/');
  }

  const streak = 3; // Mock streak
  const daysClean = 3;
  const moneySaved = 45.00; // Mock savings
  const cravingAvg = mockCheckIns.reduce((sum, c) => sum + c.cravings, 0) / mockCheckIns.length;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-zinc-900">QuitLab</h1>
          <div className="flex gap-4">
            <a href="/dashboard" className="text-blue-600 hover:underline">Dashboard</a>
            <a href="/checkin" className="text-zinc-600 hover:text-zinc-900">Check-in</a>
            <a href="/tools" className="text-zinc-600 hover:text-zinc-900">Tools</a>
            <a href="/community" className="text-zinc-600 hover:text-zinc-900">Community</a>
            <a href="/safety" className="text-zinc-600 hover:text-zinc-900">Safety</a>
          </div>
          <span className="text-sm text-zinc-600">{session.user?.name}</span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900">Your Progress</h2>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{streak}</div>
            <div className="text-sm text-zinc-600">Day Streak 🔥</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-green-600">{daysClean}</div>
            <div className="text-sm text-zinc-600">Days Clean</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">${moneySaved.toFixed(2)}</div>
            <div className="text-sm text-zinc-600">Money Saved 💰</div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="text-3xl font-bold text-purple-600">{cravingAvg.toFixed(1)}</div>
            <div className="text-sm text-zinc-600">Avg Craving (0-10)</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Check-ins */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-zinc-900">Recent Check-ins</h3>
            <div className="space-y-3">
              {mockCheckIns.map((checkin, i) => (
                <div key={i} className="flex items-center justify-between rounded-md bg-zinc-50 p-3">
                  <div>
                    <div className="font-medium text-zinc-900">{checkin.date}</div>
                    <div className="text-sm text-zinc-600">
                      Cravings: {checkin.cravings}/10 • Mood: {checkin.mood}/5
                    </div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-sm font-medium ${
                    checkin.used
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {checkin.used ? 'Used' : 'Clean'}
                  </div>
                </div>
              ))}
            </div>
            <a
              href="/checkin"
              className="mt-4 block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
            >
              New Check-in
            </a>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
              <h3 className="mb-2 text-lg font-semibold">Need Support?</h3>
              <p className="mb-4 text-blue-100">
                Connect with others going through the same journey
              </p>
              <a
                href="/community"
                className="inline-block rounded-md bg-white px-4 py-2 font-medium text-blue-600 hover:bg-blue-50"
              >
                Visit Community
              </a>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
              <h3 className="mb-2 text-lg font-semibold">Craving Now?</h3>
              <p className="mb-4 text-green-100">
                Use the urge surfing timer and coping tools
              </p>
              <a
                href="/tools"
                className="inline-block rounded-md bg-white px-4 py-2 font-medium text-green-600 hover:bg-green-50"
              >
                Open Tools
              </a>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 p-6 text-white">
              <h3 className="mb-2 text-lg font-semibold">Safety Resources</h3>
              <p className="mb-4 text-amber-100">
                Crisis support and medical emergency info
              </p>
              <a
                href="/safety"
                className="inline-block rounded-md bg-white px-4 py-2 font-medium text-amber-600 hover:bg-amber-50"
              >
                View Safety Page
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
