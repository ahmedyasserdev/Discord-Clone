import ChatHeader from "@/components/chat/ChatHeader";
import { findOrCreateConversation } from "@/lib/actions/conversation.action";
import { currentProfile } from "@/lib/actions/profile.actions";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const MemberIdPage = async({ params : { memberId  , serverId }  } : { params : { memberId : string , serverId : string } } ) => {
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();
   
    const currentMember = await db.member.findFirst({
        where : {
       serverId,
       profileId : profile.id
        },
        include : {
          profile : true
        }
    })
    if (!currentMember) return redirect('/')	;
  
      const conversation = await findOrCreateConversation({ memberOneId : currentMember.id, memberTwoId : memberId });

    if (!conversation) return redirect(`/servers/${serverId}`);
    const {memberOne, memberTwo}  = conversation
    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne
  return (
    <div className="bg-white dark:bg-[#313338] h-full flex flex-col">
      <ChatHeader
        serverId={serverId}
        name={otherMember.profile.name}
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
      />
    </div>
  )
}

export default MemberIdPage