import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import MediaRoom from '@/components/shared/MediaRoom';
import { currentProfile } from '@/lib/actions/profile.actions';
import { db } from '@/lib/db';
import {  } from '@clerk/nextjs';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';



const ChannelIdPage = async({params : {serverId, channelId}} : {params : {serverId : string, channelId : string}}) => {
  const profile = await currentProfile();
  if (!profile) return redirect('/sigin-in');

  const channel = await db.channel.findUnique({
    where: {
      id : channelId
    },
    include : {
      messages : true
    }
  });

  const member = await db.member.findFirst({
    where : {
        serverId ,
        profileId : profile.id,
    }
  });


  if (!channel || !member) return  redirect('/')
  return (
    <div className='bg-white dark:bg-[#313338] h-screen flex flex-col '>
      <ChatHeader
        name = {channel.name}
        serverId= {serverId}
        type='channel'
      />


      <div className="flex-1">

        {channel.type === ChannelType.TEXT && (
          <ChatMessages
            name = {channel.name}
            type = "channel"
            member = {member}
            apiUrl='/api/messages'
            socketUrl='/api/socket/messages'
            socketQuery={{
              channelId,
              serverId : channel.serverId
            }}
            paramKey='channelId'
            paramValue={channel.id}
            chatId={channel.id}
          />

        ) }
      </div>


      {
        channel.type === ChannelType.TEXT && (
          <ChatInput  name={channel.name} type="channel"
      apiUrl='/api/socket/messages'
        query={{
          channelId,
          serverId : channel.serverId,
        }}
      />
        )
      }


      {
        channel.type === ChannelType.AUDIO && (
          <MediaRoom 
            chatId= {channel.id}
            video = {false}
            audio = {true}
          />
        )
      }
      {
        channel.type === ChannelType.VIDEO && (
          <MediaRoom 
            chatId= {channel.id}
            video = {true}
            audio = {false}
          />
        )
      }


    </div>
  )
}

export default ChannelIdPage