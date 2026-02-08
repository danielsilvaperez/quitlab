'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const rooms = [
  { id: 'nicotine', name: 'Nicotine/Cigarettes', icon: '🚬' },
  { id: 'marijuana', name: 'Marijuana', icon: '🌿' },
  { id: 'vaping', name: 'Vaping', icon: '💨' },
];

// Mock posts for demo
const mockPosts = [
  {
    id: '1',
    author: 'Alex',
    content: 'Day 5 without nicotine! The cravings are getting easier to manage.',
    createdAt: '2 hours ago',
    reactions: { support: 5, celebrate: 3 },
  },
  {
    id: '2',
    author: 'Sam',
    content: 'Had a rough day yesterday and slipped up. But I\'m not giving up. Back on track today!',
    createdAt: '5 hours ago',
    reactions: { support: 8, celebrate: 2 },
  },
  {
    id: '3',
    author: 'Jordan',
    content: 'The urge surfing timer really helps. 20 minutes really does make a difference.',
    createdAt: '1 day ago',
    reactions: { support: 4, celebrate: 1 },
  },
];

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const [activeRoom, setActiveRoom] = useState('nicotine');
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState(mockPosts);
  const [reporting, setReporting] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');

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

  const handlePost = () => {
    if (!newPost.trim()) return;
    const post = {
      id: Date.now().toString(),
      author: session.user?.name || 'Anonymous',
      content: newPost,
      createdAt: 'Just now',
      reactions: { support: 0, celebrate: 0 },
    };
    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleReport = (postId: string) => {
    setReporting(postId);
  };

  const submitReport = async () => {
    if (!reporting || !reportReason) return;
    
    // Call API to submit report
    await fetch('/api/community/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postId: reporting,
        reason: reportReason,
      }),
    });

    setReporting(null);
    setReportReason('');
    alert('Report submitted. Thank you for helping keep the community safe.');
  };

  const handleBlock = async (userId: string) => {
    if (confirm('Are you sure you want to block this user?')) {
      await fetch('/api/community/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedId: userId }),
      });
      alert('User blocked.');
    }
  };

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
            <a href="/community" className="text-blue-600 hover:underline">Community</a>
            <a href="/safety" className="text-zinc-600 hover:text-zinc-900">Safety</a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900">Community</h2>

        {/* Room Tabs */}
        <div className="mb-6 flex gap-2">
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                activeRoom === room.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              <span>{room.icon}</span>
              {room.name}
            </button>
          ))}
        </div>

        {/* New Post */}
        <div className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your progress, ask for support, or offer encouragement..."
            rows={3}
            className="block w-full rounded-md border border-zinc-300 px-3 py-2"
          />
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-zinc-500">
              Be supportive. No selling substances. Keep it safe.
            </p>
            <button
              onClick={handlePost}
              disabled={!newPost.trim()}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-zinc-300"
            >
              Post
            </button>
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-700">
                    {post.author[0].toUpperCase()}
                  </div>
                  <span className="font-medium text-zinc-900">{post.author}</span>
                  <span className="text-sm text-zinc-500">• {post.createdAt}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReport(post.id)}
                    className="text-sm text-zinc-400 hover:text-red-600"
                  >
                    Report
                  </button>
                </div>
              </div>
              <p className="mb-4 text-zinc-700">{post.content}</p>
              <div className="flex gap-3">
                <button className="flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-200">
                  💙 Support ({post.reactions.support})
                </button>
                <button className="flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-200">
                  🎉 Celebrate ({post.reactions.celebrate})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Report Modal */}
        {reporting && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold text-zinc-900">Report Content</h3>
              <p className="mb-4 text-sm text-zinc-600">
                Help us keep the community safe. Why are you reporting this?
              </p>
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="mb-4 block w-full rounded-md border border-zinc-300 px-3 py-2"
              >
                <option value="">Select a reason...</option>
                <option value="harassment">Harassment</option>
                <option value="selling">Selling substances</option>
                <option value="harmful">Harmful advice</option>
                <option value="spam">Spam</option>
                <option value="other">Other</option>
              </select>
              <div className="flex gap-3">
                <button
                  onClick={() => setReporting(null)}
                  className="flex-1 rounded-md border border-zinc-300 px-4 py-2 text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReport}
                  disabled={!reportReason}
                  className="flex-1 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:bg-zinc-300"
                >
                  Report
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
