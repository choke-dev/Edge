import Logger from "../handler/util/Logger";
import { Events, ActivityType } from "discord.js";
import { EventModule, UserStatus } from "../handler";
import { DiscordClient } from "../handler/util/DiscordClient";
import { activity } from "../config";

function getRandomInt(min: number, max: number) {
    return Math.floor( Math.random() * (max - min) + min );
}

function switchActivity(client: DiscordClient) {
    if (!client.user) return;
    const randomState = activity.states[getRandomInt(0, activity.states.length)]
    //@ts-ignore compiler blind af
    client.user.setStatus(randomState.status);
    client.user.setActivity({ name: randomState.text, type: randomState.activityType })
}

export = {
    name: Events.ClientReady,
    once: true,
    async execute(client: DiscordClient): Promise<void> {
        if (!client.user) return;
        
        switchActivity(client);
        setInterval(() => {switchActivity(client)}, activity.settings.refreshInterval)

        Logger.log(`Ready! Logged in as ${client.user.tag}`);
    }
} as EventModule;