"use server";

import { createServerSchema, CreateServerValues } from "@/schemas";
import { v4 as uuidv4 } from "uuid"
import { db } from "../db";
import { MemberRole, Server } from "@prisma/client";
import { currentProfile } from "./profile.actions";

export const createServer = async(values: CreateServerValues) : Promise<Server> => {
  const validatedFields = createServerSchema.safeParse(values);
    const currentUser  = await currentProfile()
    if (!currentUser) throw new Error("Unauthorized")
  if (!validatedFields.success) throw new Error("Missing Required Fields");

  const { imageUrl, name } = validatedFields.data;

    const newServer = await db.server.create({
        data : {
            name,
            imageUrl,
            profileId : currentUser.id as string,
            inviteCode : uuidv4(),
            channels : {
              create : [
                {name : "General" ,  profileId : currentUser.id as string}
              ]
            },

            members : {
              create  : [{profileId : currentUser.id , role : MemberRole.ADMIN}]
            }
        }
    })
    return newServer

};
