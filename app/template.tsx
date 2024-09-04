"use client"

import { animatePageIn } from "@/lib/animations"
import gsap from "gsap";
import { useEffect } from "react"

export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    animatePageIn();

      const chatHeader = document.querySelector('.chat-header');
      gsap.fromTo(chatHeader, {
        width : '0%',	
        background  : "#313338" ,
      },{
        width : '100%',
        background  : "transparent" ,
        duration : 2,
        ease : 'cric.in'
      })
  }, [])
  return (
    <div>
    <div
      id="banner-1"
      className="min-h-screen bg-zinc-300 dark:bg-zinc-800 fixed top-0 left-0 w-1/4 z-[999]"
    />
    <div
      id="banner-2"
      className="min-h-screen  bg-zinc-300 dark:bg-zinc-800 fixed top-0 left-1/4 w-1/4 z-[999]"
    />
    <div
      id="banner-3"
      className="min-h-screen  bg-zinc-300 dark:bg-zinc-800 fixed top-0 left-2/4 w-1/4 z-[999]"
    />
    <div
      id="banner-4"
      className="min-h-screen  bg-zinc-300 dark:bg-zinc-800 fixed top-0 left-3/4 w-1/4 z-[999]"
    />
    {children}
  </div>
  )
}