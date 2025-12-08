"use client";

import { useRouter } from "next/navigation";
import { getToken, logoutUser } from "@/lib/auth";

export default function DashboardLogout({ children }: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    const token = getToken();

    if (!token) {
        router.push('/login');
        return null;
    }

    return (
        <div className="bg-[#0d013bff]/60 backdrop-blur-md p-3 shadow-xl bg-[radial-gradient(circle,rgba(30,64,175,0.4)_0%,rgba(10,20,60,1)_80%)]">
            
            {children}
        </div>
    )
}
