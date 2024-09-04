'use client'

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client"
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ActionTooltip from "../shared/ActionTooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";
import gsap from "gsap";


type ServerChannelProps = {
  channel: Channel;
  server: Server;
  role?: MemberRole
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
}

const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
  const router = useRouter();
  const params = useParams();
  const {onOpen} = useModal();
  const Icon = iconMap[channel.type];
  const handleClick = () => {
    router.push(`/servers/${server.id}/channels/${channel.id}`)
  };

  const onAction = (e : React.MouseEvent , action : ModalType) => {
    e.stopPropagation();
    onOpen(action , {channel , server})
  }


  useEffect(() => {
    const channels = document.querySelectorAll('.channel');
    gsap.fromTo(channels, {
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
    <button onClick={handleClick}
      className={cn("channel flex items-center p-2 gap-x-2 group rounded-md transition mb-1  w-full dark:hover:bg-zinc-700/50 hover:bg-zinc-700/10",
        params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}>

      <Icon className="flex-shrink-0 size-5  text-zinc-500 dark:text-zinc-400" />
      <p className={cn('line-clamp-1 p-semibold-14 text-zinc-500 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition  group-hover:text-zinc-600', params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>{channel.name}</p>


        {
          channel.name.toLocaleLowerCase() !== "general" && role !== MemberRole.GUEST && (
            <div className="ml-auto flex items-center gap-x-2">
              <ActionTooltip label="Edit" >
                <Edit onClick={(e) => onAction(e, 'editChannel', )}  className="hidden group-hover:block size-4 hover:text-zinc-600 text-zinc-500 dark:text-zinc-400  dark:hover:text-zinc-300 transition" />
              </ActionTooltip>
              <ActionTooltip label="delete" >
                <Trash onClick={(e) =>  onAction(e,"deleteChannel",	) } className="hidden group-hover:block size-4 hover:text-zinc-600 text-zinc-500 dark:text-zinc-400  dark:hover:text-zinc-300 transition" />
              </ActionTooltip>
            </div>
          )
        }


        {
            channel.name.toLocaleLowerCase() === "general" && (
              <Lock className="ml-auto size-4   hover:text-zinc-600 text-zinc-500 dark:text-zinc-400  dark:hover:text-zinc-300 transition" />
            ) 
        }

    </button>
  )
}

export default ServerChannel