import { currentProfile } from "@/lib/actions/profile.actions";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params: { memberId } }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();
    const { role } = await req.json();
    const { searchParams } = new URL(req.url);
    if (!profile) return new NextResponse("Unauthanticated", { status: 401 });
    const serverId = searchParams.get("serverId");

    if (!serverId)
      return new NextResponse("serverId is missing", { status: 400 });

    if (!memberId)
      return new NextResponse("memberId is missing", { status: 400 });

    const server = await db.server.update({
      where: { id: serverId, profileId: profile.id },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },

      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: { role: "asc" },
        },
      },
    });

    revalidatePath(`/servers/${server.id}`);
    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMEBERID_PATCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params: { memberId } }: { params: { memberId: string } }
) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthanticated", { status: 401 });
    if (!memberId)
      return new NextResponse("memberId is missing", { status: 400 });
    if (!serverId)
      return new NextResponse("serverId is missing", { status: 400 });


    const server = await db.server.update({
        where : {
            id : serverId ,
            profileId : profile.id
        },
        data : {
            members : {
                deleteMany : {
                    id : memberId,
                    profileId: {
                        not: profile.id,
                      },
                }
            }
        },
        include: {
            members: {
              include: {
                profile: true,
              },
              orderBy: { role: "asc" },
            },
          },
    });
    revalidatePath(`/servers/${server.id}`);

    return NextResponse.json(server)
  } catch (error) {
    console.log("[MEMEBERID_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
