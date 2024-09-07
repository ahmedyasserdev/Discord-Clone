'use client'
import { Hash } from 'lucide-react'
import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

type ChatWelcomeProps = {
    type: "channel" | "conversation",
    name: string
}

const ChatWelcome = ({ type, name }: ChatWelcomeProps) => {
 
  const firstPRef = useRef<HTMLParagraphElement>(null);
  const secondPRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    if (firstPRef.current) {
      tl.fromTo(firstPRef.current, {
        x: -100,          
        opacity: 0,       
        duration: 2,      
        ease: "power3",
      }, {
        x: 0,            
        opacity: 1,        
        duration: 2,       
        ease: "power3",
      });
    }
  if (secondPRef.current) {
    const text = secondPRef.current.textContent;
    secondPRef.current.textContent = '';
    const chars = text?.split('');
    tl.to(secondPRef.current, {
      duration: 1.75,      
      ease: "power3.out",
      callbackScope: secondPRef.current,
      callback: () => {
        chars?.forEach((char, index) => {
          setTimeout(() => {
            if (secondPRef.current) {
              secondPRef.current.textContent += char;
            }
          }, index * 30); 
        });
      }
    });
  }

 
  }, []);

  return (
    <div className='space-y-2 px-4 mb-4 overflow-x-hidden'>
        {type === 'channel' && (
            <div className="size-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex-center ">
                <Hash className="size-12 text-white" />
            </div>
        )}

        <p
          ref={firstPRef}
          className="p-bold-20 md:h3-bold"
        >
            {type === "channel" ? "Welcome to #" : ""}{name}
        </p>

        <p
          ref={secondPRef}
          className="dark:text-zinc-400 p-regular-12 text-zinc-600"
        >
            {type === "channel"
              ? `This is the start of the #${name} channel`
              : `This is the start of your conversation with ${name}`}
        </p>
    </div>
  )
}

export default ChatWelcome
