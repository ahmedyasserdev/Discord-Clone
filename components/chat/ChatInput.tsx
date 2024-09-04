"use client"

import { ChatInputSchema, ChatInputValues } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

type ChatInputProps = {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "conversation" | "channel";
}
const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
    const [isPending , startTransition] = useTransition()
    const form = useForm<ChatInputValues>({
        resolver: zodResolver(ChatInputSchema),
        defaultValues: {
            content: '',
        }
    });
    const onSubmit = async(values: ChatInputValues) => {
        
    }
    return (
        <div>ChatInput</div>
    )
}

export default ChatInput