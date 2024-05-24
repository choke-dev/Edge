import { Message } from "discord.js";
import { CommandTypes, PingCommandModule } from "../../handler";

export = {
    name: "help",
    disabled: true,
    type: CommandTypes.PingCommand,
    async execute(message: Message): Promise<void> {
        await message.reply("How can I help you?");
    }
} as PingCommandModule;