'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { saveToken } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AUTH_BASE } from '@/lib/config';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
       const startTime = Date.now();

      const res = await fetch(`${AUTH_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log('Login response:', data);

      const elapsed = Date.now() - startTime;
      const waitTime = elapsed < 2000 ? 2000 - elapsed : 0;
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      if (!res.ok) {

        const message =
          Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Login failed';
        setError(message);
        setLoading(false);
        return;
      }

      if (!data.accessToken) {
        setError('Login failed: No access token received');
        setLoading(false);
        return;
      }

      try {
        saveToken(data.accessToken);
      } catch (err) {
        console.error('Error saving token:', err);
        setError('Could not save login session');
        setLoading(false);
        return;
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to reach server. Please try again.');
      setLoading(false);
    }
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
            Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="peer pt-8 pb-3 px-3 border-b rounded w-full placeholder-transparent focus:outline-none text-white"
              />
              <label className="absolute left-3 top-2 pb-2 text-gray-400 transition-all duration-200 transform origin-left
      peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:text-sm peer-focus:text-white
      hover:-translate-y-1 hover:text-white">
                Username or Email
              </label>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="peer pt-8 pb-2 px-3 border-b rounded w-full placeholder-transparent focus:outline-none text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">
                {showPassword ? 'Hide' : 'Show'}
              </button>
              <label className="absolute left-3 top-2 text-gray-400 transition-all duration-200 transform origin-left
      peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:text-sm peer-focus:text-white
      hover:-translate-y-1 hover:text-white">
                Password
              </label>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

           <Button
              className="w-full cursor-pointer flex justify-center items-center"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2 animate-bounce">
                  🤖 Loading...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </form>

          <div className="flex justify-center">
            <Button
              variant="link"
              className="flex mt-2 w-[30%] text-gray-500 cursor-pointer"
              onClick={() => router.push('/register')}>
              Create new account
            </Button>

            <Button
              variant="link"
              className="flex mt-2 w-[30%] text-gray-500 justify-center item-center cursor-pointer"
              onClick={() => router.push('/')}>
              Home
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
