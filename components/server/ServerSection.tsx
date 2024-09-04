"use client"

import { ServerWithMembersWithProfile } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import ActionTooltip from "../shared/ActionTooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";
import gsap from "gsap";

type ServerSectionProps = {
    label: string;
    role?: MemberRole;
    sectionType: "channels" | "members";
    channelType?: ChannelType;
    server?: ServerWithMembersWithProfile
}
const ServerSection = ({ label, sectionType, role, channelType, server }: ServerSectionProps) => {
    const { onOpen } = useModal();

    useEffect(() => {
        const serverSection = document.querySelector('.server-section');
    
          gsap.fromTo(serverSection, {
            opacity: 0,
            x : -100 ,
            duration: 0.35,
          }, {

            opacity : 1 ,
            x  : 0 ,
            duration : 0.35

          })
         
      }, []);
    
    return (
        <div className=" server-section py-2 flex-between">
            <p className="p-semibold-14 uppercase  text-zinc-500 dark:text-zinc-400">{label}</p>

            {
                role !== MemberRole.GUEST && sectionType === "channels" && (
                    <ActionTooltip label="Create Channel" side="top" >
                        <button onClick={() => onOpen('createChannel', {channelType})} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"> <Plus className="size-4" /> </button>
                    </ActionTooltip>
                )
            }
            {
                role === MemberRole.ADMIN && sectionType === "members" && (
                    <ActionTooltip label="Manage Members" side="top" >
                        <button onClick={() => onOpen('invite', { server })} className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"> <Settings className="size-4" /> </button>
                    </ActionTooltip>
                )
            }

        </div>
    )
}

export default ServerSection