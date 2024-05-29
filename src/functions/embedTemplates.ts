import { EmbedBuilder, Interaction } from "discord.js";

export function getCommandNotAllowedEmbed(interaction: Interaction): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle("You are not allowed to use this command!")
        .setColor("#DA373C")
}
// Generates an embed when a command is on cooldown.
export function getCommandOnCooldownEmbed(timeLeft: number, commandName: string): EmbedBuilder {
    return new EmbedBuilder()
        .setTitle("Command on cooldown")
        .setColor("#DA373C")
        .setDescription(`Please wait ${timeLeft} more second(s) before reusing the \`${commandName}\` command.`);
}