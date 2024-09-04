import { Hash,  } from 'lucide-react';
import React from 'react'
import MobileToggle from '../shared/MobileToggle';
import UserAvatar from '../shared/UserAvatar';
import SocketIndicator from '../shared/SocketIndicator';

type ChatHeaderProps = {
  serverId : string;  
  name : string ;
  type  : "channel" | "conversation";
  imageUrl? : string
}
const ChatHeader = ({serverId, name, type, imageUrl} : ChatHeaderProps) => {
        


  return (
    <div className=' chat-header p-semibold-18 px-3 flex items-center h-12 border border-neutral-200 dark:border-neutral-700'>
      <MobileToggle serverId = {serverId}  />

      {
         type === 'channel' && (
          <Hash className='size-5 mr-2 dark:text-zinc-400  text-zinc-500' />
         )
      }

      {
         type === 'conversation' && (
          <UserAvatar 
          src={imageUrl}
          name={name}
          className='size-8 md:size-10 mr-2'
          />
         )}

      <p className='p-semibold-18 text-black dark:text-white ' >{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator/>
      </div>
    </div>
  )
}

export default ChatHeader