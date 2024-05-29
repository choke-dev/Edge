import { EventModule } from "../handler";
import { EmbedBuilder, Events, Message, TextBasedChannel } from "discord.js";

const _messageEditedChannel = "1245244563036180480";

const _defaultAvatar = "https://cdn.discordapp.com/embed/avatars/0.png";

export = {
    name: Events.MessageUpdate,
    async execute(_oldMessage: Message, _newMessage: Message): Promise<void> {
        return;
        // if (newMessage.author.bot) return;
        // if (!oldMessage.guild) return;
        // if (oldMessage.channelId === messageEditedChannel) return;
// 
        // const oldMessageContent = oldMessage.content;
        // const newMessageContent = newMessage.content;
        // 
        // if (!oldMessageContent || !newMessageContent) return;
        // if (oldMessageContent === newMessageContent) return;
        // 
        // const editedMessageEmbed = new EmbedBuilder()
        //     .setColor("#faa41b")
        //     .setAuthor({ name: `[LOG] ${oldMessage.author.username}`, iconURL: oldMessage.author.avatarURL() || defaultAvatar })
        //     .addFields(
        //         { name: "User:", value: oldMessage.author.toString() || 'Could not find author', inline: true },
        //         { name: "Channel:", value: oldMessage.channel.url || 'Could not find channel', inline: true },
        //         { name: "⠀", value: "⠀", inline: true },
        //         { name: "Previous Content:", value: oldMessage.content || 'Could not find content', inline: true },
        //         { name: "Current Content:", value: newMessage.content || 'Could not find content', inline: true },
        //         { name: "⠀", value: `[Jump to Message](${oldMessage.url})` }
        //     )
// 
        // const targetChannel = await oldMessage.guild.channels.cache.get(messageEditedChannel);
        // if (!targetChannel) return;
        // if (!targetChannel.isTextBased()) return;
// 
        // targetChannel.send({ embeds: [editedMessageEmbed] });
        // return;
    }
} as EventModule;