import * as http from 'http';
import * as https from 'https';

/** Fetches an environment variable. */
export function env(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Please make sure that ${name} is set!`);
  }
  return value;
}

/** Sends an HTTP `GET` the given URL. */
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

/** Logs an error message. */
export function error(msg: string): void {
  console.error(prependTime(msg));
}

/** Logs an info message. */
export function info(msg: string): void {
  console.log(prependTime(msg));
}
