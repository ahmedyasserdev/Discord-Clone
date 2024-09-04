'use client'
import {ServerWithMembersWithProfile} from "@/types"
import { MemberRole } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react';
import {useModal} from "@/hooks/use-modal-store"


type ServerHeaderProps = {
    server : ServerWithMembersWithProfile;
    role ?: string 
}



const ServerHeader = ({server , role}: ServerHeaderProps) => {
  const {onOpen ,  } = useModal()
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR
  return (
    <DropdownMenu >
      <DropdownMenuTrigger className = 'focus:outline-none' asChild >
      <button className = "w-full  p-medium-14 px-3 flex items-center h-12 border-neutral-200  dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition" > 
        {server.name}
        <ChevronDown className = "size-5 ml-auto" />
      </button>
      </DropdownMenuTrigger>

    <DropdownMenuContent className = "w-56 p-medium-16 text-black dark:text-neutral-400 space-y-[2px]">
      

          {
            isModerator && (
              <DropdownMenuItem  onClick  = {() => onOpen('invite' , {server})}  className="text-indigo-600 dark:text-indigo-400 px-3 py-2 p-regural-14 cursor-pointer"> 
                Invite People
                <UserPlus className="size-4 ml-auto" />
              </DropdownMenuItem>
            )
          }
      

      {isAdmin && (
          <DropdownMenuItem
          onClick = {() => onOpen('editServer' , {server})}
            className="px-3 py-2 p-regural-14 cursor-pointer"
          >
            Server Settings
            <Settings className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
      
      {isAdmin && (
          <DropdownMenuItem onClick = {() => onOpen("members" , {server})} className="px-3 py-2 p-regural-14 cursor-pointer">
            Manage members
            <Users className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
              {isModerator && (
          <DropdownMenuItem onClick = {() => onOpen("createChannel")} className="px-3 py-2 p-regular-14 cursor-pointer">
            Create channel
            <PlusCircle className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {
          isModerator && (
              <DropdownMenuSeparator /> 
          )
        }
           {isAdmin && (
          <DropdownMenuItem onClick = {() => onOpen("deleteServer" , {server})} className="text-rose-500 px-3 py-2 p-regurla-14 cursor-pointer">
            Delete server
            <Trash className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}


          {!isAdmin && (
          <DropdownMenuItem  onClick =  {() => onOpen("leaveServer" , {server})} className="text-rose-500 px-3 py-2 p-regular-14 cursor-pointer">
            Leave server
            <LogOut className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}


       </DropdownMenuContent>


    </DropdownMenu>
  )
}

export default ServerHeader