import * as process from 'process';
import { Client, Intents, VoiceChannel } from 'discord.js';
import { createAudioPlayer, joinVoiceChannel } from '@discordjs/voice';

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Please make sure that ${name} is set!`);
  }
  return value;
}

// Read config from env
const botToken = getEnv('BOT_TOKEN');
const voiceChannelId = getEnv('VOICE_CHANNEL_ID');
const streamUrl = getEnv('STREAM_URL');

const client = new Client({ intents: [] });

client.on('ready', async () => {
  const channel = await client.channels.fetch(voiceChannelId) as VoiceChannel;
  if (!channel.isVoice()) {
    throw new Error('Not a voice channel!');
  }
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guildId,
    adapterCreator: channel.guild.voiceAdapterCreator
  });
});

// Connect to Discord
client.login(botToken);
