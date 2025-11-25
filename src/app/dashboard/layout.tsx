"use client";

import { useRouter } from "next/navigation";
import { getToken, logoutUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function DashboardLogout({ children }: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    const token = getToken();

    if (!token) {
        router.push('/login');
        return null;
    }

    function handleLogout() {
        logoutUser();
        router.push('/login');
    }

    return (
        <div className="p-6">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard
                    <Button variant="destructive" onClick={handleLogout} >
                        Logout
                    </Button>
                </h1>
            </header>
            {children}
        </div>
    )
}

