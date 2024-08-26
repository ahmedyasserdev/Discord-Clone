import { currentProfile } from "@/lib/actions/profile.actions"
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {ChannelType} from "@prisma/client"
import { redirect } from "next/navigation";
import ServerHeader from "./ServerHeader"
type ServerSidebarProps = {
  serverId : string 
}
const ServerSidebar = async({serverId}  : ServerSidebarProps) => {
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();


    const server = await db.server.findUnique({
      where : {
        id : serverId ,
      },
      include : {
        channels : {
          orderBy : {createdAt : 'asc'}
        },
        members : {
          include : {
            profile : true
          },
          orderBy : {role : "asc"}
        }
      }

    });


    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const memebrs = server?.members.filter((member) => member.profileId !== profile.id)

    if (!server) return redirect("/")
      const role  = server.members.find((member) => member.profileId === profile.id)?.role
  return (
    <div className = "w-full h-full flex flex-col text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]" >

        <ServerHeader server = {server} role = {role} />

    </div>
  )
}

export default ServerSidebar