import assert from 'assert';
import axios from 'axios';
import { createServer } from '../lib/server.mjs';

describe('lib/server', () => {
  async function httpRequest({ createEvent, createContext, handlerName = 'app.handler', handlerFn }) {
    const server = createServer({ createEvent, createContext, handlerName, handlerFn });

    try {
      server.start({ httpHost: '127.0.0.1', httpPort: 0 });
      await new Promise(resolve => setTimeout(resolve), 100);

      const { status, headers, data } = await axios.get('/', {
        baseURL: `http://127.0.0.1:${server.getPort()}/`,
        responseType: 'text',
        validateStatus: () => true,
      });

      delete headers.connection;
      delete headers.date;
      delete headers['transfer-encoding'];

      return JSON.parse(JSON.stringify({ status, headers, body: data }));
    } finally {
      await server.stop();
    }
  }

  it('should handle a HTTP request', async () => {
    const res = await httpRequest({
      createEvent: () => ({ a: 1 }),
      createContext: () => ({ b: 2 }),
      handlerFn: (event, context) => ({ ...event, ...context }),
    });
    assert.deepStrictEqual(res, {
      status: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ a: 1, b: 2 }),
    })
  });
});
