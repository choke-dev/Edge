import { EventModule } from "../handler";
import { Events, Message, PermissionFlagsBits } from "discord.js";
import Logger from "../handler/util/Logger";

const emojiSets = [
    ["👍", "😂", "😳", "🤔", "😲", "😢", "😡", "🧵"],
    ["❤️", "🤩", "🤯", "😳", "🤨", "😐", "😢", "🧵"],
    ["👍", "👎", "❔", "🧵"],
];

const config = {
  "1241695709212704778": { emojiSet: emojiSets[0], textAllowed: false }, // media
  "1241669747108483072": { emojiSet: emojiSets[0], textAllowed: false }, // creations
  "1241444035512500295": { emojiSet: emojiSets[1], textAllowed: false }, // art
  "1241444691015110778": { emojiSet: emojiSets[0], textAllowed: false }, // memes
  "1241431269527523409": { emojiSet: emojiSets[2], textAllowed: true }, // gamenight-suggestions
  "1241706024969306182": { emojiSet: emojiSets[0], textAllowed: false }, // gamenight-media
}

export = {
    name: Events.MessageCreate,
    async execute(message: Message): Promise<void> {
        if (!message?.guildId) return;

        const channelId = String(message.channelId);
        const channelConfig = (config as Record<string, { emojiSet: string[], textAllowed: boolean }>)[channelId];
        if (!channelConfig) return;

        if (message.author.id === message.client.user.id) {
          message.delete(); // delete messages from the bot
          return;
        }

        const isMemberImmune = message.member?.permissions.has(PermissionFlagsBits.ManageMessages, true)

        if (message.attachments.size === 0 && message.embeds.length === 0 && !channelConfig.textAllowed) {
          if (isMemberImmune) return;
        
          message.delete();
          return;
        }
    
        for (let i = 0; i < channelConfig.emojiSet.length; i++) {
          try {
            await message.react(channelConfig.emojiSet[i])
          } catch (err) {
            Logger.warn(`An error occured while adding reactions: ${err}`)
            break;
          }
        }
    }
} as EventModule;