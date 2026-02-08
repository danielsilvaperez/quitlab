'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

// Urge Surfing Timer Component
function UrgeTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [breathPhase, setBreathPhase] = useState<'in' | 'hold' | 'out'>('in');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
        // 4-7-8 breathing cycle based on seconds
        const cycle = (time % 19);
        if (cycle < 4) setBreathPhase('in');
        else if (cycle < 11) setBreathPhase('hold');
        else setBreathPhase('out');
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-lg bg-blue-50 p-6">
      <h3 className="mb-4 text-lg font-semibold text-blue-900">Urge Surfing Timer</h3>
      <p className="mb-4 text-sm text-blue-700">
        Cravings typically peak and pass within 20-30 minutes. Ride the wave.
      </p>
      
      {isRunning && (
        <div className="mb-4 text-center">
          <div className="text-6xl font-bold text-blue-600">{formatTime(time)}</div>
          <div className="mt-2 text-lg text-blue-800">
            {breathPhase === 'in' && 'Breathe In...'}
            {breathPhase === 'hold' && 'Hold...'}
            {breathPhase === 'out' && 'Breathe Out...'}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          {isRunning ? 'Pause' : 'Start Timer'}
        </button>
        {time > 0 && (
          <button
            onClick={() => { setIsRunning(false); setTime(0); }}
            className="rounded-md border border-blue-300 px-4 py-2 text-blue-700 hover:bg-blue-100"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

// Trigger Log Component
function TriggerLog() {
  const [triggers, setTriggers] = useState<{ trigger: string; intensity: number; id: string }[]>([]);
  const [newTrigger, setNewTrigger] = useState('');
  const [intensity, setIntensity] = useState(5);

  const addTrigger = () => {
    if (!newTrigger.trim()) return;
    setTriggers([...triggers, { trigger: newTrigger, intensity, id: Date.now().toString() }]);
    setNewTrigger('');
    setIntensity(5);
  };

  return (
    <div className="rounded-lg border border-zinc-200 p-6">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900">Trigger Log</h3>
      
      <div className="mb-4 space-y-3">
        <input
          type="text"
          value={newTrigger}
          onChange={(e) => setNewTrigger(e.target.value)}
          placeholder="What triggered you?"
          className="block w-full rounded-md border border-zinc-300 px-3 py-2"
        />
        <div>
          <label className="text-sm text-zinc-600">Intensity (1-10)</label>
          <input
            type="range"
            min="1"
            max="10"
            value={intensity}
            onChange={(e) => setIntensity(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-center font-medium text-zinc-700">{intensity}</div>
        </div>
        <button
          onClick={addTrigger}
          className="w-full rounded-md bg-zinc-800 px-4 py-2 text-white hover:bg-zinc-900"
        >
          Log Trigger
        </button>
      </div>

      <div className="space-y-2">
        {triggers.map((t) => (
          <div key={t.id} className="rounded-md bg-zinc-50 p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-zinc-900">{t.trigger}</span>
              <span className="rounded-full bg-red-100 px-2 py-1 text-sm text-red-700">
                {t.intensity}/10
              </span>
            </div>
          </div>
        ))}
        {triggers.length === 0 && (
          <p className="text-center text-sm text-zinc-500">No triggers logged yet</p>
        )}
      </div>
    </div>
  );
}

// If-Then Planner Component
function IfThenPlanner() {
  const [plans, setPlans] = useState<{ trigger: string; action: string; id: string }[]>([]);
  const [trigger, setTrigger] = useState('');
  const [action, setAction] = useState('');

  const addPlan = () => {
    if (!trigger.trim() || !action.trim()) return;
    setPlans([...plans, { trigger, action, id: Date.now().toString() }]);
    setTrigger('');
    setAction('');
  };

  return (
    <div className="rounded-lg border border-zinc-200 p-6">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900">If-Then Planner</h3>
      <p className="mb-4 text-sm text-zinc-600">
        Create implementation intentions: &quot;If [trigger], then I will [action]&quot;
      </p>
      
      <div className="mb-4 space-y-3">
        <input
          type="text"
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="If... (trigger situation)"
          className="block w-full rounded-md border border-zinc-300 px-3 py-2"
        />
        <input
          type="text"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="Then I will... (coping action)"
          className="block w-full rounded-md border border-zinc-300 px-3 py-2"
        />
        <button
          onClick={addPlan}
          className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Add Plan
        </button>
      </div>

      <div className="space-y-3">
        {plans.map((p) => (
          <div key={p.id} className="rounded-md bg-green-50 p-3">
            <p className="text-sm text-green-900">
              <span className="font-semibold">If</span> {p.trigger}
            </p>
            <p className="text-sm text-green-900">
              <span className="font-semibold">Then</span> {p.action}
            </p>
          </div>
        ))}
        {plans.length === 0 && (
          <p className="text-center text-sm text-zinc-500">No plans created yet</p>
        )}
      </div>
    </div>
  );
}

// Reasons/Values Component
function ReasonsList() {
  const [reasons, setReasons] = useState<string[]>([
    'Better health',
    'Save money',
    'More energy',
  ]);
  const [newReason, setNewReason] = useState('');

  const addReason = () => {
    if (!newReason.trim()) return;
    setReasons([...reasons, newReason]);
    setNewReason('');
  };

  return (
    <div className="rounded-lg border border-zinc-200 p-6">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900">Your Reasons</h3>
      <p className="mb-4 text-sm text-zinc-600">
        Remember why you&apos;re doing this. Add your personal motivations.
      </p>
      
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
          placeholder="Add a reason..."
          className="flex-1 rounded-md border border-zinc-300 px-3 py-2"
          onKeyDown={(e) => e.key === 'Enter' && addReason()}
        />
        <button
          onClick={addReason}
          className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {reasons.map((reason, i) => (
          <li key={i} className="flex items-center gap-2 text-zinc-700">
            <span className="text-purple-600">✓</span>
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ToolsPage() {
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

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900">Tools</h1>
        <p className="mb-8 text-zinc-600">
          Evidence-informed techniques to help you manage cravings and stay on track
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <UrgeTimer />
          <TriggerLog />
          <IfThenPlanner />
          <ReasonsList />
        </div>

        <div className="mt-8 rounded-lg bg-amber-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-amber-900">Lapse Recovery</h3>
          <p className="text-amber-800">
            Remember: A slip is not a relapse. If you used, don&apos;t give up. 
            Use it as a learning opportunity. Get back on your plan right away.
          </p>
          <div className="mt-4 flex gap-3">
            <a
              href="/checkin"
              className="rounded-md bg-amber-600 px-4 py-2 text-white hover:bg-amber-700"
            >
              Log it and Move On
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
