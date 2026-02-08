'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const commonTriggers = [
  'Stress',
  'Social situation',
  'Boredom',
  'After meal',
  'With coffee',
  'Driving',
  'Alcohol',
  'Anxiety',
  'Celebration',
  'Sadness',
];

export default function CheckInPage() {
  const { data: session, status } = useSession();
  const [submitted, setSubmitted] = useState(false);
  const [cravings, setCravings] = useState(5);
  const [used, setUsed] = useState(false);
  const [amount, setAmount] = useState('');
  const [mood, setMood] = useState(3);
  const [sleep, setSleep] = useState(7);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

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

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cravings,
        used,
        amount: used ? parseFloat(amount) : 0,
        mood,
        sleep,
        triggers: JSON.stringify(selectedTriggers),
        notes,
      }),
    });

    if (response.ok) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
          <div className="mb-4 text-5xl">✅</div>
          <h1 className="mb-2 text-2xl font-bold text-zinc-900">
            Check-in Complete!
          </h1>
          <p className="mb-6 text-zinc-600">
            Great job tracking your progress today. Every check-in helps you understand your patterns better.
          </p>
          <a
            href="/dashboard"
            className="inline-block rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            View Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900">Daily Check-in</h1>
        <p className="mb-6 text-zinc-600">
          Track your cravings, mood, and progress today
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cravings */}
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Craving Intensity (0-10)
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={cravings}
              onChange={(e) => setCravings(parseInt(e.target.value))}
              className="mt-2 w-full"
            />
            <div className="flex justify-between text-sm text-zinc-500">
              <span>None</span>
              <span className="font-medium text-blue-600">{cravings}</span>
              <span>Extreme</span>
            </div>
          </div>

          {/* Used */}
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Did you use today?
            </label>
            <div className="mt-2 flex gap-4">
              <button
                type="button"
                onClick={() => setUsed(false)}
                className={`flex-1 rounded-md border-2 px-4 py-2 ${
                  !used
                    ? 'border-green-600 bg-green-50 text-green-700'
                    : 'border-zinc-200 text-zinc-700'
                }`}
              >
                No
              </button>
              <button
                type="button"
                onClick={() => setUsed(true)}
                className={`flex-1 rounded-md border-2 px-4 py-2 ${
                  used
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-zinc-200 text-zinc-700'
                }`}
              >
                Yes
              </button>
            </div>
          </div>

          {/* Amount (if used) */}
          {used && (
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Amount used
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 3 cigarettes"
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2"
              />
            </div>
          )}

          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Mood (1-5)
            </label>
            <div className="mt-2 flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMood(val)}
                  className={`flex-1 rounded-md py-2 ${
                    mood === val
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {val === 1 && '😢'}
                  {val === 2 && '😕'}
                  {val === 3 && '😐'}
                  {val === 4 && '🙂'}
                  {val === 5 && '😄'}
                </button>
              ))}
            </div>
          </div>

          {/* Sleep */}
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Hours slept last night
            </label>
            <input
              type="number"
              min="0"
              max="24"
              value={sleep}
              onChange={(e) => setSleep(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </div>

          {/* Triggers */}
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Triggers today
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {commonTriggers.map((trigger) => (
                <button
                  key={trigger}
                  type="button"
                  onClick={() => toggleTrigger(trigger)}
                  className={`rounded-full px-3 py-1 text-sm ${
                    selectedTriggers.includes(trigger)
                      ? 'bg-blue-600 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {trigger}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything else you want to note..."
              rows={3}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Submit Check-in
          </button>
        </form>
      </div>
    </div>
  );
}
