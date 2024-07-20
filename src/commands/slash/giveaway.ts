import { Config, JsonDB } from "node-json-db";
import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../handler";
import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

const giveawayDB = new JsonDB(new Config("databases/giveaways", true, false, '.'));
const generateRandomHex = (size: number) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
const timeUnits = ["m", "h", "d", "w", "mo", "y"];

function parseTimeInput(input: string): { value: number, unit: string } | null {
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

function calculateFutureTimestamp(input: string): number | null {
    const parsed = parseTimeInput(input);
    if (!parsed) {
        return null;
    }

    const { value, unit } = parsed;
    const now = Math.floor(Date.now() / 1000);

    let multiplier;
    switch (unit) {
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

export = {
    type: CommandTypes.SlashCommand,
    register: RegisterTypes.Guild,
    data: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("???")
        .addSubcommand( subcommand => subcommand
            .setName('create')
            .setDescription('Creates a giveaway')
            .addStringOption(option => option
                .setName('time')
                .setDescription('Specifies how long the giveaway should last')
                .setAutocomplete(true)
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('winners')
                .setDescription('Specifies how many users can win the giveaway')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('name')
                .setDescription('Specifies the name of the giveaway')
                .setRequired(true)
            )
        )
        
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async autocomplete(interaction) {
        const focusedValue = interaction.options.getFocused();
    
        const timeUnits = ["m", "h", "d", "w", "mo", "y"];
    
        for (const timeUnit of timeUnits) {
            if (!focusedValue.endsWith(timeUnit)) continue;
            return interaction.respond([{ name: focusedValue, value: focusedValue }]);
        }

        const isNumber = !isNaN(Number(focusedValue)) && focusedValue !== '';
        if (!isNumber) return null;
    
        // Return the suggestions
        await interaction.respond(timeUnits.map(unit => ({
            name: `${focusedValue}${unit}`,
            value: `${focusedValue}${unit}`
        })));
    },

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const giveawayTimeLeft = calculateFutureTimestamp( interaction.options.getString("time", true) )
        const giveawayWinners = interaction.options.getInteger("winners", true);
        const giveawayName = interaction.options.getString("name", true);
        const giveawayId = generateRandomHex(8);

        if (giveawayWinners <= 0) {
            interaction.reply({ content: ":x: Winners must be greater than 0", ephemeral: true });
            return
        }

        const giveawayEmbed = new EmbedBuilder()
        .setTitle(giveawayName)
        .setDescription([
            "React with :tada: to enter!",
            `Giveaway ending <t:${giveawayTimeLeft}:R>`,
            `Hosted by: ${interaction.user}`
        ].join("\n"))
        .setFooter({ text: `${giveawayWinners} winner${Math.abs(giveawayWinners) === 1 ? "" : "s"} • Giveaway ID: ${giveawayId}` })
        .setColor("#ecc741")
        interaction.reply({ content: ':tada: **GIVEAWAY** :tada:', embeds: [giveawayEmbed], fetchReply: true }).then(message => {
            message.react("🎉")
        })
    }
} as SlashCommandModule;