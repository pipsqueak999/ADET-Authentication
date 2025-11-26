"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Rubik } from 'next/font/google';
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const rubik = Rubik({
  weight: ['400', '700', '900'],
  subsets: ['latin']
});



export default function Home() {
  const router = useRouter();

  const handleKeyDownLanding = () => {
    router.push("/");
  };

  const [loading, setLoading] = useState(false);

  return (
    <div className="relative flex min-h-screen justify-center font-sans overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 brightness-50">
        <source src="bg-vid.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Navigation Bar */}
      <div className="relative z-10 w-full h-20 bg-white/20 backdrop-blur-lg grid grid-cols-2 grid-rows-1 gap-4 items-center px-4">

        <button
          className="flex justify-center items-center text-purple-700 font-bold text-[40px] bg-transparent border-0 p-0 cursor-pointer"
          onClick={handleKeyDownLanding}
          type="button"
          aria-label="Go to home"
        >
          <img src="Codesandbox.png" alt="logo" className="flex w-[50px] h-[50px] mt-1 mr-3" />
          Matrix
        </button>

        <div className="flex justify-end">
          <NavigationMenu>
            <NavigationMenuList className="flex space-x-4 mr-[50%] ">

              <NavigationMenuItem>
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="relative z-10 px-5 py-2 font-semibold text-purple-700 group text-lg">
                    Community
                  </Button>
                  <span
                    className="absolute inset-0 rounded-full bg-[#B6EEF0]
                    scale-0 opacity-0 transition-all duration-300
                    group-hover:scale-100 group-hover:opacity-100"
                  ></span>
                </div>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <div className="relative">
                  <Button
                    variant="ghost"
                    className="relative z-10 px-5 py-2 font-semibold text-purple-700 group text-lg">
                    Support
                  </Button>
                  <span
                    className="absolute inset-0 rounded-full bg-[#c7f3f4]
                    scale-0 opacity-0 transition-all duration-300
                    group-hover:scale-100 group-hover:opacity-100"
                  ></span>
                </div>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <div className="relative group">
                  <Button
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        router.push("/login");
                      }, 800);
                    }}
                    variant="ghost"
                    className="relative z-10 px-5 py-2 font-semibold text-purple-700 group text-lg"
                  >
                    Sign In
                  </Button>
                  <span
                    className="absolute inset-0 rounded-full bg-[#c7f3f4]
                    scale-0 opacity-0 transition-all duration-300
                    group-hover:scale-100 group-hover:opacity-100"
                  ></span>
                </div>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <div className="relative group">
                  <Button
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        router.push("/register");   
                      }, 800);
                    }}
                    variant="ghost"
                    className="relative z-10 px-5 py-2 font-semibold text-purple-700 group text-lg"
                  >
                    Sign Up
                  </Button>
                  <span
                    className="absolute inset-0 rounded-full bg-[#c7f3f4]
                    scale-0 opacity-0 transition-all duration-300
                    group-hover:scale-100 group-hover:opacity-100"
                  ></span>
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-20">
        <p className={`${rubik.className} text-5xl md:text-7xl font-extrabold text-white drop-shadow-lg pb-10`}>
          DIVE INTO THE NEW WORLD
        </p>
        <p className="font-semibold text-white drop-shadow-lg">
          Discover the latest trend on the Tech Society
        </p>
        <div className="flex flex-col items-center gap-4 mt-10">
          <Button onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        router.push("/register");
                      }, 800);
                    }}
            className="w-[30%] rounded-full border border-purple-400 text-purple-400 px-6 py-5 mb-5">
            Create an Account
          </Button>

          <Button onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        router.push("/login");
                      }, 800);
                    }}
            className="w-[30%] rounded-full border border-purple-400 text-purple-400 px-6 py-5">
            Login to your Account
          </Button>
        </div>
      </div>
    </div>
  );
}
