// Packages
import { Events } from "discord.js";
import { EventModule } from "../handler";

// Types & Configs
import { DiscordClient } from "../handler/util/DiscordClient";
import { assignHourlyExclusive } from "../functions/hourlyExclusive";

export = {
    name: Events.ClientReady,
    once: true,
    async execute(client: DiscordClient): Promise<void> {
        assignHourlyExclusive(client);
    }
} as EventModule;