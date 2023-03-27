import { randomBytes } from 'crypto';
import { format as formatDate } from 'date-fns';
import { parse as parseQueryString } from 'querystring';
import { v4 as uuid } from 'uuid';

import { getReqHeader, getReqBody } from './requests.mjs';

export const events = {

  /**
   * @param {import('http').ClientRequest} req
   * @return {Promise<import('aws-lambda').APIGatewayProxyEventV2>}
   */
  async 'LAMBDA_FUNCTION_EVENT'(req) {
    const now = new Date();
    const [rawPath, rawQueryString] = req.url.split('?');

    const apiId = process.env.AWS_API_GATEWAY_ID ?? 'a1b2c3d4e5';
    const region = process.env.AWS_REGION ?? 'local';

    return {
      version: '2.0',
      routeKey: process.env.AWS_API_GATEWAY_ROUTE_KEY ?? '$default',
      rawPath,
      rawQueryString,
      ...(getReqHeader(req, 'Cookie') ? getReqHeader(req, 'Cookie').split(';').map(s => s.trim()) : null),
      headers: { ...req.headers },
      ...(rawQueryString ? { queryStringParameters: parseQueryString(rawQueryString) } : null),
      requestContext: {
        accountId: process.env.AWS_ACCOUNT_ID ?? '000000000000',
        apiId,
        domainName: `${apiId}.execute-api.${region}.amazonaws.com`,
        domainPrefix: apiId,
        http: {
          method: req.method,
          path: rawPath,
          protocol: 'HTTP/1.1',
          sourceIp: req.ip,
          userAgent: getReqHeader(req, 'User-Agent'),
        },
        requestId: uuid(),
        routeKey: process.env.AWS_API_GATEWAY_ROUTE_KEY ?? '$default',
        stage: process.env.AWS_API_GATEWAY_STAGE_NAME ?? '$default',
        time: formatDate(now, 'dd/MMM/yyyy:HH:mm:ss xxxx'),
        timeEpoch: now.getTime(),
      },
      body: ((req.method === 'GET' || req.method === 'HEAD') ? undefined : await getReqBody(req)) ?? '',
      isBase64Encoded: false,
      // stageVariables: {
      //   stageVariable1: 'value1',
      //   stageVariable2: 'value2',
      // },
    };
  },

  /**
   * @param {import('http').ClientRequest} req
   * @return {Promise<import('aws-lambda').APIGatewayProxyEvent>}
   */
  async 'API_GATEWAY_PROXY_EVENT_1.0'(req) {
    const now = new Date();
    const [rawPath, rawQueryString] = req.url.split('?');

    const apiId = process.env.AWS_API_GATEWAY_ID ?? 'a1b2c3d4e5';
    const region = process.env.AWS_REGION ?? 'local';

    return {
      version: '1.0',
      resource: "/{any+}",
      path: rawPath,
      httpMethod: req.method,
      headers: { ...req.headers },
      ...(rawQueryString ? { queryStringParameters: parseQueryString(rawQueryString) } : null),
      requestContext: {
        resourceId: randomBytes(3).toString('hex'),
        resourcePath: "/{any+}",
        httpMethod: req.method,
        path: rawPath,
        accountId: process.env.AWS_ACCOUNT_ID ?? '000000000000',
        protocol: 'HTTP/1.1',
        stage: 'dev',
        apiId: apiId,
        domainName: `${apiId}.execute-api.${region}.amazonaws.com`,
        domainPrefix: apiId,
        requestTime: formatDate(now, 'dd/MMM/yyyy:HH:mm:ss xxxx'),
        requestTimeEpoch: now.getTime(),
        requestId: uuid(),
        extendedRequestId: randomBytes(5).toString('base64'),
        identity: {
          accessKey: null,
          accountId: null,
          caller: null,
          cognitoAuthenticationProvider: null,
          cognitoAuthenticationType: null,
          cognitoIdentityId: null,
          cognitoIdentityPoolId: null,
          principalOrgId: null,
          sourceIp: req.ip,
          user: null,
          userAgent: getReqHeader(req, 'User-Agent'),
          userArn: null,
        },
      },
      stageVariables: null,
      body: ((req.method === 'GET' || req.method === 'HEAD') ? undefined : await getReqBody(req)) ?? '',
      isBase64Encoded: false,
    }
  },

  /**
   * @param {import('http').ClientRequest} req
   * @return {Promise<import('aws-lambda').APIGatewayProxyEventV2>}
   */
  async 'API_GATEWAY_PROXY_EVENT_2.0'(req) {
    const now = new Date();
    const [rawPath, rawQueryString] = req.url.split('?');

    const apiId = process.env.AWS_API_GATEWAY_ID ?? 'cfd0b3482569585c71fb7cd76fcaf1e9';
    const region = process.env.AWS_REGION ?? 'local';

    return {
      version: '2.0',
      routeKey: process.env.AWS_API_GATEWAY_ROUTE_KEY ?? '$default',
      rawPath,
      rawQueryString,
      ...(getReqHeader(req, 'Cookie') ? getReqHeader(req, 'Cookie').split(';').map(s => s.trim()) : null),
      headers: { ...req.headers },
      ...(rawQueryString ? { queryStringParameters: parseQueryString(rawQueryString) } : null),
      requestContext: {
        accountId: process.env.AWS_ACCOUNT_ID ?? '000000000000',
        apiId,
        domainName: `${apiId}.lambda-url.${region}.on.aws`,
        domainPrefix: apiId,
        http: {
          method: req.method,
          path: rawPath,
          protocol: 'HTTP/1.1',
          sourceIp: req.ip,
          userAgent: getReqHeader(req, 'User-Agent'),
        },
        requestId: uuid(),
        routeKey: process.env.AWS_API_GATEWAY_ROUTE_KEY ?? '$default',
        stage: process.env.AWS_API_GATEWAY_STAGE_NAME ?? '$default',
        time: formatDate(now, 'dd/MMM/yyyy:HH:mm:ss xxxx'),
        timeEpoch: now.getTime(),
      },
      body: ((req.method === 'GET' || req.method === 'HEAD') ? undefined : await getReqBody(req)) ?? '',
      isBase64Encoded: false,
      // stageVariables: {
      //   stageVariable1: 'value1',
      //   stageVariable2: 'value2',
      // },
    };
  },

};

export const contexts = {

  /**
   * @param {import('http').ClientRequest} req
   * @return {import('aws-lambda').Context}
   */
  'LAMBDA_CONTEXT'() {
    const now = new Date();
    const accountId = process.env.AWS_ACCOUNT_ID ?? '000000000000';
    const region = process.env.AWS_REGION ?? 'local';

    const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME ?? 'dev-function';
    const functionVersion = process.env.AWS_LAMBDA_FUNCTION_VERSION ?? '$LATEST';

    return {
      functionName,
      functionVersion,
      awsRequestId: uuid(),
      logGroupName: `/aws/lambda/${functionName}`,
      logStreamName: `${formatDate(now, 'yyyy/MM/dd')}/[${functionVersion}]c2bcdbad914b4f2fbabf3417196d48d2`,
      invokedFunctionArn: `arn:aws:lambda:${region}:${accountId}:function:${functionName}`,
      callbackWaitsForEmptyEventLoop: true,
      memoryLimitInMB: '1024',
      startedAt: now.getTime(),
      getRemainingTimeInMillis: () => 0,
      done: () => void 0,
      fail: () => void 0,
      succeed: () => void 0,
    };
  },

};
