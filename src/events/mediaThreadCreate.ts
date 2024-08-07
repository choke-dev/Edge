import { Events, MessageReaction, ThreadAutoArchiveDuration, User } from "discord.js";
import { EventModule } from "../handler";
import { mediaChannels } from "../config";

export = {
    name: Events.MessageReactionAdd,
    async execute(messageReaction: MessageReaction, reacter: User): Promise<void> {
        if (messageReaction.emoji.name !== "🧵") return;
        if (!mediaChannels.channels[messageReaction.message.channelId]) return;
        if (reacter.id === messageReaction.client.user.id) return;

        messageReaction.remove();
            
        const message = messageReaction.message
        let threadName: string = message?.content?.split("\n")[0] || "...";
        threadName = threadName.replace(/<@!?(\d+)>/g, (match, id) => {
            const member = message.guild?.members.cache.get(id);
            if (member) return `@${member.nickname ?? member.user.username}`;
            return match;
        });
            
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