"use client"
import { cn } from '@/lib/utils'
import { Member, MemberRole, Profile, Server } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import UserAvatar from '../shared/UserAvatar'
import { useEffect } from 'react'
import gsap from 'gsap'
type ServerMemberProps = {
    member: Member & { profile: Profile },
    server: Server,
}
const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="ml-2 size-4 text-rose-500" />,
    [MemberRole.ADMIN]: <ShieldAlert className="ml-2 size-4 text-rose-500" />,
}
const ServerMember = ({ member, server }: ServerMemberProps) => {
    const params = useParams();
    const router = useRouter();

    const icon = roleIconMap[member.role];


    const handleClick = () => {
        router.push(`/servers/${server.id}/conversations/${member.id}`)
    }


    useEffect(() => {
        const members = document.querySelectorAll('.member');
        gsap.fromTo(members, {
          y: 100,
          opacity: 0,
          stagger: 0.1,
          duration: 0.5,
        }, {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease :  "circ.in",
        });
      }, []);


    return (
        <button
            onClick={handleClick}
            className={cn("member flex items-center p-2 group hover:bg-zinc-700/10 mb-1 gap-x-2 w-full dark:hover:bg-zinc-700/50 transition",
                params.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
            >
            <UserAvatar src={member.profile.imageUrl} name= {member.profile.name} className='size-8 md:size-8' />

            <p className= {cn('p-semibold-14 text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300  transition',
                params.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"                    
            )}>{member.profile.name}</p>            
            {icon}

        </button>
    )
}

export default ServerMember