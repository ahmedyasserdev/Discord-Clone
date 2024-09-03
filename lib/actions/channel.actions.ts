'use server'

import { channelSchema, ChannelValues } from "@/schemas"
import { Server, MemberRole } from "@prisma/client";
import { currentProfile } from "./profile.actions";
import { db } from "../db";
import { revalidatePath } from "next/cache";


export const createChannel = async ({ values, serverId }: { values: ChannelValues; serverId: string }): Promise<Server> => {
    try {
        const profile = await currentProfile();

        if (!profile) throw new Error("Unauthenticated");
        if (!serverId) throw new Error("serverId is missing");

        const validatedFields = channelSchema.safeParse(values);

        if (!validatedFields.success) throw new Error("Missing Required Fields");

        const { name, type } = validatedFields.data;

        const newChannel = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },

            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        type,
                        name,
                    }
                }
            }
        });
        revalidatePath(`/servers/${serverId}`);
        return newChannel;
    } catch (error) {
        console.error("[CREATE_CHANNEL_ACTION]", error);
        throw error;

    }
};



export const deleteChannel = async ({ channelId, serverId }: { channelId: string; serverId: string }): Promise<Server> => {
    try {
        const profile = await currentProfile();

        if (!profile) throw new Error("Unauthenticated");
        if (!serverId) throw new Error("serverId is missing");
        if (!channelId) throw new Error("channelId is missing");


        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] }
                    }
                }
            },
            data: {
                channels: {
                    deleteMany: {
                        id: channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        })


        revalidatePath(`/servers/${serverId}`);

        return server





    } catch (error) {
        console.error("[DELETE_CHANNEL_ACTION]", error);
        throw error;

    }

}


export const updatedChannel = async ({values ,channelId , serverId } : { values : ChannelValues , channelId : string , serverId : string}) : Promise<Server> => {
    try {
        const profile = await currentProfile();
        if (!profile) throw new Error("Unauthenticated");
        if (!channelId) throw new Error("channelId is missing");
        if (!serverId) throw new Error("ServerId is missing");
        const validatedFields = channelSchema.safeParse(values);
        if (!validatedFields.success) throw new Error("Missing Required Fields");


        const { name, type } = validatedFields.data;
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] }


                    }
                }
            },
            data: {
                channels: {
                    updateMany: {
                        where: {
                            id: channelId,
                            name : {
                                not : "general"
                            }
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        })
        revalidatePath(`/servers/${server.id}`);
        return server

    } catch (error) {
        console.error("[UPDATE_CHANNEL_ACTION]", error);
        throw error;

    }
}