'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';

const substances = [
  { id: 'nicotine', name: 'Cigarettes/Nicotine', icon: '🚬' },
  { id: 'marijuana', name: 'Marijuana/Cannabis', icon: '🌿' },
  { id: 'vaping', name: 'Vaping/E-cigarettes', icon: '💨' },
];

const planTypes = [
  { id: 'cold_turkey', name: 'Cold Turkey', description: 'Stop completely on a set date' },
  { id: 'gradual_reduction', name: 'Gradual Reduction', description: 'Reduce use over time' },
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedSubstance, setSelectedSubstance] = useState('');
  const [planType, setPlanType] = useState('');
  const [quitDate, setQuitDate] = useState('');
  const [dailyTarget, setDailyTarget] = useState('');
  const [dailyCost, setDailyCost] = useState('');

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

  const handleSubstanceSelect = (id: string) => {
    setSelectedSubstance(id);
  };

  const handlePlanSelect = (id: string) => {
    setPlanType(id);
  };

  const handleNext = () => {
    if (step === 1 && selectedSubstance) {
      setStep(2);
    } else if (step === 2 && planType) {
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    // Create quit plan via API
    const response = await fetch('/api/quit-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        substance: selectedSubstance,
        planType,
        quitDate: planType === 'cold_turkey' ? quitDate : null,
        dailyTarget: planType === 'gradual_reduction' ? parseFloat(dailyTarget) : null,
        dailyCostBefore: parseFloat(dailyCost) || 0,
      }),
    });

    if (response.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 shadow-md">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">Step {step} of 3</span>
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded-full ${
                    i <= step ? 'bg-blue-600' : 'bg-zinc-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">
            {step === 1 && 'What are you looking to quit?'}
            {step === 2 && 'Choose your approach'}
            {step === 3 && 'Set your plan details'}
          </h1>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            {substances.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleSubstanceSelect(sub.id)}
                className={`flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors ${
                  selectedSubstance === sub.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <span className="text-2xl">{sub.icon}</span>
                <span className="font-medium text-zinc-900">{sub.name}</span>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {planTypes.map((plan) => (
              <button
                key={plan.id}
                onClick={() => handlePlanSelect(plan.id)}
                className={`flex w-full flex-col rounded-lg border-2 p-4 text-left transition-colors ${
                  planType === plan.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <span className="font-medium text-zinc-900">{plan.name}</span>
                <span className="text-sm text-zinc-600">{plan.description}</span>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            {planType === 'cold_turkey' && (
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Quit Date
                </label>
                <input
                  type="date"
                  value={quitDate}
                  onChange={(e) => setQuitDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2"
                  required
                />
              </div>
            )}
            {planType === 'gradual_reduction' && (
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Daily Target (amount)
                </label>
                <input
                  type="number"
                  value={dailyTarget}
                  onChange={(e) => setDailyTarget(e.target.value)}
                  placeholder="e.g., 5"
                  className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Average Daily Cost ($)
              </label>
              <input
                type="number"
                value={dailyCost}
                onChange={(e) => setDailyCost(e.target.value)}
                placeholder="e.g., 10"
                className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2"
              />
              <p className="mt-1 text-sm text-zinc-500">
                Used to calculate money saved
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-zinc-700 hover:bg-zinc-50"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedSubstance) || (step === 2 && !planType)
              }
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-zinc-300"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={
                (planType === 'cold_turkey' && !quitDate) ||
                (planType === 'gradual_reduction' && !dailyTarget)
              }
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-zinc-300"
            >
              Create Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
