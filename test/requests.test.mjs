import assert from 'assert';
import axios from 'axios';
import { randomBytes } from 'crypto';
import { createServer } from 'http';
import { getReqHeader, getReqBody, setResResult } from '../lib/requests.mjs';

describe('lib/requests', () => {
  function httpRequest(config, assertion) {
    return new Promise((resolve, reject) => {
      try {
        const server = createServer(async (req, res) => {
          try {
            res.statusCode = 500;
            await assertion(req, res);
            res.end();
          } catch (err) {
            reject(err);
          }
        });

        server.listen(0, '127.0.0.1', () => {
          const { port } = server.address();
          assert.ok(port > 1024, 'Expected port to be a random non-privileged port');

          (async () => {
            try {
              const { status, headers, data } = await axios.request({
                baseURL: `http://127.0.0.1:${port}/`,
                responseType: 'text',
                validateStatus: () => true,
                ...config,
              });

              delete headers.connection;
              delete headers.date;
              delete headers['transfer-encoding'];

              resolve(JSON.parse(JSON.stringify({ status, headers, body: data })));
            } catch (err) {
              reject(err)
            } finally {
              server.close();
            }
          })();
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  describe('#getReqHeader', () => {
    it('should get request headers', async () => {
      await httpRequest({
        headers: {
          'Accept': 'application/json',
          'X-Powered-By': 'Node.js HTTP server',
        },
      }, req => {
        assert.strictEqual(getReqHeader(req, 'Accept'), 'application/json');
        assert.strictEqual(getReqHeader(req, 'accept'), 'application/json');
        assert.strictEqual(getReqHeader(req, 'Content-Type'), undefined);
        assert.strictEqual(getReqHeader(req, 'content-type'), undefined);
        assert.strictEqual(getReqHeader(req, 'X-Powered-By'), 'Node.js HTTP server');
        assert.strictEqual(getReqHeader(req, 'x-powered-by'), 'Node.js HTTP server');
        assert.strictEqual(getReqHeader(req, 'authorization'), undefined);
      });
    });
  });

  describe('#getReqBody', () => {
    const types = {
      text: () => randomBytes(16).toString('hex'),
      json: () => JSON.stringify({ hello: 'world' }),
      xml: () => (a => a.join(''))([
        '<?xml version="1.0" encoding="utf-8">',
        '<xml:Document>',
          'Hello, world!',
        '</xml:Document>',
      ]),
    };

    Object.entries(types).forEach(([key, getBody]) => {
      it(`should get the ${key} request body`, async () => {
        const data = getBody();
        await httpRequest({ method: 'POST', data }, async req => {
          assert.strictEqual(await getReqBody(req), data);
        });
      });
    });

    const methods = ['POST', 'PUT', 'PATCH'];
    methods.forEach(method => {
      it(`should get the request body from a ${method} request`, async () => {
        const data = randomBytes(16).toString('hex');
        await httpRequest({ method, data }, async req => {
          assert.strictEqual(await getReqBody(req), data);
        });
      });
    });

    it('should fail to get the request body multiple times', async () => {
      const data = JSON.stringify({ hello: 'world' });
      await httpRequest({ method: 'POST', data }, async req => {
        assert.strictEqual(await getReqBody(req), data);
        assert.strictEqual(await getReqBody(req), '');
      });
    });
  });

  describe('#setResResult', () => {
    it('should set a valid response when simply returning JSON', async () => {
      const res = await httpRequest({}, async (_r1, r2) => setResResult(r2, { hello: 'world' }));
      assert.deepStrictEqual(res, {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          hello: 'world',
        }),
      });
    });

    it('should set a full response', async () => {
      const res = await httpRequest({}, async (_r1, r2) => setResResult(r2, {
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
          'x-powered-by': 'magic',
        },
        body: JSON.stringify({
          hello: 'world',
        }),
      }));
      assert.deepStrictEqual(res, {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'x-powered-by': 'magic',
        },
        body: JSON.stringify({
          hello: 'world',
        }),
      });
    });

    it('should set an error response', async () => {
      const res = await httpRequest({}, async (_r1, r2) => setResResult(r2, {
        statusCode: 400,
        headers: {
          'content-type': 'application/json',
          'x-powered-by': 'magic',
        },
        body: JSON.stringify({
          error: 'failed',
        }),
      }));
      assert.deepStrictEqual(res, {
        status: 400,
        headers: {
          'content-type': 'application/json',
          'x-powered-by': 'magic',
        },
        body: JSON.stringify({
          error: 'failed',
        }),
      });
    });
  });
});
