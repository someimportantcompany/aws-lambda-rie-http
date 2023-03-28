import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { events, contexts } from './lambda.mjs';

export function getConfig({ argv }) {
  const args = yargs(hideBin(argv))
    .usage('aws-lambda-rie-http <lambda.handler> [options]')
    .demandCommand(1)
    .pkgConf('awsLambdaRieHttp')
    .option('host', {
      describe: 'HTTP server host to bind to',
      default: '127.0.0.1',
      type: 'string',
    })
    .option('port', {
      describe: 'HTTP server port',
      default: 3000,
      type: 'number',
    })
    .option('event-format', {
      alias: 'eventFormat',
      choices: Object.keys(events),
      default: 'LAMBDA_FUNCTION_EVENT',
      type: 'string',
    })
    .option('context-format', {
      alias: 'contextFormat',
      choices: Object.keys(contexts),
      default: 'LAMBDA_CONTEXT',
      type: 'string',
    })
    .parse();

  return {
    handlerName: args._[0],
    httpHost: args.host,
    httpPort: args.port,
    eventFormat: args.eventFormat,
    contextFormat: args.contextFormat,
  };
}
