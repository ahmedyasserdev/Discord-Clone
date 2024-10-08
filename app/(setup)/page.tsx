import InitialModal from '@/components/modals/InitialModal';
import { useModal } from '@/hooks/use-modal-store';
import { initialProfile } from '@/lib/actions/profile.actions'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'



const SetupPage = async() => {
    const  profile = await initialProfile();
    const server = await db.server.findFirst({
        where : {
            members : {
                some : {
                  profileId :    profile?.id
                }
            }
        }
    });


    if (server) {
        return redirect(`/servers/${server.id}`)
    }



  return (
    <InitialModal />
  )
}

export default SetupPage