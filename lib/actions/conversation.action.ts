'use server'

import { db } from "../db"

export const findConversation = async ({ memberOneId, memberTwoId }: { memberOneId: string, memberTwoId: string }) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    { memberOneId },
                    { memberTwoId }
                ]
            },
            include: {
                memberOne: { include: { profile: true } },
                memberTwo: {
                    include: { profile: true }
                }
            }
        })
    } catch (error) {
        console.log("[FIND_CONVERSATION_ACTION]", error)
        return null

    }
}



export const createNewConversation = async ({ memberOneId, memberTwoId }: { memberOneId: string, memberTwoId: string }) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId,
                memberTwoId
            },
            include: {
                memberOne: { include: { profile: true } },
                memberTwo: {
                    include: { profile: true }
                }
            }
        })
    } catch (error) {
        console.log("[NEW_CONVERSATION_ACTION]", error);
        return null
    }
}


export const findOrCreateConversation = async ({ memberOneId, memberTwoId }: { memberOneId: string, memberTwoId: string }) => {
    let conversation = await findConversation({ memberOneId, memberTwoId }) || await findConversation({ memberOneId: memberTwoId, memberTwoId: memberOneId });;
    if (!conversation) {
        conversation = await createNewConversation({ memberOneId, memberTwoId });
    }
    return conversation
}