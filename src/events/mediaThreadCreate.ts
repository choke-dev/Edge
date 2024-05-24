import { Events, MessageReaction, ThreadAutoArchiveDuration, User } from "discord.js";
import { EventModule } from "../handler";

const threadCreationChannelIds: string[] = [
    "1241695709212704778", // media
    "1241669747108483072", // creations
    "1241444691015110778", // memes
    "1241444035512500295", // art
    "1241431269527523409", // gamenight-suggestions
    "1241706024969306182", // gamenight-media
  ]

export = {
    name: Events.MessageReactionAdd,
    async execute(messageReaction: MessageReaction, reacter: User): Promise<void> {
        if (messageReaction.emoji.name !== "🧵") return;
        if (!threadCreationChannelIds.includes(messageReaction.message.channelId)) return;
        if (reacter.id === messageReaction.client.user.id) return;

        messageReaction.remove();
            
        const message = messageReaction.message
        let threadName: string = message?.content?.split("\n")[0] || "...";
            
        if (threadName?.length > 100) {
          threadName = threadName.slice(0, 100);
        }
    
        message.startThread({
            autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
            name: threadName
        }).then(threadChannel => {
            threadChannel.send(`${reacter} started a thread for this message.`)
        })
    }
} as EventModule;