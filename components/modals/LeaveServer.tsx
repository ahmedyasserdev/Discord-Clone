"use client";
import {useTransition} from "react";
import {useRouter} from "next/navigation"
import {leaveServer} from "@/lib/actions/server.actions"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";



const LeaveServerModal = () => {
  const [isPending , startTransition] = useTransition()
  const { onOpen ,  isOpen, onClose, type , data} = useModal();
  const router= useRouter()
  const isModalOpen = isOpen && type === "leaveServer";
 
  const {server}  = data

  
  const onLeave =  () => {
    startTransition(async () => {
      try { 
        if (!server) return ;
        const serverToLeave =  await leaveServer(server.id)

          if (serverToLeave) {
            onClose()
            router.refresh();
            router.push("/")
          }
     
     
        }catch (error) {
          console.log(error)
        }
      })
  }

  


  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="h3-bold text-center">
            Leave Server
          </DialogTitle>

          <DialogDescription className = "text-center text-zinc-500" >Are you sure you want to leave <span className = "font-semibold text-indigo-500" >{server?.name}</span>?</DialogDescription>
        </DialogHeader>

          <DialogFooter className   = "bg-gray-100 px-6 py-4 " > 
            <div className = "flex-between w-full" >
              <Button variant = "ghost"  disabled = {isPending} onClick = {onClose}> Cancel</Button>
              <Button variant = "primary" disabled = {isPending} onClick = {onLeave} >Confirm</Button>
            </div>
          </DialogFooter>



            </DialogContent>
    </Dialog>
  );
};

export default LeaveServerModal;
