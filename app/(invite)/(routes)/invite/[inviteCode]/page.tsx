import { currentProfile } from '@/lib/actions/profile.actions'
import { auth } from '@clerk/nextjs/server';
import React from 'react'
import {redirect} from "next/navigation"
import {db} from "@/lib/db"
const InviteCodePage =async ({params : {inviteCode} } : {params : {inviteCode : string}}) => {
    const profile = await currentProfile();
    if (!profile) return auth().redirectToSignIn();
    if (!inviteCode) return redirect('/');
    
    const existingServer = await db.server.findFirst({
        where : {
            inviteCode,
            members : {
                some : {
                    profileId : profile.id
                }
            }
        }
    });

    if (existingServer) return redirect(`/servers/${existingServer.id}`)

        const server = await db.server.update({
            where: {
                inviteCode,
                
            },
            data : {
                members : {
                    create : [
                        {
                            profileId : profile.id
                        }
                    ]
                }
            }
        })

  return null ;
}

export default InviteCodePage;
