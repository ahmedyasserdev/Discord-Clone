import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import { currentProfile } from '@/lib/actions/profile.actions';
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';



const ChannelIdPage = async({params : {serverId, channelId}} : {params : {serverId : string, channelId : string}}) => {
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id : channelId
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
    <div className='bg-white dark:bg-[#313338] h-full flex flex-col '>
      <ChatHeader
        name = {channel.name}
        serverId= {serverId}
        type='channel'
      />


      <div className="flex-1">
        Future Messages
      </div>


      <ChatInput  name={channel.name} type="channel"
      apiUrl='/api/socket/messages'
        query={{
          channelId,
          serverId : channel.serverId
        }}
      />


    </div>
  )
}

export default ChannelIdPage