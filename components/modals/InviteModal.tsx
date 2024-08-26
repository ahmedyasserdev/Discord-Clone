"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Label
} from "@/components/ui/label";
import {
  Input
} from "@/components/ui/input";


import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";
import { Check, CopyIcon, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {useState,useTransition} from "react"
import {generateNewInviteCode} from "@/lib/actions/server.actions"
const InviteModal = () => {
  const [copied , setCopied] = useState(false);
  const [isPending , startTransition] = useTransition()
  const { onOpen ,  isOpen, onClose, type , data} = useModal();
  const isModalOpen = isOpen && type === "invite";
  const origin = useOrigin();
  const {server}  = data
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`



  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  const handleGeneratingNewInviteCode = () => {
    startTransition(async() =>{
      try {
        const updatedServerWithNewInviteCode = await generateNewInviteCode(server?.id)
          onOpen('invite' , { server :  updatedServerWithNewInviteCode})
      }catch (error) {
        console.log("[handleGeneratingNewInviteCode]" , error)
      }
    })
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="h3-bold text-center">
            Invite Friends
          </DialogTitle>
        </DialogHeader>

          <div className   = "p-6" > 
            <Label className  = "text-zinc-500 p-bold-14  dark:text-secondary/70 uppercase" > Server Invite Link </Label>

            <div className = "flex items-center gap-x-2 mt-2"> 
              <Input disabled = {isPending} value = {inviteUrl} className = "input-field" />
              <Button disabled = {isPending} onClick = {onCopy}  size = 'icon'>
              {copied ? <Check className="size-4" /> : <CopyIcon className="size-4" />}
              </Button>
            </div>

          <Button onClick  = {handleGeneratingNewInviteCode}  disabled = {isPending} variant = "link" size = "sm" className = 'p-regular-14 text-zinc-500 mt-4'>
            Generate a new link
              <RefreshCw  className =  'size-4 ml-2' />
            </Button>

          </div>



            </DialogContent>
    </Dialog>
  );
};

export default InviteModal;
