"use client";
import qs from "query-string"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuContent,
  DropdownMenuSubContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { useModal } from "@/hooks/use-modal-store";
import { useState, useTransition } from "react";

import { ServerWithMembersWithProfile } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../shared/UserAvatar";
import {
  ShieldCheck,
  ShieldAlert,
  MoreVertical,
  ShieldQuestion,
  Loader2,
  Gavel,
  Check,
} from "lucide-react";
import { MemberRole } from "@prisma/client";
import axios from 'axios'
import { useRouter } from "next/navigation";
const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="size-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="size-4 ml-2 text-rose-500" />,
};
const roleOptions = [
  {
    value: "GUEST" as MemberRole,
    label: "Guest",
  },
  {
    value: "MODERATOR" as MemberRole,
    label: "Moderator",
  },

];

const MembersModal = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState("");
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfile };

  const onRoleChange = (memberId: string, role: MemberRole) => {
    startTransition(async () => {
      try {
        setLoadingId(memberId);
        const url = qs.stringifyUrl({
          url: `/api/members/${memberId}`,
          query: {
            serverId: server.id,
          },
        });

        const response = await axios.patch(url, { role })

        router.refresh();
        onOpen("members", { server: response.data })
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingId("")
      }
    })
  }
  const onKick = (memberId: string) => {
    startTransition(async () => {
      try {
        setLoadingId(memberId);
        const url = qs.stringifyUrl({
          url: `/api/members/${memberId}`,
          query: {
            serverId: server.id,
          },
        });

        const response = await axios.delete(url,)

        router.refresh();
        onOpen("members", { server: response.data })
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingId("")
      }
    })
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden ">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="h3-bold text-center">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500 ">
            {server?.members.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-8 h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar
                name={member?.profile?.name}
                src={member?.profile?.imageUrl}
              />
              <div className="flex flex-col gap-y-1">
                <div className="p-semibold-14 flex items-center ">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-zinc-500 p-regular-14">
                  {member.profile.email}
                </p>
              </div>

              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="size-4 text-zinc-500" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="size-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>

                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              {roleOptions.map((role) => (
                                <DropdownMenuItem disabled={isPending} key={role.value} onClick={() => onRoleChange(member.id, role.value)}  >
                                  {role.label}
                                  {member.role === role.value && (
                                    <Check className="size-4 ml-auto " />
                                  )}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem onClick={() => onKick(member.id)} >
                          <Gavel className="size-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}


              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 ml-auto size-4" />
              )}
            </div>



          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
