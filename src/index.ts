import * as process from 'process';
import { Client, Intents, VoiceChannel } from 'discord.js';
import { createStreamingPlayer } from './player';
import { createVoiceConnection } from './connection';
import { info } from './utils';

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

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});

client.on('ready', async () => {
  info('Ready!');

  // Look up voice channel
  const channel = await client.channels.fetch(voiceChannelId) as VoiceChannel;
  if (!channel.isVoice()) {
    throw new Error('Not a voice channel!');
  }

  // Create connection and start streaming
  const connection = await createVoiceConnection(channel);
  const player = await createStreamingPlayer(streamUrl);
  connection.subscribe(player);
});

// Connect to Discord
client.login(botToken);
