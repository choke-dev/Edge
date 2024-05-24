import { Events } from "discord.js";
import { EventModule } from "../handler";
import { DiscordClient } from "../handler/util/DiscordClient";

export = {
    name: Events.ClientReady,
    once: true,
    async execute(_client: DiscordClient): Promise<void> {
        //setInterval(async () => {
        //    
        //}, 86400000 /* 1 day */);
    }
} as EventModule;