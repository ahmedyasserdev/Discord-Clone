import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ChatMessages from "@/components/chat/ChatMessages";
import MediaRoom from "@/components/shared/MediaRoom";
import { findOrCreateConversation } from "@/lib/actions/conversation.action";
import { currentProfile } from "@/lib/actions/profile.actions";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const MemberIdPage = async ({ params: { memberId, serverId } , searchParams }: { searchParams : {video: boolean} ;  params: { memberId: string, serverId: string } }) => {
  const profile = await currentProfile();
  if (!profile) return redirect('/sign-in');

  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id
    },
    include: {
      profile: true
    }
  })
  if (!currentMember) return redirect('/');

  const conversation = await findOrCreateConversation({ memberOneId: currentMember.id, memberTwoId: memberId });

  if (!conversation) return redirect(`/servers/${serverId}`);
  const { memberOne, memberTwo } = conversation
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne
  return (
    <div className="bg-white dark:bg-[#313338] h-screen flex flex-col">
      <ChatHeader
        serverId={serverId}
        name={otherMember.profile.name}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />

      {
            searchParams?.video && (
              <MediaRoom
                video = {true}
                audio = {false}
                chatId= {conversation.id}
              />  
            )
      }


     {
      !searchParams?.video && (
      <>
        <div className="flex-1">
        <ChatMessages
          paramKey="conversationId"
          paramValue={conversation.id}
          socketUrl="/api/socket/direct-messages"
          socketQuery={{ conversationId: conversation.id, }}
          name={otherMember.profile.name}
          type="conversation"
          apiUrl="/api/direct-messages"
          member={currentMember} chatId={conversation.id} />
        </div>
        <ChatInput
          apiUrl="/api/socket/direct-messages"
          query={{ conversationId: conversation.id }}
          name={otherMember.profile.name}
          type="conversation" />
          </>
      )
     }
    </div>
  )
}

export default MemberIdPage