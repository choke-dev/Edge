import { ActivityType } from "discord.js";
import { Intent, UserStatus } from "./handler";

const emojiSets = [
    ["👍", "😂", "😳", "🤔", "😲", "😢", "😡", "🧵"],
    ["❤️", "🤩", "🤯", "😳", "🤨", "😐", "😢", "🧵"],
    ["👍", "👎", "❔", "🧵"],
];

export const prefix: string = "!";
export const defaultIntents: Intent[] = [Intent.Guilds, Intent.MessageContent, Intent.GuildMembers, Intent.GuildPresences];

// Default folder names.
export const eventsFolderName: string = "events";
export const commandsFolderName: string = "commands";
export const componentsFolderName: string = "components";

// Your Discord ID (for owner only commands)
export const ownerId: string = "208876506146013185";

export const activity = {
    settings: {
        refreshInterval: 60 * 60 * 1000
    },
    states: [
        { activityType: ActivityType.Playing, text: "Blockate", status: UserStatus.Online },
        { activityType: ActivityType.Playing, text: "Minecraft", status: UserStatus.Online },
        { activityType: ActivityType.Watching, text: "Youtube", status: UserStatus.Dnd },
    ]
}

export const mediaChannels = {
    enabled: true,
    channels: {
        "1241695709212704778": { emojiSet: emojiSets[0], textAllowed: false }, // media
        "1241669747108483072": { emojiSet: emojiSets[0], textAllowed: false }, // creations
        "1241444035512500295": { emojiSet: emojiSets[1], textAllowed: false }, // art
        "1241444691015110778": { emojiSet: emojiSets[0], textAllowed: false }, // memes
        "1241431269527523409": { emojiSet: emojiSets[2], textAllowed: true }, // gamenight-suggestions
        "1241706024969306182": { emojiSet: emojiSets[0], textAllowed: false }, // gamenight-media
        "1262585217437139026": { emojiSet: emojiSets[0], textAllowed: false }, // mc-media
        "1262650657010221126": { emojiSet: emojiSets[1], textAllowed: false }, // cat
    } as Record<string, { emojiSet: string[], textAllowed: boolean }>
}

// Minecraft Server Status
export const minecraft = {
    enabled: true,
    serverStatusChannel: "1262585183714938960",
    targetServerIP: "mc.choke.dev",
    refreshInterval: 30 * 1000,
    iconSettings: {
        online: 'https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/de/71/69/de7169fe-c5d6-b3c1-b2c8-a17845020473/AppIcon-0-0-1x_U007emarketing-0-9-0-85-220.png/320x320bb.jpg',
        get empty() { return `https://wsrv.nl/?url=${this.online}&sat=0.3` },
        get offline() { return `https://wsrv.nl/?url=${this.online}&sat=0` }
    }
}; // mc-server-info

export const hourlyExclusive = {
    enabled: true,
    guildId: process.env["GUILD_ID"],
    channelId: "1264554134099591178",
    roleId: "1264559103876010056",
    ineligibleUserStates: ["invisible", "offline"],
    blacklistedUsers: ["924111005791957062"],
}