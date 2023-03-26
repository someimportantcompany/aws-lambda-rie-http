import type { APIGatewayProxyEventV2, Context } from 'aws-lambda';

export function handler(event: APIGatewayProxyEventV2, context: Context) {
  console.log(JSON.stringify({ event, context }, null, 2));
  return { hello: 'world' };
}
