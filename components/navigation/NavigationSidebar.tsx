import { currentProfile } from '@/lib/actions/profile.actions'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'

const NavigationSidebar = async() => {
  const profile = await currentProfile();
  if (!profile) return redirect("/sign-in");


  const servers = await db.server.findMany({
    where : {
      members : {
        some :  {
          profileId : profile.id,
        }
      }
    }
  })







  return (
    <div className = "flex flex-col  space-y-4 items-center h-full w-full text-primary dark:bg-[#1E1F22] py-3">NavigationSidebar</div>
  )
}

export default NavigationSidebar