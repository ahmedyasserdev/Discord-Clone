import { currentProfile } from "@/lib/actions/profile.actions";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import NavigationActions from "./NavigationActions";
import {Separator} from "@/components/ui/separator"  
import { ScrollArea } from "@/components/ui/scroll-area"
import { Server } from "@prisma/client";
import NavigationItem from "./NavigationItem";
import ModeToggler from "@/components/shared/ModeToggler";
import { UserButton } from "@clerk/nextjs";

const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) return redirect("/sign-in");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

 

  return (
    <div className="flex flex-col  space-y-4 items-center h-full w-full text-primary dark:bg-[#1E1F22] py-3">
      <NavigationActions />
      <Separator className = "h-[2px] w-10 mx-auto bg-zinc-300 dark:bg-zinc-700 rounded-md "/>
        <ScrollArea className = "flex-1 w-full ">
            {
              servers.map((server : Server) => (
                <div key = {server.id} className = "mb-4" >
                    <NavigationItem id = {server.id} name = {server.name} imageUrl = {server.imageUrl}  />
                </div>
              ) )
            }
        </ScrollArea>
    
              <div className="pb-3 flex mx-auto items-center flex-col gap-y-4">
                <ModeToggler/>
                <UserButton
                  appearance={{
                    elements : {
                      avatarBox  : "size-[48px]"
                    }
                  }}
                />
              </div>

    </div>
  );
};

export default NavigationSidebar;
