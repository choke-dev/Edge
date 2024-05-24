import { CommandTypes, RegisterTypes, SlashCommandModule } from "../../handler";
import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export = {
    type: CommandTypes.SlashCommand,
    register: RegisterTypes.Guild,
    data: new SlashCommandBuilder()
        .setName("findplayer")
        .setDescription("Finds a player's server in a specified roblox game.")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
    async execute(interaction: CommandInteraction): Promise<void> {
        await interaction.reply({ content: "wip" });
    }
} as SlashCommandModule;