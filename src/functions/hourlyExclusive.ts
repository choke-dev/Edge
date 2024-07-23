import { GuildMember } from "discord.js";
import { hourlyExclusive } from "../config";
import { DiscordClient } from "src/handler/util/DiscordClient";

let timeout: NodeJS.Timeout;
let hourlyExclusiveUserId: string | undefined;

const getRandomOnlineMember = async (client: DiscordClient): Promise<GuildMember> => {
    const guild = await client.guilds.fetch(hourlyExclusive.guildId);
    const guildMembers = await guild.members.fetch({ withPresences: true });
    const onlineMembers = guildMembers
    .filter(member => !member.user.bot)
    .filter(member => member.presence && !hourlyExclusive.ineligibleUserStates.includes(member.presence.status.toString()))
    .filter(member => !member.roles.cache.has(hourlyExclusive.roleId))
    .filter(member => !hourlyExclusive.blacklistedUsers.includes(member.user.id));

    const chosenMember = onlineMembers?.random();
    if (!chosenMember) return await getRandomOnlineMember(client);

    return chosenMember
}

export const assignHourlyExclusive = async (client: DiscordClient): Promise<void> => {
    if (hourlyExclusiveUserId) {
        const guild = await client.guilds.fetch(hourlyExclusive.guildId);
        const member = await guild.members.fetch(hourlyExclusiveUserId);
        if (member) member.roles.remove(hourlyExclusive.roleId);
        hourlyExclusiveUserId = undefined;
    }

    const randomMember = await getRandomOnlineMember(client);
    
    const channel = await client.channels.fetch(hourlyExclusive.channelId);
    if (channel && channel.isTextBased() && !channel.isDMBased()) {
        randomMember.roles.add(hourlyExclusive.roleId);
        hourlyExclusiveUserId = randomMember.id;
        channel.send({ content: `<@${randomMember.id}>, you are now the exclusive member of the hour!` });
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => assignHourlyExclusive(client), 60 * 60 * 1000);
    }
}