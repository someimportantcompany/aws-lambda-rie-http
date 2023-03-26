import assert from 'assert';
import fs from 'fs';
import path from 'path';

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

  assert(filePath, `File not found: ${fileName}`);

  const handler = await import(filePath);

  if (handler && handler.default && typeof handler.default[handlerName] === 'function') {
    return handler.default[handlerName];
  } else if (handler && typeof handler[handlerName] === 'function') {
    return handler[handlerName];
  } else {
    throw new Error(`Expected ${fileName} to export ${handlerName}`);
  }
}

export function runHandler(handler, event, context) {
  return new Promise(async (resolve, reject) => {
    try {
      const r1 = await handler(event, context, (err, r2) => {
        if (err) {
          reject(err);
        } else {
          resolve(r2);
        }
      });

      resolve(r1);
    } catch (err) {
      reject(err);
    }
  });
}
