import * as process from 'process';
import * as http from 'http';
import * as https from 'https';
import { Client, Intents, VoiceChannel } from 'discord.js';
import { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior, StreamType } from '@discordjs/voice';

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Please make sure that ${name} is set!`);
  }
  return value;
}

function httpGet(url: string): Promise<http.IncomingMessage> {
  return new Promise(resolve => {
    if (url.startsWith('http:')) {
      http.get(url, resolve);
    } else if (url.startsWith('https:')) {
      https.get(url, resolve);
    } else {
      throw new Error(`Invalid URL scheme: ${url}`);
    }
  });
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
  console.log('Ready!');

  // Look up voice channel
  const channel = await client.channels.fetch(voiceChannelId) as VoiceChannel;
  if (!channel.isVoice()) {
    throw new Error('Not a voice channel!');
  }

  // Set up voice channel connection
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guildId,
    adapterCreator: channel.guild.voiceAdapterCreator
  });
  console.log(`Joined ${channel.name} on guild ${channel.guild.name} (${channel.id})`);

  connection.on('stateChange', (o, n) => {
    console.log(`stateChange: ${o.status} -> ${n.status}`);
  })
  connection.on('error', e => {
    console.error(e);
  });
  
  // Set up player
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play
    }
  });

  player.on('stateChange', (o, n) => {
    console.info(`player: ${o.status} -> ${n.status}`);
  });
  player.on('error', e => {
    console.error(e);
  });

  // Set up stream
  const stream = await httpGet(streamUrl);

  stream.on('error', e => {
    console.error(`Stream error: ${e}`);
  });

  // Play audio file
  const resource = createAudioResource(stream);
  console.log(`Playing ${streamUrl}...`);
  player.play(resource);
  connection.subscribe(player);
});

// Connect to Discord
client.login(botToken);
