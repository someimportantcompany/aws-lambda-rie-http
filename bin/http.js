#!/usr/bin/env node
const debug = require('debug')('aws-lambda-rie-http');

void (async function main() {
  const { getConfig } = await import('../lib/config.mjs');
  const { events, contexts } = await import('../lib/lambda.mjs');
  const { getHandler } = await import('../lib/handlers.mjs');
  const { createServer } = await import('../lib/server.mjs');
  const { assert } = await import('../lib/utils.mjs');

  const config = getConfig({ argv: process.argv });
  debug('config', config);

  try {
    const { handlerName, httpHost, httpPort, eventFormat, contextFormat } = config;
    assert(typeof events[eventFormat] === 'function', `Expected ${eventFormat} to be valid event type`);
    assert(typeof contexts[contextFormat] === 'function', `Expected ${contextFormat} to be valid context type`);

    const { [eventFormat]: createEvent } = events;
    const { [contextFormat]: createContext } = contexts;
    const handlerFn = await getHandler(handlerName);

    const server = createServer({ createEvent, createContext, handlerName, handlerFn });

    ['SIGTERM', 'SIGUSR2'].forEach(event => process.once(event, async () => {
      await server.stop().catch(e => console.error(e));
      process.kill(process.pid);
    }));
    ['uncaughtException', 'unhandledRejection'].forEach(event => process.once(event, async (err) => {
      console.error(err);
      await server.stop().catch(e => console.error(e));
      process.kill(process.pid);
    }));

    await server.start({ httpHost, httpPort });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
