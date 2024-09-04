import { currentProfile } from "@/lib/actions/profile.actions";
import { getServerById } from "@/lib/actions/server.actions";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React, { cache } from "react";



export async function generateMetadata({
    params: { serverId },
  }: {
    params: { serverId: string };
  }): Promise<Metadata> {
    const server =await  getServerById(serverId);
    return {
      title: server?.name as string ,
    };
  }

const ServerIdPage = async({params : {serverId}} : {params : {serverId : string}}) => {
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();
  const server =await  getServerById(serverId);
  const initialChanne = server?.channels[0];

    if (initialChanne?.name.toLowerCase() !== 'general') return null;

    return redirect(`/servers/${serverId}/channels/${initialChanne.id}`);
};

export default ServerIdPage;
