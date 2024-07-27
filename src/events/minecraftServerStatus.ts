const { ToadScheduler, SimpleIntervalJob } = require('toad-scheduler')
import { Embed, EmbedBuilder, Events, Message } from "discord.js";
import { JsonDB, Config } from 'node-json-db';
import mc from "@ahdg/minecraftstatuspinger";
import { AsyncTask } from "toad-scheduler";

import { DiscordClient } from "../handler/util/DiscordClient";
import { ServerStatus } from "../handler/types/MCStatus";
import { EventModule } from "../handler";
import { minecraft } from "../config";
import Logger from "../handler/util/Logger";

var db = new JsonDB(new Config("data", true, false, '/'));
const scheduler = new ToadScheduler()

async function getServerStatusChannel(client: DiscordClient) {
  let serverStatusChannel = await client.channels.cache.get(minecraft.serverStatusChannel)
  
  if (!serverStatusChannel) {
    throw Error("serverStatusChannel does not exist!")
  }
  if (!serverStatusChannel.isTextBased() || serverStatusChannel.isDMBased()) {
    throw Error("serverStatusChannel isn't a text channel in a server!")
  }
  
  return serverStatusChannel;
}

async function serverStatusEmbedExists(client: DiscordClient) {
  const serverStatusMessageId = await db.getObjectDefault("/messageId", null);
  if (!serverStatusMessageId) {
    return null;
  }
  
  const serverStatusChannel = await getServerStatusChannel(client)
  
  const serverStatusMessage = await serverStatusChannel.messages.fetch(serverStatusMessageId).catch(_err => null)
  if (!serverStatusMessage) {
    return null;
  }
  return serverStatusMessage
}

async function queryServerStatus(): Promise<[ServerStatus, null] | [null, unknown]> {
  try {
    const result = await mc.lookup({ 
      host: minecraft.targetServerIP,
      ping: true
    }) as ServerStatus
    return [result, null]
  } catch(err) {
    return [null, err]
  }
}

async function updateMessageEmbed(client: DiscordClient, embed: Embed, message?: Message | null): Promise<void> {  
  const messageSendOptions: { content: string, embeds: Embed[] } = {
    content: `Refreshing server status <t:${Math.floor( (Date.now() + minecraft.refreshInterval) / 1000 ) - 3}:R>`,
    embeds: [embed]
  }

  if (!message) {
    Logger.warn("MC Server status message does not exist, creating new one...")
    const serverStatusChannel = await getServerStatusChannel(client);
    const serverStatusMessage = await serverStatusChannel.send(messageSendOptions)
    db.push('/messageId', serverStatusMessage.id)
    return;
  }

  try {
    await message.edit(messageSendOptions)
    return;
  } catch(err) {
    const serverStatusEmbedMessage = await serverStatusEmbedExists(client)
    if (serverStatusEmbedMessage) {
      Logger.warn(`Failed to edit MC Server status embed: ${err}`)
      return;
    }
    const serverStatusChannel = await getServerStatusChannel(client);
    const serverStatusMessage = await serverStatusChannel.send(messageSendOptions)
    db.push('/messageId', serverStatusMessage.id)
    return;
  }
}

async function updateServerStatusEmbed(): Promise<Embed> {
  const serverData = await queryServerStatus();
  const serverStatusEmbed = new EmbedBuilder()
  
  if (!serverData[0] || !serverData[0].status?.players) {
    serverStatusEmbed.setAuthor({ name: 'The server is currently offline.', iconURL: minecraft.iconSettings.offline })
    serverStatusEmbed.setColor("#000000")
    return serverStatusEmbed as unknown as Embed
  }
  
  const activePlayerCount = serverData[0].status?.players.sample?.length ?? serverData[0].status?.players.online
  const maxPlayerCount = serverData[0].status?.players.max
  const serverLatency = serverData[0].latency
  const playerList = (serverData[0].status.players.sample && activePlayerCount >= 1)
  ? serverData[0].status.players.sample
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((player) => `- \`${player.name}\``)
  .join("\n")
  : null;
  
  serverStatusEmbed
  .setAuthor({ name: `The server currently has ${activePlayerCount}/${maxPlayerCount} players online.`, iconURL: (activePlayerCount >= 1 ? minecraft.iconSettings.online : minecraft.iconSettings.empty) })
  .setColor( (activePlayerCount >= 1 ? "#3fb950" : "#000000") )
  .setDescription(playerList)
  .setFooter({ text: (serverLatency ? `Latency: ${serverLatency}ms` : "​") })
  return serverStatusEmbed as unknown as Embed
}   

export = {
  name: Events.ClientReady,
  once: true,
  async execute(client: DiscordClient): Promise<void> {
    if (!minecraft.enabled) return;
    let serverStatusMessage = await serverStatusEmbedExists(client);
    let serverStatusEmbed = await updateServerStatusEmbed()
    
    updateMessageEmbed(client, serverStatusEmbed, serverStatusMessage)
    
    const task = new AsyncTask(
      "Minecraft server status update loop", 
      async () => {
        serverStatusMessage = await serverStatusEmbedExists(client);
        serverStatusEmbed = await updateServerStatusEmbed()
        updateMessageEmbed(client, serverStatusEmbed, serverStatusMessage)
      },
      (err: Error) => {}
    )
    const job = new SimpleIntervalJob({ seconds: (minecraft.refreshInterval / 1000), }, task)
    scheduler.addSimpleIntervalJob(job)
  }
} as EventModule;

// 7c7c7c
// 3fb950