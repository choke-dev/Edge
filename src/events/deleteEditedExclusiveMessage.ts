import { Events, Message } from "discord.js";
import { EventModule } from "../handler";
import { hourlyExclusive } from "../config";
import Logger from "../handler/util/Logger";

export = {
    name: Events.MessageUpdate,
    async execute(_oldMessage: Message, newMessage: Message): Promise<void> {
        if (!hourlyExclusive.enabled) return;
        if (!newMessage.guild) return;
        if (!newMessage.member) return;
        if (!newMessage.member.roles.cache.has(hourlyExclusive.roleId)) return;
        if (newMessage.channelId !== hourlyExclusive.channelId) return;

        try {
            newMessage.delete();
        } catch(err) {
            Logger.warn(`An error occured while deleting message: ${err}`)
        }
        return;
    }
} as EventModule;