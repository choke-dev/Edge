import { EventModule } from "../handler";
import { Events, Message, PermissionFlagsBits } from "discord.js";
import Logger from "../handler/util/Logger";
import { mediaChannels } from "../config";

export = {
    name: Events.MessageCreate,
    async execute(message: Message): Promise<void> {
        if (!message?.guildId) return;

        const channelId = String(message.channelId);
        const channelConfig = mediaChannels[channelId];
        if (!channelConfig) return;

        if (message.author.id === message.client.user.id) {
          message.delete(); // delete messages from the bot
          return;
        }

        const isMemberImmune = message.member?.permissions.has(PermissionFlagsBits.ManageMessages, true);
        const isMemberBooster = message.member?.premiumSince;

        if (message.attachments.size === 0 && message.embeds.length === 0 && !channelConfig.textAllowed) {
          if (isMemberImmune) return;
          if (isMemberBooster) return;
        
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