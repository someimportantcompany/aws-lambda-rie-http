import isPlainObject from 'lodash.isplainobject';

/**
 * @param {import('http').ClientRequest} req
 * @param {String} key
 * @return {String|undefined}
 */
export function getReqHeader(req, key) {
  return req?.headers ? (req.headers[`${key}`] ?? req.headers[`${key}`.toLowerCase()] ?? undefined) : undefined;
}

/**
 * @param {import('http').ClientRequest} req
 * @return {String|undefined}
 */
export async function getReqBody(req) {
  try {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    return Buffer.concat(buffers).toString();
  } catch (err) {
    return undefined;
  }
}

/**
 * @param {import('http').ServerResponse} res
 * @param {Error | import('aws-lambda').APIGatewayProxyResultV2 | string} result
 */
export function setResResult(res, result) {
  if (result instanceof Error) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.write(result.toString());
  } else if (result && typeof result.statusCode === 'number') {
    res.statusCode = result.statusCode;

    res.writeHead(result.statusCode, isPlainObject(result.headers) ? result.headers : {});

    if (isPlainObject(result.multiValueHeaders)) {
      for (const [key, values] of Object.entries(result.multiValueHeaders)) {
        (Array.isArray(values) ? values : []).forEach(value => res.setHeader(key, value));
      }
    }

    if (typeof result.body === 'string') {
      res.write(result.isBase64Encoded ? Buffer.from(result.body, 'base64').toString('utf8') : result.body);
    }
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(typeof result === 'string' ? result : JSON.stringify(result));
  }
}
