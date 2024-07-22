import { Events, GuildMember, Presence } from "discord.js";
import { EventModule } from "../handler";
import { hourlyExclusive } from "../config";
import { DiscordClient } from "src/handler/util/DiscordClient";
import { assignHourlyExclusive } from "../functions/hourlyExclusive";

export = {
    name: Events.PresenceUpdate,
    async execute(_oldPresence: Presence, newPresence: Presence): Promise<void> {
        if (!hourlyExclusive.enabled) return;
        if (!newPresence.guild) return;
        if (!newPresence.member) return;
        if (!newPresence.member.roles.cache.has(hourlyExclusive.roleId)) return;
        if (!hourlyExclusive.ineligibleUserStates.includes(newPresence.status.toString())) return;
        newPresence.member.roles.remove(hourlyExclusive.roleId);
        assignHourlyExclusive(newPresence.client as DiscordClient);
    }
} as EventModule;