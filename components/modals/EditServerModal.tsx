"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  useTransition  , useEffect} from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
 
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { serverSchema, ServerValues } from "@/schemas";
import FileUpload from "../shared/FileUpload";
import { editServer } from "@/lib/actions/server.actions";
import { useModal } from "@/hooks/use-modal-store";

const EditServerModal = () => {
  const { isOpen, onClose, type , data } = useModal();
  const {server} = data;
  const router = useRouter();

  const isModalOpen = isOpen && type === "editServer";
  const [isPending, startTransition] = useTransition();
  const form = useForm<ServerValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

   useEffect(() => {
    if (server) {
      form.setValue("name" , server.name)
      form.setValue("imageUrl" , server.imageUrl)
    }
   } , [form , server])

  function onSubmit(values: ServerValues) {
    
    startTransition(async () => {
      if (!server) return;
      const editedServer = await editServer({ serverId : server.id   ,  values});

      if (editedServer) {
        onClose();
        router.refresh();
        router.push(`/servers/${editedServer.id}`);
      }
    });
  }

 
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="h3-bold text-center">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a cute name and an image, You can always change it
            later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase p-bold-16  text-zinc-500 dark:text-secondary/70 ">
                      Server name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        className="input-field"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isPending}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServerModal;
