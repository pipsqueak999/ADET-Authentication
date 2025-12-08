'use client';

import { useRouter } from 'next/navigation';
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AUTH_BASE } from '@/lib/config';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const router = useRouter();

  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // <-- loading state

  async function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true); // start loading

    if (!username || !password || !email || !sex || age === null) {
      setError('Please fill in all fields');
      setLoading(false); // stop loading
      return;
    }

    try {
      // Ensure loading lasts at least 2 seconds
      const startTime = Date.now();

      const res = await fetch(`${AUTH_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname,
          username,
          password,
          email,
          sex: sex.toLowerCase(),
          age,
        }),
      });

      const data = await res.json();
      const elapsed = Date.now() - startTime;
      const waitTime = elapsed < 2000 ? 2000 - elapsed : 0;
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      if (!res.ok) {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return;
      }

      router.push('/login');
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
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
        className="absolute top-0 left-0 w-full h-full object-cover z-0 brightness-50"
      >
        <source src="bg-vid.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      <div className="flex justify-start w-130 h-130 z-30">
        <img src="matribot.png" alt="matribot" />
      </div>

      <Card className="w-full max-w-lg p-6 z-30 backdrop-blur-xl bg-white/10 ">
        <CardContent>
          <h1 className="flex text-3xl font-bold text-[#1322A3] mb-5 justify-center">
            Create New Account
          </h1>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Fullname */}
            <div className="relative">
              <input
                type="text"
                placeholder="James Bond"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className="peer pt-6 pb-2 px-3 border-b rounded w-full placeholder-transparent focus:outline-none text-white"
              />
              <label className="absolute left-3 top-2 text-gray-400 transition-all duration-200 transform origin-left
    peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
    peer-focus:top-0 peer-focus:text-sm peer-focus:text-white
    hover:-translate-y-1 hover:text-white">
                Fullname
              </label>
            </div>

            {/* Username */}
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="peer pt-6 pb-2 px-3 border-b rounded w-full placeholder-transparent focus:outline-none text-white"
              />
              <label className="absolute left-3 top-2 text-gray-400 transition-all duration-200 transform origin-left
      peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:text-sm peer-focus:text-white
      hover:-translate-y-1 hover:text-white">
                Username
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="peer pt-6 pb-2 px-3 border-b rounded w-full placeholder-transparent focus:outline-none text-white"
              />
              <label className="absolute left-3 top-2 text-gray-400 transition-all duration-200 transform origin-left
      peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:text-sm peer-focus:text-white
      hover:-translate-y-1 hover:text-white">
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="peer pt-6 pb-2 px-3 border-b rounded w-full placeholder-transparent focus:outline-none text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              <label className="absolute left-3 top-2 text-gray-400 transition-all duration-200 transform origin-left
      peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
      peer-focus:top-0 peer-focus:text-sm peer-focus:text-white
      hover:-translate-y-1 hover:text-white">
                Password
              </label>
            </div>

            {/* Sex and Age */}
            <div className="flex gap-4">
              <Select value={sex} onValueChange={setSex}>
                <SelectTrigger className="w-[50%] text-white cursor-pointer">
                  <SelectValue placeholder="Sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={age !== null ? age.toString() : ''}
                onValueChange={(value) => setAge(Number(value))}
              >
                <SelectTrigger className="w-[50%] text-white cursor-pointer">
                  <SelectValue placeholder="Age" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 88 }, (_, i) => (
                    <SelectItem key={i} value={(i + 13).toString()}>
                      {i + 13}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button className="w-full cursor-pointer flex justify-center items-center" type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2 animate-bounce">
                  🤖 Loading...
                </span>
              ) : (
                'Register'
              )}
            </Button>
          </form>

          <div className="flex justify-center gap-4 mt-2">
            <Button
              variant="link"
              className="text-gray-500 cursor-pointer"
              onClick={() => router.push('/login')}
            >
              Back to Login
            </Button>

            <Button
              variant="link"
              className="text-gray-500 cursor-pointer"
              onClick={() => router.push('/')}
            >
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
