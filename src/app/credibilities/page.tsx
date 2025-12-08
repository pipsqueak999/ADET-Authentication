'use client';

import React, { useEffect, useState } from 'react';
import { getToken, logoutUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

import { API_BASE } from '@/lib/config';

interface Certificate {
    cert_id?: number;         
    cert_code: string;        
    cert_title: string;       
}

export default function DashboardPage() {
    const router = useRouter();

    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [certCode, setCertCode] = useState('');
    const [certTitle, setCertTitle] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        const token = getToken();
        if (!token) router.push('/login');
        fetchCertificates();
    }, []);

    function authHeaders() {
        const token = getToken();
        return {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
        };
    }

    async function fetchCertificates() {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE}/certificates`, {
                method: 'GET',
                headers: authHeaders(),
            });

            if (res.status === 401) {
                logoutUser();
                router.push('/login');
                return;
            }

            if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);

            const data = await res.json();
            setCertificates(data);
        } catch (e: any) {
            setError(e?.message || 'Failed to fetch certificates');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateOrUpdate(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const payload: Certificate = {
            cert_code: certCode,
            cert_title: certTitle,
        };

        try {
            let res: Response;

            if (editingId) {
                res = await fetch(`${API_BASE}/certificates/${editingId}`, {
                    method: 'PUT',
                    headers: authHeaders(),
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch(`${API_BASE}/certificates`, {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) throw new Error('Save failed');

            setCertCode('');
            setCertTitle('');
            setEditingId(null);

            await fetchCertificates();
        } catch (e: any) {
            setError(e?.message || 'Save failed');
        }
    }

    function startEdit(c: Certificate) {
        setEditingId(c.cert_id ?? null);
        setCertCode(c.cert_code);
        setCertTitle(c.cert_title);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function handleDelete(id?: number) {
        if (!id) return;
        if (!confirm('Delete this certificate?')) return;

        try {
            const res = await fetch(`${API_BASE}/certificates/${id}`, {
                method: 'DELETE',
                headers: authHeaders(),
            });

            if (!res.ok) throw new Error('Delete failed');

            await fetchCertificates();
        } catch (e: any) {
            setError(e?.message || 'Delete failed');
        }
    }

    function handleCancelEdit() {
        setEditingId(null);
        setCertCode('');
        setCertTitle('');
    }

    function handleLogout() {
        logoutUser();
        router.push('/login');
    }

    return (
        <div className="min-h-screen bg-white/20 p-6 relative">
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover brightness-50 z-0"
            >
                <source src="bg-vid.mp4" type="video/mp4" />
            </video>

            {/* Layout wrapper to push content right */}
            <div className="relative z-10 flex">
                {/* Left-side panel */}
                <div className="fixed left-0 top-0 h-full w-80 bg-white/20 backdrop-blur-md shadow-lg p-6 flex flex-col justify-between z-20">
                    {/* Top section: form */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">
                            {editingId ? 'Edit Certificate' : 'Add Certificate'}
                        </h2>

                        <form onSubmit={handleCreateOrUpdate} className="flex flex-col gap-4">
                            <Input
                                placeholder="Certificate Code"
                                value={certCode}
                                onChange={(e) => setCertCode(e.target.value)}
                                required
                            />
                            <Input
                                placeholder="Certificate Title"
                                value={certTitle}
                                onChange={(e) => setCertTitle(e.target.value)}
                                required
                            />

                            <Button
                                type="submit"
                                className="mt-2 bg-cyan-500 hover:bg-cyan-600 text-white transition-colors duration-300"
                            >
                                {editingId ? 'Update' : 'Create'}
                            </Button>

                            {editingId && (
                                <Button variant="outline" onClick={handleCancelEdit}>
                                    Cancel
                                </Button>
                            )}

                            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                        </form>
                    </div>

                    {/* Bottom buttons */}
                    <div className="mt-auto flex flex-col gap-2">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push('/dashboard')}
                        >
                            Back to Dashboard
                        </Button>

                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={fetchCertificates}
                        >
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* MAIN CONTENT (pushed to the right) */}
                <div className="ml-80 w-full px-6">
                    <section className="mt-4">
                        <h2 className="text-xl text-white font-bold mb-6 text-center">
                            Certificates {loading && ' (loading...)'}
                        </h2>

                        {certificates.length === 0 && !loading && (
                            <p className="text-slate-300 text-center py-10">
                                No certificates found.
                            </p>
                        )}

                        {/* Certificates Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                            {certificates.map((c) => (
                                <Card
                                    key={c.cert_id}
                                    className="shadow-xl bg-white/80 backdrop-blur rounded-lg"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-center text-2xl font-bold">
                                            {c.cert_title}
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent>
                                        <p className="text-sm text-center text-muted-foreground">
                                            Code: <strong>{c.cert_code}</strong>
                                        </p>
                                    </CardContent>

                                    <CardFooter className="flex justify-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => startEdit(c)}
                                        >
                                            Edit
                                        </Button>

                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(c.cert_id)}
                                        >
                                            Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>

    );
}
