'use client'
import { Member, Message, Profile } from '@prisma/client';
import React, { Fragment } from 'react'
import ChatWelcome from './ChatWelcome';
import { useChatQuery } from '@/hooks/use-chat-query';
import { Loader2, ServerCrash } from 'lucide-react';
import {format} from 'date-fns';
import ChatItem from './ChatItem';
type MessageWithMemberWithProfile = Message & {
    member: Member & {
      profile: Profile;
    };
  };
  
  interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    socketQuery: Record<string, string>;
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
  }
  

const ChatMessages = ({apiUrl, socketUrl, socketQuery, name, member, chatId, paramKey, paramValue, type} :  ChatMessagesProps) => {
   const  queryKey = `chat:${chatId}` ;
   const DATE_FORMATE = 'd MMM yyyy, HH:mm'
  const {
      data ,
      isFetchingNextPage ,
      fetchNextPage,
      hasNextPage,
      status
    } = useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue
    });

    //@ts-ignore
    if (status === "pending") {
      return (
        <div className="flex-center flex-col flex-1 ">
          <Loader2 className="size-7 text-zinc-500 animate-spin my-4" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Loading messages...
          </p>
        </div>
      );
    }
  
    if (status === "error") {
      return (
        <div className="flex flex-col flex-1 justify-center items-center">
          <ServerCrash className="size-7 text-zinc-500 my-4" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Something went wrong!
          </p>
        </div>
      );
    }
  return (
    <div className='flex-1 flex flex-col py-4 overflow-y-auto'>
        <div  className = "flex-1 " />

        <ChatWelcome type = {type} name = {name} />

        <div className='flex flex-col-reverse mt-auto'>
          {
            data?.pages?.map((group , i) => (
              <Fragment key={i} >
                {group.items.map((message : MessageWithMemberWithProfile) => (
                  <ChatItem
                    currentMember={member}
                    id = {message.id}
                    content = {message.content}
                    member = {message.member}
                    timestamp = {format(new Date(message.createdAt), DATE_FORMATE)}
                    fileUrl = {message.fileUrl}
                    deleted = {message.deleted}
                    isUpdated = {message.updatedAt !== message.createdAt}
                    socketUrl = {socketUrl}
                    socketQuery = {socketQuery}
                    key = {message.id}
                  />
                ) )}
              </Fragment>

            ))
          }
        </div>
    </div>
  )
}

export default ChatMessages