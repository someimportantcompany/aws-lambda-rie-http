#!/usr/bin/env node
import createDebug from 'debug';

import { getConfig } from '../lib/config.mjs';
import { events, contexts } from '../lib/lambda.mjs';
import { getHandler } from '../lib/handlers.mjs';
import { createServer } from '../lib/server.mjs';

const debug = createDebug('aws-lambda-rie-http');

void (async function main() {
  const config = getConfig({ argv: process.argv });
  const { handlerFile, httpHost, httpPort, eventFormat, contextFormat } = config;
  debug('config', config);

  try {
    const { [eventFormat]: createEvent } = events;
    const { [contextFormat]: createContext } = contexts;
    const handler = await getHandler(handlerFile);

    const server = createServer({ createEvent, createContext, name: handlerFile, handler });

    process.once('SIGUSR2', async () => {
      await server.stop().catch(err2 => console.error(err2));
      process.kill(process.pid);
    });
    process.once('uncaughtException', async (err1) => {
      console.error(err1);
      await server.stop().catch(err2 => console.error(err2));
      process.kill(process.pid);
    });

    await server.start({ httpHost, httpPort });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
