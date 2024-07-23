import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../handler";
import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import Logger from "../../handler/util/Logger";

const timeUnits = ["s", "m", "h", "d", "w", "mo", "y"];

const parseTimeInput = (input: string): { value: number, unit: string } | null => {
    const match = input.match(/^(\d+)([a-z]+)$/i);
    if (!match) {
        return null;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (!timeUnits.includes(unit)) {
        return null;
    }

    return { value, unit };
}

const calculateFutureTimestamp = (input: string): number | null => {
    const parsed = parseTimeInput(input);
    if (!parsed) {
        return null;
    }

    const { value, unit } = parsed;
    const now = Math.floor(Date.now() / 1000);

    let multiplier;
    switch (unit) {
        case 's':
            multiplier = 1;
            break;
        case 'm':
            multiplier = 60;
            break;
        case 'h':
            multiplier = 60 * 60;
            break;
        case 'd':
            multiplier = 24 * 60 * 60;
            break;
        case 'w':
            multiplier = 7 * 24 * 60 * 60;
            break;
        case 'mo':
            multiplier = 30 * 24 * 60 * 60;
            break;
        case 'y':
            multiplier = 365 * 24 * 60 * 60;
            break;
        default:
            return null;
    }

    return now + (value * multiplier);
}

// checks if the client can timeout a member
const canClientTimeout = (member: GuildMember): [boolean, string | null] => {
    const clientMember = member.guild.members.me;
    if (!clientMember) return [false, "I am not in this server"]; // idk how this can happen
    
    const clientRolePosition = clientMember.roles.highest.comparePositionTo(member.roles.highest)
    console.log({ clientRolePosition });
    if (clientRolePosition === 0) {
        return [false, "I cannot put this user in timeout because they have the same role as me"];
    } else if (clientRolePosition > 0) {
        return [false, "I cannot put this user in timeout because they have a higher role than me"];
    }

    return [true, null];
}

// checks if the executor can timeout the member
const canTimeoutMember = (executor: GuildMember, member: GuildMember): [boolean, string | null] => {
    const memberBot = member.user.bot;
    if (memberBot) {
        return [false, "You cannot put bots in timeout"];
    }

    const isTargetSelf = executor.id === member.id;
    if (isTargetSelf) {
        return [false, "You cannot put yourself in timeout"];
    }

    const rolePosition = member.roles.highest.comparePositionTo(executor.roles.highest)
    console.log({ rolePosition });
    if (rolePosition === 0) {
        return [false, "You cannot put this user in timeout because they have the same role as you"];
    } else if (rolePosition > 0) {
        return [false, "You cannot put this user in timeout because they have a higher role than you"]; 
    }
    
    return [true, null];
}

export = {
    type: CommandTypes.SlashCommand,
    register: RegisterTypes.Guild,
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("???")
        .addUserOption(option => option
            .setName('user')
            .setDescription('Specifies the user to be timed out')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('time')
            .setDescription('Specifies how long the user should be put in timeout for')
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Specifies the reason for the timeout')
        )
        .addBooleanOption(option => option
            .setName('notify')
            .setDescription('Whether or not to notify the user (Default: true)')
        )
        
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

    async autocomplete(interaction) {
        const durationSet = [
            { name: "5m", value: "5m" },
            { name: "15m", value: "15m" },
            { name: "30m", value: "30m" },
            { name: "1h", value: "1h" },
            { name: "2h", value: "2h" },
            { name: "4h", value: "4h" },
            { name: "8h", value: "8h" },
            { name: "12h", value: "12h" },
            { name: "1d", value: "1d" }
        ];
        const focusedValue = interaction.options.getFocused();
    
        for (const timeUnit of timeUnits) {
            if (!focusedValue.endsWith(timeUnit)) continue;
            return interaction.respond([{ name: focusedValue, value: focusedValue }]);
        }

        const isNumber = !isNaN(Number(focusedValue)) && focusedValue !== '';
        if (!isNumber) {
            return interaction.respond(durationSet);
        }
    
        // Return the suggestions
        await interaction.respond(timeUnits.map(unit => ({
            name: `${focusedValue}${unit}`,
            value: `${focusedValue}${unit}`
        })));
    },

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const executorMember = await interaction.guild?.members.fetch(interaction.user.id);
        const timeoutMember = await interaction.guild?.members.fetch(interaction.options.getUser("user", true).id);
        const timeoutDuration = interaction.options.getString("time", true)
        const parsedTimeoutDuration = calculateFutureTimestamp( timeoutDuration )
        const timeoutReason = interaction.options.getString("reason") ?? "No reason provided"
        const notifyUser = interaction.options.getBoolean("notify") ?? true;

        if (!executorMember) return;
        if (!timeoutMember) {
            interaction.reply({ content: ":x: Specified member is not in this server", ephemeral: true });
            return;
        }

        const [canTimeout, reason] = canTimeoutMember(executorMember, timeoutMember);
        if (!canTimeout && reason) {
            interaction.reply({ content: `:x: ${reason}`, ephemeral: true });
            return;
        }

        const [canPutInTimeout, reason2] = canClientTimeout(timeoutMember);
        if (!canPutInTimeout && reason2) {
            interaction.reply({ content: `:x: ${reason2}`, ephemeral: true });
            return;
        }

        if (!parsedTimeoutDuration) {
            interaction.reply({ content: ":x: Specified duration is invalid", ephemeral: true });
            return;
        }

        if (parsedTimeoutDuration > (28 * 24 * 60 * 60 * 1000)) {
            interaction.reply({ content: ":x: Duration must be less than 28 days", ephemeral: true });
            return;
        }

        if (!timeoutMember) {
            interaction.reply({ content: ":x: Specified member is not in this server", ephemeral: true });
            return;
        }

        if (timeoutMember.communicationDisabledUntilTimestamp) {
            interaction.reply({ content: ":x: Member is already timed out", ephemeral: true });
            return;
        }

        try {
            await timeoutMember.timeout(parsedTimeoutDuration, `${timeoutReason} • Moderator: ${interaction.user.username} (${interaction.user.id})`)
        } catch(error) {
            Logger.error(`Failed to timeout ${timeoutMember.user.username} (${timeoutMember.user.id})`, error);
            interaction.reply({ content: `:x: An error occured while trying to timeout ${timeoutMember.user}`, ephemeral: true });
            return;
        }

        try {
            if (!notifyUser) return;
            const userDM = await timeoutMember.user.createDM();
            const timeoutNotificationEmbed = new EmbedBuilder()
            .setTitle(`You have been timed out from ${interaction.guild?.name}`)
            .setDescription([
                `Duration: ${timeoutDuration} (<t:${parsedTimeoutDuration}:R>)`,
                `Reason: ${timeoutReason}`
            ].join("\n"))
            .setColor("#f23f42")
            userDM.send({ embeds: [timeoutNotificationEmbed] })
        } catch(error) {
            Logger.error(`An error occured while trying to DM ${timeoutMember.user}`, error);
            interaction.reply({ content: `:warning: An error occured while trying to DM ${timeoutMember.user}`, ephemeral: true });
        }

        const timeoutEmbed = new EmbedBuilder()
            .setTitle("User timed out")
            .setDescription([
                `User: ${timeoutMember.user}`,
                `Duration: ${timeoutDuration} (<t:${parsedTimeoutDuration}:R>)`,
                `Reason: ${timeoutReason}`
            ].join("\n"))
            .setColor("#43b582")

        await interaction.reply({ embeds: [timeoutEmbed], ephemeral: true });
    }
} as SlashCommandModule;