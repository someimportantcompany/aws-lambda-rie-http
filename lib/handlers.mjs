import assert from 'assert';
import createDebug from 'debug';
import fs from 'fs';
import path from 'path';

const debug = createDebug('aws-lambda-rie-http');

/**
 * @param {String} handlerFile
 * @return {Function}
 */
export async function getHandler(handlerFile) {
  const [fileName, handlerName, ...rest] = handlerFile.split('.');
  assert(rest.length === 0, 'Expected handler to be specified in the format ${file}.${function}');

  const filePath = [
    path.resolve(process.env.PWD, `${fileName}.ts`),
    path.resolve(process.env.PWD, `${fileName}.mjs`),
    path.resolve(process.env.PWD, `${fileName}.cjs`),
    path.resolve(process.env.PWD, `${fileName}.js`),
  ].find(testPath => {
    try {
      fs.statSync(testPath);
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') {
        return false;
      } else {
        throw err;
      }
    }
  });

  debug(filePath);
  assert(filePath, `File not found: ${fileName}`);

  const handler = await import(filePath);

  if (handler && handler.default && typeof handler.default[handlerName] === 'function') {
    // module.exports.handler = function handler() {}
    return handler.default[handlerName];
  } else if (handler && typeof handler[handlerName] === 'function') {
    // export function handler() {}
    return handler[handlerName];
  } else {
    throw new Error(`Expected ${fileName} to export ${handlerName}`);
  }
}

export function runHandler(handler, event, context) {
  assert(typeof handler === 'function', 'Expected handler to be a function');

  if (handler.length === 3) {
    // handler(event, context, callback)
    // async handler(event, context, callback)
    return new Promise(async (resolve, reject) => {
      try {
        await handler(event, context, (err, result) => err ? reject(err) : resolve(result));
      } catch (err) {
        reject(err);
      }
    });
  } else {
    // handler(event, context)
    // async handler(event, context)
    return handler(event, context);
  }
}
