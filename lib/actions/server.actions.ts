"use server";

import { serverSchema, ServerValues } from "@/schemas";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { MemberRole, Server } from "@prisma/client";
import { currentProfile } from "./profile.actions";
import { revalidatePath } from "next/cache";
import { cache } from "react";

export const createServer = async (values: ServerValues): Promise<Server> => {
  const validatedFields = serverSchema.safeParse(values);
  const currentUser = await currentProfile();
  if (!currentUser) throw new Error("Unauthorized");
  if (!validatedFields.success) throw new Error("Missing Required Fields");

  const { imageUrl, name } = validatedFields.data;

  const newServer = await db.server.create({
    data: {
      name,
      imageUrl,
      profileId: currentUser.id as string,
      inviteCode: uuidv4(),
      channels: {
        create: [{ name: "General", profileId: currentUser.id as string }],
      },

      members: {
        create: [{ profileId: currentUser.id, role: MemberRole.ADMIN }],
      },
    },
  });

  revalidatePath(`/servers/${newServer.id}`);
  return newServer;
};

export const getServerById = cache(async (id: string) => {
  const server = await db.server.findUnique({
    where: { id },
  });
  return server;
});

export const generateNewInviteCode = async (serverId: string) => {
  try {
    const profile = await currentProfile();

    if (!profile) throw new Error("Unauthanticated");

    if (!serverId) throw new Error("serverId is missing");

    const serverToUpdate = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return serverToUpdate;
  } catch (error) {
    console.log("[GENERATE_NEW_CODE_ACTION]", error);
  }
};

export const editServer = async ({
  serverId,
  values,
}: {
  serverId: string;
  values: ServerValues;
}) => {
  try {
    const validatedFields = serverSchema.safeParse(values);
    const profile = await currentProfile();
    if (!profile) throw new Error("Unauthanticated");
    if (!serverId) throw new Error("serverId is missing");
    if (!validatedFields.success) throw new Error("Missing Required Fields");

    const { imageUrl, name } = validatedFields.data;

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        imageUrl,
        name,
      },
    });

    revalidatePath(`/servers/${server.id}`);

    return server;
  } catch (error) {
    console.log("[EDIT_SERVER]", error);
  }
};

export const leaveServer = async (serverId: string) => {
  try {
    const profile = await currentProfile();
    if (!profile) throw new Error("Unauthanticated");
    if (!serverId) throw new Error("serverId is missing");

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },

        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return server;
  } catch (error) {
    console.log("[LEAVE_SERVER]", error);
  }
};

export const deleteServer = async (serverId: string) => {
  try {
    const profile = await currentProfile();
    if (!profile) throw new Error("Unauthenticated");
    if (!serverId) throw new Error("serverId is missing");

   
    const server = await db.server.findFirst({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    if (!server) {
      throw new Error("Server not found or does not belong to the current profile.");
    }

    
    await db.member.deleteMany({
      where: {
        serverId: serverId,
        profileId : profile.id
      },
    });


    
    const serverToDelete = await db.server.delete({
      where: {
        id: serverId,
        profileId  : profile.id
      },
    });

    return serverToDelete;
  } catch (error) {
    console.log("[DELETE_SERVER]", error);
    throw error; 
  }
};
