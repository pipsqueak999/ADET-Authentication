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
        <div  className="bg-[#0d013bff]/60 backdrop-blur-md p-3 shadow-xl bg-[radial-gradient(circle,rgba(30,64,175,0.4)_0%,rgba(10,20,60,1)_80%)]">
            {/* <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Dashboard
                    <Button variant="destructive" onClick={handleLogout} >
                        Logout
                    </Button>
                </h1>
            </header> */}
            {children}
        </div>
    )
}

