import { Events, Message } from "discord.js";
import { EventModule } from "../handler";
import { hourlyExclusive } from "../config";
import Logger from "../handler/util/Logger";

let userIdOfUserWhoSentFirstMessage: string;

export = {
    name: Events.MessageCreate,
    async execute(message: Message): Promise<void> {
        if (!hourlyExclusive.enabled) return;
        if (!message.guild) return;
        if (!message.member) return;
        if (!message.member.roles.cache.has(hourlyExclusive.roleId)) return;
        if (message.channelId !== hourlyExclusive.channelId) return;
        
        if (userIdOfUserWhoSentFirstMessage !== message.author.id) {
            userIdOfUserWhoSentFirstMessage = message.author.id;
            return;
        }

        try {
            message.delete();
        } catch(err) {
            Logger.warn(`An error occured while deleting message: ${err}`)
        }
    }
} as EventModule;