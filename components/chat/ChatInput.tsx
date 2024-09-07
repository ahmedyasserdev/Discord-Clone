"use client"

import { ChatInputSchema, ChatInputValues } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "../ui/button";
import { Plus,  } from "lucide-react";
import qs from "query-string"
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import EmojiPicker from "../shared/EmojiPicker";
import { useRouter } from "next/navigation";
type ChatInputProps = {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "conversation" | "channel";
}
const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
    const { onOpen } = useModal()
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const form = useForm<ChatInputValues>({
        resolver: zodResolver(ChatInputSchema),
        defaultValues: {
            content: '',
        }
    });
    const onSubmit =  (values: ChatInputValues) => {
        startTransition(async () => {
            try {
                const url = qs.stringifyUrl({
                    url: apiUrl,
                    query,
                });
                await axios.post(url, values);
                form.reset();
                router.refresh()
            } catch (error) {
                console.log(error)
            }
        })
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative p-4 pb-6">
                                    <button onClick={() => onOpen("messageFile", { apiUrl, query })} type="button" className="absolute top-7 left-8 size-[24px] bg-zinc-500  dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 rounded-full flex-center transition" >
                                        <Plus className="size-4 text-white dark:text-[#313338]" />
                                    </button>

                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        className="px-14 py-6  bg-zinc-200/90 dark:bg-zinc-700/75  border-0 focus-visible:ring-0 focus-visible:ring-offset-0  dark:text-zinc-200 text-zinc-700"
                                        placeholder={`Message with ${type === "conversation" ? name : "#" + name}`}
                                    />

                                    <div className="absolute top-7 right-8">
                                        <EmojiPicker onChange={(emoji : string) => field.onChange(`${field.value} ${emoji}`) } />
                                    </div>

                                </div>
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}

export default ChatInput

