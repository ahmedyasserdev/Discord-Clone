'use server'

import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db";


export const initialProfile = async () =>{

    
    const user = await currentUser()
    if (!user) auth().redirectToSignIn();


    const profile = await db.profile.findUnique({
        where : {
            userId : user?.id
        }
    })

    if (profile) return profile ;

    const newProfile  = await db.profile.create({
        data : {
            userId : user?.id as string  ,
            name :  `${user?.firstName} ${user?.lastName}`,
            imageUrl : user?.imageUrl as string,
            email : user?.emailAddresses[0].emailAddress as string

        }
    })


    return newProfile
}



export const currentProfile  = async () => {
    const {userId} = auth();

    if (!userId) return null;
    const profile = await db.profile.findUnique({
        where : {
            userId
        }
    })
    return profile
}