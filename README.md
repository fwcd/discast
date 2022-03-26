# Discast

[![Build](https://github.com/fwcd/discast/actions/workflows/build.yml/badge.svg)](https://github.com/fwcd/discast/actions/workflows/build.yml)

A Discord bot that forwards audio streams to a voice channel.

## Usage

First run `npm install` to install the dependencies and then `npm run build` to compile (or `npm run watch` to compile continuously on file changes). To run, make sure to set the following environment variables:

```sh
export BOT_TOKEN=[your token]
export VOICE_CHANNEL_ID=[id of the voice channel]
export STREAM_URL=[url pointing to your stream]
```

Then run `npm start`.
