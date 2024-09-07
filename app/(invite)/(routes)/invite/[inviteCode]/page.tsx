import { currentProfile } from '@/lib/actions/profile.actions'
import React from 'react'
import {redirect} from "next/navigation"
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs/server';
const InviteCodePage =async ({params : {inviteCode} } : {params : {inviteCode : string}}) => {
    const profile = await currentProfile();
    if (!profile) return redirect("/sign-in");
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

  return redirect(`/servers/${server.id}`) ;
}

export default InviteCodePage;
