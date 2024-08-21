import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { UTApi } from "uploadthing/server";
import { currentProfile } from "@/lib/currentProfile";

const f = createUploadthing();

const handle = async() => {
  const currentUser = await currentProfile()
  
 
  return { userId: currentUser?.id ,};
};

export const ourFileRouter = {
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handle())
    .onUploadComplete( ({ metadata, file }) => {}),
 
 
 
 
 
 
 
    messageFile: f(["image", "pdf"])
    .middleware(() => handle())
    .onUploadComplete(({ metadata, file }) => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
