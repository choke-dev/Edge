import { CommandTypes, ContextMenuCommandModule, RegisterTypes } from "../../handler";
import { ContextMenuCommandBuilder, ApplicationCommandType, ContextMenuCommandInteraction, User } from "discord.js";

export = {
    type: CommandTypes.ContextMenu,
    register: RegisterTypes.Guild,
    disabled: true,
    data: new ContextMenuCommandBuilder()
        .setName("Get Username")
        .setType(ApplicationCommandType.User),
    async execute(interaction: ContextMenuCommandInteraction): Promise<void> {
        const user: User = await interaction.client.users.fetch(interaction.targetId);
        await interaction.reply({ content: `Username: ${user.username}` });
    }
} as ContextMenuCommandModule;