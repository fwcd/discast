import { AudioPlayer, AudioPlayerStatus, AudioResource, createAudioPlayer, createAudioResource, NoSubscriberBehavior } from "@discordjs/voice";
import { error, get, info } from './utils';

export interface StreamingPlayerOptions {
  autoReconnectToStream: boolean,
}

async function createStreamingResource(url: string): Promise<AudioResource> {
  const stream = await get(url);
  return createAudioResource(stream);
}

/** Creates an `AudioPlayer` streaming from the given URL. */
export async function createStreamingPlayer(
  url: string,
  options: StreamingPlayerOptions = { autoReconnectToStream: true }
): Promise<AudioPlayer> {
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play
    }
  });
  const playStream = async () => player.play(await createStreamingResource(url));

  player.on('stateChange', (o, n) => {
    info(`Player status: ${o.status} -> ${n.status}`);

    if (options.autoReconnectToStream && o.status !== n.status && n.status === AudioPlayerStatus.Idle) {
      info('Re-attempting to play...');
      playStream();
    }
  });

  player.on('error', e => {
    error(`Player error: ${e.message}`);
  });

  info(`Playing ${url}...`);
  playStream();

  return player;
}
