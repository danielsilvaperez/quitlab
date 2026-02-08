'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { setDemoMode, isDemoMode } from '@/lib/demo';

export default function Home() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [demo, setDemo] = useState(false);

  useEffect(() => {
    setDemo(isDemoMode());
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (session || demo) {
    redirect('/dashboard');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard',
    });
  };

  const startDemo = () => {
    setDemoMode(true);
    setDemo(true);
    redirect('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-2 text-center text-3xl font-bold text-zinc-900">
          QuitLab
        </h1>
        <p className="mb-6 text-center text-zinc-600">
          Evidence-informed tools to help you reduce or quit
        </p>
        
        <div className="mb-6 rounded-md bg-blue-50 p-4 text-sm text-blue-800">
          <p className="font-medium">Disclaimer:</p>
          <p>
            This app provides educational and self-help tools, not medical advice. 
            If you&apos;re experiencing severe withdrawal or a medical emergency, 
            please seek professional help immediately.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 border-t border-zinc-200 pt-4">
          <button
            onClick={startDemo}
            className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            🎮 View Demo (No Login Required)
          </button>
          <p className="mt-2 text-center text-xs text-zinc-400">
            Preview the app with sample data
          </p>
        </div>

        <p className="mt-4 text-center text-sm text-zinc-500">
          Or sign in with any email and password to create an account
        </p>
      </div>
    </div>
  );
}
