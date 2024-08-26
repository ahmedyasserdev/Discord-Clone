import { getServerById } from "@/lib/actions/server.actions";
import { db } from "@/lib/db";
import { Metadata } from "next";
import React, { cache } from "react";



export async function generateMetadata({
    params: { serverId },
  }: {
    params: { serverId: string };
  }): Promise<Metadata> {
    const server =await  getServerById(serverId)
    return {
      title: server?.name as string ,
    };
  }

const ServerIdPage = () => {
  return <div>ServerIdPage</div>;
};

export default ServerIdPage;
