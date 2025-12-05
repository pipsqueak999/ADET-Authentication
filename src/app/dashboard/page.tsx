"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getToken, logoutUser } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker";

interface JwtPayload {
    sub: number;
    username: string;
    fullname: string;
    role: string;
    exp: number;
    iat: number;
}

export default function DashboardHome() {
    const token = getToken();
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');

    useEffect(() => {
        if (!token) {
            setFullname('');
            setUsername('');
            return;
        }

        try {
            // Some APIs return tokens with a 'Bearer ' prefix — strip it if present
            let rawToken = token;
            if (rawToken.startsWith('Bearer ')) rawToken = rawToken.slice(7);

            const decoded = jwtDecode<JwtPayload>(rawToken);
            const nameClaim = (decoded as any).fullname || (decoded as any).fullName || (decoded as any).name || '';
            const usernameClaim = (decoded as any).username || (decoded as any).sub || '';

            setFullname(String(nameClaim));
            setUsername(String(usernameClaim));

            console.debug('Decoded token claims:', { decoded, fullname: nameClaim, username: usernameClaim });
        } catch (e) {
            console.error('Token decoding failed:', e);
            setFullname('');
            setUsername('');
        }
    }, [token]);

    const router = useRouter();

    function handleLogout() {
        logoutUser();
        router.push("/login");
    }

    const [activeIndex, setActiveIndex] = useState(0);

    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(2025, 5, 12),
        to: new Date(2025, 5, 15),
    })

    return (
        <div className="relative flex flex-col min-h-screen justify-start font-sans overflow-hidden inset-0 bg-[#273d87ff]/40 z-10 rounded "> 
            <div className="relative z-10 w-full h-20 bg-white/40 backdrop-blur-lg grid grid-cols-2 grid-rows-1 gap-4 items-center px-4">
                <div className="flex {blackpastFont.className}">
                    <img src="Codesandbox@2x.png" alt="logo" className="flex w-[50px] h-[50px] mt-3 mr-3 z-50 justify-center item-center" />
                    <img src="title.png" alt="matrix" className="z-30 w-[30%] h-[30%] mt-4 " />
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="absolute top-0 left-0 w-[50%] h-full object-cover z-0 brightness-50 [clip-path:polygon(0%_0%,90%_0%,100%_100%,0%_100%)]">
                        <source src="bg-vid.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                </div>

                <div className="flex justify-end">
                    <NavigationMenu>
                        <NavigationMenuList className="grid grid-cols-5 grid-rows-1 gap-4 items-center px-4">

                            {/* CPU Feed */}
                            <NavigationMenuItem>
                                <div
                                    className="relative cursor-pointer"

                                    onClick={() => {
                                        setActiveIndex(0);
                                        document.getElementById("tech")?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                >
                                    <img src="cpu.svg" alt="cpu feed" className="relative w-[50%] h-[50%] z-10 px-2 py-2 ml-7 font-semibold text-purple-700 text-lg" />
                                    <span
                                        className={`absolute inset-0 rounded-full w-[50%] ml-7 transition-all duration-300
                                            ${activeIndex === 0 ? 'scale-100 opacity-100 bg-[#B6EEF0]' : 'scale-0 opacity-0'}`}
                                    ></span>
                                </div>
                            </NavigationMenuItem>

                            {/* Source Code Feed */}
                            <NavigationMenuItem>
                                <div
                                    className="relative cursor-pointer"
                                    onClick={() => {
                                        setActiveIndex(1);
                                        document.getElementById("code")?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                >
                                    <img src="source-code.svg" alt="code feed" className="relative w-[50%] h-[50%] z-10 px-2 py-2 ml-7 font-semibold text-purple-700 text-lg" />
                                    <span
                                        className={`absolute inset-0 rounded-full w-[50%] ml-7 transition-all duration-300
                                            ${activeIndex === 1 ? 'scale-100 opacity-100 bg-[#B6EEF0]' : 'scale-0 opacity-0'}`}
                                    ></span>
                                </div>
                            </NavigationMenuItem>

                            {/* Calendar */}
                            <NavigationMenuItem>
                                <div
                                    className="relative cursor-pointer"
                                    onClick={() => setActiveIndex(2)}
                                ><Popover>
                                        <PopoverTrigger>
                                            <img src="calendar.svg" alt="calendar" className="relative w-[50%] h-[50%] z-10 px-2 py-2 ml-7 font-semibold text-purple-700 text-lg" />
                                            <span
                                                className={`absolute inset-0 rounded-full w-[50%] ml-7 transition-all duration-300
                                            ${activeIndex === 2 ? 'scale-100 opacity-100 bg-[#B6EEF0]' : 'scale-0 opacity-0'}`}
                                            ></span>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <h1 className="text-xl font-bold flex justify-center">
                                                Calendar of Events
                                            </h1>
                                            <Calendar
                                                mode="range"
                                                defaultMonth={dateRange?.from}
                                                selected={dateRange}
                                                onSelect={setDateRange}
                                                numberOfMonths={1}
                                                className="rounded-lg border shadow-sm"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </NavigationMenuItem>

                            {/* Archive */}
                            <NavigationMenuItem>
                                <div
                                    className="relative cursor-pointer"
                                    onClick={() => setActiveIndex(3)}
                                >
                                    <Popover>
                                        <PopoverTrigger>
                                            <img src="archive.svg" alt="archive events" className="relative w-[50%] h-[50%] z-10 px-2 py-1 ml-7 font-semibold text-purple-700 text-lg" />
                                            <span
                                                className={`absolute inset-0 rounded-full w-[50%] ml-7 transition-all duration-300
                                            ${activeIndex === 3 ? 'scale-100 opacity-100 bg-[#B6EEF0]' : 'scale-0 opacity-0'}`}
                                            ></span>
                                        </PopoverTrigger>
                                        <PopoverContent>Place content for the popover here.</PopoverContent>
                                    </Popover>
                                </div>
                            </NavigationMenuItem>

                            {/* Profile */}
                            <NavigationMenuItem>
                                <div
                                    className="relative cursor-pointer"
                                    onClick={() => setActiveIndex(4)}
                                >
                                    <div >
                                        <Sheet>
                                            <SheetTrigger>
                                                <img src="profile.svg" alt="profile" className="relative top-1 w-[50%] h-[50%] z-10 px-2 py-1 ml-7 font-semibold text-purple-700 text-lg" />
                                                <span
                                                    className={`absolute inset-0 rounded-full w-[50%] ml-7 transition-all duration-300
                                            ${activeIndex === 4 ? 'scale-100 opacity-100 bg-[#B6EEF0]' : 'scale-0 opacity-0'}`}
                                                ></span>
                                            </SheetTrigger>
                                            <SheetContent className="backdrop-blur-lg bg-blue-1000">
                                                <SheetHeader>
                                                    <SheetTitle></SheetTitle>
                                                    <SheetDescription></SheetDescription>
                                                    <div className="flex items-center gap-4 mt-10">
                                                        <h1 className="text-bold font-sans text-[40px] text-white shadow-lg">
                                                            {fullname || 'Guest'}
                                                        </h1>
                                                        <Popover>
                                                            <PopoverTrigger>
                                                                <img
                                                                    src="notification.svg"
                                                                    alt="notification bell"
                                                                    className="ml-20 w-10 h-10 brightness-1000 cursor-pointer"
                                                                />
                                                            </PopoverTrigger>
                                                            <PopoverContent className="relative right-100 h-100 flex justify-center items-center">
                                                                This will show your notifications.</PopoverContent>
                                                        </Popover>
                                                    </div>
                                                    <p className="flex text-bold font-sans text-[20px] shadow-lg text-gray-400">
                                                        {username || 'Unknown'}
                                                    </p>
                                                    <p>Your Bearer Token:</p>
                                                    <pre className="p-2 bg-slate-100 text-xs mt-2 break-all">{token}</pre>
                                                </SheetHeader>
                                                <div className="flex justify-center items-center w-[90%] pl-4 mt-1 text-white">
                                                    <Accordion type="single"
                                                        collapsible
                                                        defaultValue="item-1"
                                                        className="w-full mt-10">
                                                        <AccordionItem value="item-1">
                                                            <AccordionTrigger>My Networks</AccordionTrigger>
                                                            <AccordionContent className="p-5">
                                                                This is where you see your <em>matrix</em> frieds lists and your contacts!
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        <AccordionItem value="item-2">
                                                            <AccordionTrigger>Informations</AccordionTrigger>
                                                            <AccordionContent className="p-5">
                                                                This is where you see your <em>matrix</em> infortion!
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        <AccordionItem value="item-3">
                                                            <AccordionTrigger>Job Description</AccordionTrigger>
                                                            <AccordionContent className="p-5">
                                                                Your job descrition in <em>matrix</em> Society
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                        <AccordionItem value="item-4">
                                                            <AccordionTrigger>Settings</AccordionTrigger>
                                                            <AccordionContent className="p-5">
                                                                This is where you can modify your <em>matrix</em> settings.
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                </div>
                                                <div className="flex justify-center items-center h-full w-full ">
                                                    <img
                                                        onClick={handleLogout}
                                                        src="logout.svg"
                                                        alt="logout"
                                                        className="w-10 h-10 brightness-1000 cursor-pointer"
                                                    />
                                                </div>
                                                <p className="relative mt-10 p-4 text-white flex justify-center items-center">
                                                    © 2025 Matrix Society • All Rights Reserved
                                                </p>
                                            </SheetContent>
                                        </Sheet>
                                    </div>
                                </div>
                            </NavigationMenuItem>

                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
            
            {/* modify */}
            <div className="w-full flex flex-col items-center mt-10 px-4">

                <h1 id="tech" className="text-4xl font-bold text-white/70 drop-shadow-[0_0_14px_#aabcf0] p-5">
                Latest Tech
                </h1>

    {/* MAIN GRID */}
    <div className="w-full max-w-4xl">

                    <div className="grid grid-cols-2 gap-6 w-full">

                        {/* LEFT — spans both rows */}
                        <div className="rounded-3xl h-[30rem] col-span-1 row-span-2 backdrop-blur-md bg-white/5 border border-blue-300/20 
            shadow-[0_0_20px_5px_rgba(90,110,200,0.25)]
            rounded-2xl"></div>

                        {/* RIGHT — top box */}
                        <div className="mt-10 backdrop-blur-md bg-white/5 border border-blue-300/20 
            shadow-[0_0_20px_5px_rgba(90,110,200,0.25)]
            rounded-2xl h-[16rem]"></div>

                        {/* RIGHT — bottom box */}
                        <div className="backdrop-blur-md bg-white/5 border border-blue-300/20 
            shadow-[0_0_20px_5px_rgba(90,110,200,0.25)]
            rounded-2xl h-[6rem]"></div>

                    </div>
                    <span className="w-full p-10 "></span>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 w-full">
                        {/* LEFT — top rectangle */}
                        <div className="col-start-1 mt-10 w-full h-[16rem] backdrop-blur-md bg-white/5 border border-blue-300/20 
            shadow-[0_0_20px_5px_rgba(90,110,200,0.25)]
            rounded-2xl"></div>

                        {/* RIGHT — tall card spanning both rows */}
                        <div className="col-start-2 row-span-2 w-full h-[30rem] backdrop-blur-md bg-white/5 border border-blue-300/20 
            shadow-[0_0_20px_5px_rgba(90,110,200,0.25)]
            rounded-2xl"></div>

                        {/* LEFT - bottom rectangle */}
                        <div className="col-start-1 w-full h-[6rem] backdrop-blur-md bg-white/5 border border-blue-300/20 
            shadow-[0_0_20px_5px_rgba(90,110,200,0.25)]
            rounded-2xl"></div>

                        
                    </div>

    </div>

    <div className="flex gap-2 mt-6 mb-10">
        <div className="w-2 h-2 border-gray-300 border-1 rounded-full"></div>
        <div className="w-2 h-2 border-gray-300 border-1 rounded-full"></div>
        <div className="w-2 h-2 border-gray-300 border-1 rounded-full"></div>
        <div className="w-2 h-2 border-gray-300 border-1 rounded-full"></div>
    </div>

    {/* Source Code Title */}
                <h2 id="code" className="text-4xl font-bold text-white/70 drop-shadow-[0_0_14px_#aabcf0] p-5">Source Code</h2>
    <div className="flext-col w-full max-w-4xl">

        {/* Source Code 1 */}
                    <div className="w-full h-120 bg-black/20 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2)] mb-2"></div>

        {/* Short README */}
                    <div className="w-full h-50 bg-black/20 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2)] mb-10">
                                                        
        </div>

        {/* Source Code 2 */}
                    <div className="w-full h-120 bg-black/20 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2)] mb-2"></div>

        {/* Short README */}
                    <div className="w-full h-50 bg-black/20 shadow-[inset_0_0_0_2px_rgba(255,255,255,0.2)] mb-3"></div>
    </div>
                <div className="flex gap-2 mt-6 mb-10">
                    <div className="w-2 h-2 border-gray-300 border-1 rounded-full"></div>
                    <div className="w-2 h-2 border-gray-300 border-1 rounded-full"></div>
                    <div className="w-2 h-2 border-gray-300 border-1 rounded-full"></div>
                    <div className="w-2 h-2 border-gray-300 border-1 rounded-full"></div>
                </div>
</div>

<Button
  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 right-6 
         bg-[#8da3d9]/40 backdrop-blur-md text-white 
         px-4 py-2 rounded-xl 
         border border-white/20
         shadow-[0_0_10px_#8da3d9]
         hover:bg-[#8da3d9]/60 
         transition">
  ↑ Top
</Button>

</div>

       
    )
}

