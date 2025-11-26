'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { saveToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import { API_BASE } from '@/lib/config';

import { FormEvent } from 'react';

export default function LoginPage() {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');

    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message || 'Login failed');
      return;
    }

    saveToken(data.accessToken);
    router.push('/dashboard');
  } 

  return (
    <div className="flex items-center justify-center h-screen">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 brightness-50">
        <source src="bg-vid.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      
      <Card className="w-full max-w-lg p-6 z-30 backdrop-blur-xl bg-white/10 ">
        <CardContent>
          <h1 className="flex text-3xl font-bold text-[#1322A3] mb-5 justify-center">
            Email Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="peer pt-6 pb-2 px-3 border-b rounded w-full placeholder-transparent focus:outline-none"
              />
              <label className="absolute left-3 top-2 pb-2 text-gray-400 transition-all duration-200 transform origin-left
      peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:text-sm peer-focus:text-white
      hover:-translate-y-1 hover:text-white">
                Email
              </label>
            </div>

            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="peer pt-6 pb-2 px-3 border-b rounded w-full placeholder-transparent focus:outline-none"
              />
              <label className="absolute left-3 top-2 text-gray-400 transition-all duration-200 transform origin-left
      peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:text-sm peer-focus:text-white
      hover:-translate-y-1 hover:text-white">
                Password
              </label>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button className="w-full" type="submit">Register</Button>
          </form>

          <div className="flex justify-center">
            <Button
              variant="link"
              className="flex mt-2 w-[30%] text-gray-500 justify-center item-center"
              onClick={() => router.push('/login-username')}
            >
              Login using Username
            </Button>

            <Button
              variant="link"
              className="flex mt-2 w-[30%] text-gray-500 justify-center item-center"
              onClick={() => router.push('/register')}
            >
              Create New Account
            </Button>
          </div>

        </CardContent>
      </Card>
      <div className="flex justify-start w-130 h-130 z-30">
        <img src="matribot2.png" alt="matribot" />
      </div>
    </div>
  );
}