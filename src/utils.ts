import * as http from 'http';
import * as https from 'https';

export function get(url: string): Promise<http.IncomingMessage> {
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

function prependTime(msg: string): string {
  return `${new Date().toLocaleTimeString()} - ${msg}`;
}

export function error(msg: string): void {
  console.error(prependTime(msg));
}

export function info(msg: string): void {
  console.log(prependTime(msg));
}
