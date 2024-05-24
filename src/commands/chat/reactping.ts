import { Message, MessageReaction, User } from "discord.js";
import { CommandTypes, PrefixCommandModule } from "../../handler";

// const emojiRegex = /(?:\p{RGI_Emoji})+/gu;
const customEmojiRegex = /<a?:\w+:\d+>/g;
const unicodeEmojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;

export = {
    name: "reactping",
    type: CommandTypes.PrefixCommand,
    async execute(message: Message): Promise<void> {
        const repliedMessage = await message.fetchReference().catch(() => null);
        if (!repliedMessage) {
            message.reply("Please reply to a message to use this command.");
            return;
        }
    
        const messageContent = message.content;
        const customEmojis = messageContent.match(customEmojiRegex) || [];
        const unicodeEmojis = messageContent.match(unicodeEmojiRegex) || [];
        const allEmojis = [...customEmojis, ...unicodeEmojis];
    
        if (allEmojis.length === 0) {
            message.reply("No emojis found in the message.");
            return;
        }
    
        const reactions = await repliedMessage.reactions.cache;

        console.log({ reactions });

        // console.log({ allEmojis, usersReacted });

        // const text = `Emoji target(s): ${allEmojis.join(", ")}\nUsers reacted: ${usersReacted.map(user => user.username).join(", ")}`;
        // message.reply(text);
        message.reply("OK")
    }
} as PrefixCommandModule;