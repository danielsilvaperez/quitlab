'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const crisisResources = [
  {
    name: '988 Suicide & Crisis Lifeline',
    phone: '988',
    description: '24/7, free and confidential support for people in distress',
    url: 'https://988lifeline.org',
  },
  {
    name: 'Crisis Text Line',
    phone: 'Text HOME to 741741',
    description: 'Free, 24/7 crisis support via text message',
    url: 'https://www.crisistextline.org',
  },
  {
    name: 'SAMHSA National Helpline',
    phone: '1-800-662-HELP (4357)',
    description: 'Free, confidential, 24/7 treatment referral for substance use disorders',
    url: 'https://www.samhsa.gov/find-help/national-helpline',
  },
  {
    name: 'Emergency Services',
    phone: '911',
    description: 'For medical emergencies, severe withdrawal, or immediate danger',
    url: null,
  },
];

const contentRules = [
  'Be supportive and respectful to all community members',
  'No selling, trading, or procurement of substances',
  'No advice on how to use substances more effectively',
  'No harassment, bullying, or hate speech',
  'No graphic descriptions of substance use',
  'Encourage help-seeking for serious issues',
  'Report concerning content to moderators',
];

const warningSigns = [
  'Severe withdrawal symptoms (seizures, hallucinations, delirium)',
  'Suicidal thoughts or self-harm urges',
  'Chest pain or difficulty breathing',
  'Severe dehydration or inability to keep fluids down',
  'Extreme agitation or confusion',
];

export default function SafetyPage() {
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
    <div className="min-h-screen bg-zinc-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-zinc-900">QuitLab</h1>
          <div className="flex gap-4">
            <a href="/dashboard" className="text-zinc-600 hover:text-zinc-900">Dashboard</a>
            <a href="/checkin" className="text-zinc-600 hover:text-zinc-900">Check-in</a>
            <a href="/tools" className="text-zinc-600 hover:text-zinc-900">Tools</a>
            <a href="/community" className="text-zinc-600 hover:text-zinc-900">Community</a>
            <a href="/safety" className="text-blue-600 hover:underline">Safety</a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="mb-2 text-2xl font-bold text-zinc-900">Safety Resources</h2>
        <p className="mb-8 text-zinc-600">
          Your wellbeing comes first. Know when and how to get help.
        </p>

        {/* Crisis Resources */}
        <section className="mb-8">
          <h3 className="mb-4 text-xl font-semibold text-zinc-900">Crisis Resources</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {crisisResources.map((resource) => (
              <div
                key={resource.name}
                className="rounded-lg border-2 border-red-100 bg-red-50 p-4"
              >
                <h4 className="font-semibold text-red-900">{resource.name}</h4>
                <p className="text-lg font-bold text-red-700">{resource.phone}</p>
                <p className="mt-1 text-sm text-red-800">{resource.description}</p>
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-red-700 hover:underline"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* When to Seek Help */}
        <section className="mb-8 rounded-lg bg-amber-50 p-6">
          <h3 className="mb-4 text-xl font-semibold text-amber-900">
            When to Seek Emergency Help
          </h3>
          <p className="mb-4 text-amber-800">
            Some withdrawal symptoms can be life-threatening. Seek immediate medical attention if you experience:
          </p>
          <ul className="space-y-2">
            {warningSigns.map((sign) => (
              <li key={sign} className="flex items-start gap-2 text-amber-800">
                <span className="text-amber-600">⚠️</span>
                {sign}
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-md bg-white p-4">
            <p className="font-semibold text-amber-900">
              If you&apos;re unsure, it&apos;s always better to call for help.
            </p>
          </div>
        </section>

        {/* Content Rules */}
        <section className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-semibold text-zinc-900">Community Content Rules</h3>
          <p className="mb-4 text-zinc-600">
            To keep our community safe and supportive, please follow these guidelines:
          </p>
          <ul className="space-y-2">
            {contentRules.map((rule) => (
              <li key={rule} className="flex items-start gap-2 text-zinc-700">
                <span className="text-green-600">✓</span>
                {rule}
              </li>
            ))}
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="rounded-lg border border-zinc-200 bg-zinc-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-zinc-900">Medical Disclaimer</h3>
          <p className="text-sm text-zinc-600">
            QuitLab provides educational and self-help tools only. This is not medical advice, 
            diagnosis, or treatment. Always seek the advice of your physician or other qualified 
            health provider with any questions you may have regarding a medical condition or 
            substance use disorder.
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            Never disregard professional medical advice or delay in seeking it because of 
            something you have read or accessed through this application.
          </p>
        </section>

        {/* Auto-Detection Notice */}
        <section className="mt-8 rounded-lg bg-blue-50 p-6">
          <h3 className="mb-2 text-lg font-semibold text-blue-900">Content Monitoring</h3>
          <p className="text-sm text-blue-800">
            Our community uses automated detection for concerning keywords related to self-harm, 
            medical crisis, or dangerous behavior. If such content is detected, appropriate 
            resources will be suggested and moderators will be notified.
          </p>
        </section>
      </main>
    </div>
  );
}
