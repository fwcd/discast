import { joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { VoiceChannel } from "discord.js";
import { info, error } from "./utils";

/** Connects to the given voice channel. */
export async function createVoiceConnection(channel: VoiceChannel): Promise<VoiceConnection> {
  info(`Joining ${channel.name} on guild ${channel.guild.name} (${channel.id})`);
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guildId,
    adapterCreator: channel.guild.voiceAdapterCreator
  });

  connection.on('stateChange', (o, n) => {
    info(`Connection status: ${o.status} -> ${n.status}`);
  });

  connection.on('error', e => {
    error(`Connection error: ${e}`);
  });

  return connection;
}
