import { Intent } from "./handler";

const emojiSets = [
    ["👍", "😂", "😳", "🤔", "😲", "😢", "😡", "🧵"],
    ["❤️", "🤩", "🤯", "😳", "🤨", "😐", "😢", "🧵"],
    ["👍", "👎", "❔", "🧵"],
];

export const prefix: string = "!";
export const defaultIntents: Intent[] = [Intent.Guilds, Intent.MessageContent];

// Default folder names.
export const eventsFolderName: string = "events";
export const commandsFolderName: string = "commands";
export const componentsFolderName: string = "components";

// Your Discord ID (for owner only commands)
export const ownerId: string = "208876506146013185";

export const mediaChannels: Record<string, { emojiSet: string[], textAllowed: boolean }> = {
    "1241695709212704778": { emojiSet: emojiSets[0], textAllowed: false }, // media
    "1241669747108483072": { emojiSet: emojiSets[0], textAllowed: false }, // creations
    "1241444035512500295": { emojiSet: emojiSets[1], textAllowed: false }, // art
    "1241444691015110778": { emojiSet: emojiSets[0], textAllowed: false }, // memes
    "1241431269527523409": { emojiSet: emojiSets[2], textAllowed: true }, // gamenight-suggestions
    "1241706024969306182": { emojiSet: emojiSets[0], textAllowed: false }, // gamenight-media
  }