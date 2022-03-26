import { Client, Intents, VoiceChannel } from 'discord.js';
import { createStreamingPlayer } from './player';
import { createVoiceConnection } from './connection';
import { env, info } from './utils';

// Read config from environment
const botToken = env('BOT_TOKEN');
const voiceChannelId = env('VOICE_CHANNEL_ID');
const streamUrl = env('STREAM_URL');

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
