"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [roomId, setRoomId] = useState("kanvise-class-101");
  const [username, setUsername] = useState("Student-1");
  const [isHost, setIsHost] = useState(false);
  const router = useRouter();

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/class/${roomId}?username=${encodeURIComponent(username)}&isHost=${isHost}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md bg-surface border border-outline/20 p-8 rounded-xl shadow-[0_12px_32px_rgba(46,40,119,0.12)]">
        <h1 className="text-2xl font-bold text-primary mb-2 tracking-tight">Kanvise LMS</h1>
        <p className="text-on-surface-variant text-sm mb-8">Join a live classroom session.</p>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Room ID</label>
            <input 
              type="text" 
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-white border border-outline/40 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-outline mb-1">Your Name</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border border-outline/40 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              required
            />
          </div>

          <label className="flex items-center gap-2 pt-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={isHost}
              onChange={(e) => setIsHost(e.target.checked)}
              className="w-4 h-4 rounded border-outline text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-foreground">Join as Host (Teacher)</span>
          </label>

          <button 
            type="submit" 
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-3 rounded-lg mt-6 transition-colors shadow-sm"
          >
            Join Classroom
          </button>
        </form>
      </div>
    </div>
  );
}
