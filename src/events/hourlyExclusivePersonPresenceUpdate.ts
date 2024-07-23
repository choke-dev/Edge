import { Events, GuildMember, Presence } from "discord.js";
import { EventModule } from "../handler";
import { hourlyExclusive } from "../config";
import { DiscordClient } from "src/handler/util/DiscordClient";
import { assignHourlyExclusive } from "../functions/hourlyExclusive";
import Logger from "../handler/util/Logger";

export = {
    name: Events.PresenceUpdate,
    async execute(_oldPresence: Presence, newPresence: Presence): Promise<void> {
        if (!hourlyExclusive.enabled) return;
        if (!newPresence.guild) return;
        if (!newPresence.member) return;
        if (!newPresence.member.roles.cache.has(hourlyExclusive.roleId)) return;
        if (!hourlyExclusive.ineligibleUserStates.includes(newPresence.status.toString())) return;
        try {
            newPresence.member.roles.remove(hourlyExclusive.roleId);
        } catch(err) {
            Logger.warn(`An error occured while removing role: ${err}`)
        }
        assignHourlyExclusive(newPresence.client as DiscordClient);
    }
} as EventModule;