import createDebug from 'debug';
import { createServer as createHttpServer } from 'http';

import { runHandler } from './handlers.mjs';
import { setResResult } from './requests.mjs';

const debug = createDebug('aws-lambda-rie-http');

export function createServer({ createEvent, createContext, name, handler }) {
  const server = createHttpServer(async (req, res) => {
    try {
      const event = await createEvent(req);
      const context = createContext(req);
      const result = await runHandler(handler, event, context);
      setResResult(res, result);
    } catch (err) {
      console.error(err);
      setResResult(res, err);
    } finally {
      res.end();
    }
  });

  return {
    /**
     * @returns {Promise<void>}
     */
    start({ httpHost, httpPort }) {
      return new Promise((resolve, reject) => {
        server.on('close', () => resolve());

        server.on('error', err => {
          if (err.syscall === 'listen' && err.code === 'EACCES') {
            console.error(`Port ${httpPort} requires elevated privileges`);
            process.exit(1);
          } else if (err.syscall === 'listen' && err.code === 'EADDRINUSE') {
            console.error(`Port ${httpPort} is already in use`);
            process.exit(1);
          } else {
            reject(err);
          }
        });

        server.on('listening', () => {
          console.log('%s now listening on %s:%d', name, httpHost, httpPort);
        });

        debug('Starting server', { httpHost, httpPort });
        server.listen(httpPort, httpHost);
      })
    },
    /**
     * @returns {Promise<void>}
     */
    stop() {
      return new Promise(resolve => {
        debug('Stopping server');

        server.close((err) => {
          if (err) {
            console.error(err);
          }

          resolve();
        });
      });
    },
  };
}
