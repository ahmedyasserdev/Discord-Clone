"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
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
import { channelSchema, ChannelValues } from "@/schemas";
import { useModal } from "@/hooks/use-modal-store";
import { Channel, ChannelType, Server } from "@prisma/client";
import { updatedChannel } from "@/lib/actions/channel.actions";

const EditChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === "editChannel";
  const { channel, server } = data as { channel: Channel, server: Server }
  const [isPending, startTransition] = useTransition();
  const form = useForm<ChannelValues>({
    resolver: zodResolver(channelSchema),
    defaultValues: {
      name: "",
      type: channel.type || ChannelType.TEXT
    },
  });

  function onSubmit(values: ChannelValues) {
    startTransition(async () => {
      const updatedServerWithUpdatedChannel = await updatedChannel({ values, serverId: server.id as string, channelId: channel.id as string });

      if (updatedServerWithUpdatedChannel) {
        handleClose();
        router.push(`/servers/${server.id}`);
        router.refresh();
      }
    });
  }

  function handleClose() {
    form.reset();
    onClose();
  }


  useEffect(() => {

    if (channel) {
      form.setValue("name", channel.name);
      form.setValue("type", channel.type);
    }
  }, [isModalOpen, form]);

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden p-0">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="h3-bold text-center">
            Edit Channel
          </DialogTitle>

        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">


              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase p-bold-16  text-zinc-500 dark:text-secondary/70 ">
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        className="input-field"
                        placeholder="Enter Channel name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />




              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel type</FormLabel>
                    <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="input-field capitalize ">
                          <SelectValue placeholder={'Select a channel type.'} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          Object.values(ChannelType).map((type) => (
                            <SelectItem key={type} value={type} className="capitalize" >{type.toLowerCase()}</SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>

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

export default EditChannelModal;
