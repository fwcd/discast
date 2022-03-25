import { AudioPlayer, createAudioPlayer, createAudioResource, NoSubscriberBehavior } from "@discordjs/voice";
import { error, get, info } from './utils';

export async function createStreamingPlayer(url: string): Promise<AudioPlayer> {
  const stream = await get(url);
  const resource = createAudioResource(stream);
  const player = createAudioPlayer({
    behaviors: {
      noSubscriber: NoSubscriberBehavior.Play
    }
  });

  player.on('stateChange', (o, n) => {
    info(`Player status: ${o.status} -> ${n.status}`);
  });
  player.on('error', e => {
    error(`Player error: ${e.message}`);
  });

  info(`Playing ${url}...`);
  player.play(resource);
  return player;
}
