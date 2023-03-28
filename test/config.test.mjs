import assert from 'assert';
import { getConfig } from '../lib/config.mjs';

describe('lib/config', () => {
  it('should return default config', () => {
    const config = getConfig({
      argv: [ '/bin/node', 'aws-lambda-rie-http', 'app.handler' ],
    });
    assert.deepStrictEqual(config, {
      handlerName: 'app.handler',
      httpHost: '127.0.0.1',
      httpPort: 3000,
      eventFormat: 'LAMBDA_FUNCTION_EVENT',
      contextFormat: 'LAMBDA_CONTEXT',
    });
  });

  it('should return modified config', () => {
    const config = getConfig({
      argv: [
        '/bin/node', 'aws-lambda-rie-http', 'app.handler',
        '--host', '0.0.0.0',
        '--port', '4000',
        '--event', 'API_GATEWAY_PROXY_EVENT_1.0',
        '--context', 'LAMBDA_CONTEXT',
      ],
    });
    assert.deepStrictEqual(config, {
      handlerName: 'app.handler',
      httpHost: '0.0.0.0',
      httpPort: 4000,
      eventFormat: 'LAMBDA_FUNCTION_EVENT',
      contextFormat: 'LAMBDA_CONTEXT',
    });
  });
});
