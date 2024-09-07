"use client";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import qs from 'query-string'
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { messageModalSchema, MessageModalValues } from "@/schemas";
import FileUpload from "../shared/FileUpload";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
const MessageFileModal = () => {
  const {onOpen , isOpen , type , data , onClose} = useModal();
   const isModalOpen = isOpen && type === "messageFile";
   const {query , apiUrl} = data
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const form = useForm<MessageModalValues>({
    resolver: zodResolver(messageModalSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const handleClose = () => {
    onClose()
    form.reset()
  }


  function onSubmit(values: MessageModalValues) {
    startTransition(async () => {
      const url = qs.stringifyUrl({
        url: apiUrl  || '' ,
        query,
      })

      await axios.post(url, {
        ...values,
        content : values.fileUrl
      });

      router.refresh()
      
      handleClose();
    });
  }



  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="h3-bold text-center">
           Add an Attachment 
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as a message.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isPending}>
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
1;
