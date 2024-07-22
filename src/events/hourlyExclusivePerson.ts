// Packages
import { Events } from "discord.js";
import { EventModule } from "../handler";

// Types & Configs
import { DiscordClient } from "../handler/util/DiscordClient";
import { assignHourlyExclusive } from "../functions/hourlyExclusive";
import { hourlyExclusive } from "../config";

export = {
    name: Events.ClientReady,
    once: true,
    async execute(client: DiscordClient): Promise<void> {
        if (!hourlyExclusive.enabled) return;
        assignHourlyExclusive(client);
    }
} as EventModule;