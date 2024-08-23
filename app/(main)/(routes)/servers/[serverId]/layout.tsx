import ServerSidebar from "@/components/server/ServerSidebar";
import {currentProfile} from "@/lib/actions/profile.actions"
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
const ServerIdLayout = async({
  children,
  params: { serverId },
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
        const profile = await currentProfile();
        if (!profile) return auth().redirectToSignIn();

  const server = await db.server.findUnique({
    where : {
      id : serverId ,
      members : {
        some : {
          id : profile.id
        }
      }
    }
  })


return (
    <div className  = "h-full" >
                <div className=" invisible  md:visible h-full w-60 z-20  fixed inset-y-0">
                  <ServerSidebar  serverId = {serverId} />
                </div>
     
      <main className = "md:pl-60 h-full"> 
      {children}

      </main>
      </div>
)
};

export default ServerIdLayout;
