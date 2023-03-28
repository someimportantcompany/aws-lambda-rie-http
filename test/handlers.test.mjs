import assert from 'assert';
import { getHandler, runHandler } from '../lib/handlers.mjs';

describe('lib/handlers', () => {
  describe('#getHandler', () => {
    it('should return a valid handler (.js)', async () => {
      const handler = await getHandler('test/handlers/plain-mixed.handler');
      assert.ok(typeof handler === 'function', 'Expected handler to be a function');
    });

    it('should return a valid handler (.cjs)', async () => {
      const handler = await getHandler('test/handlers/plain-commonjs.handler');
      assert.ok(typeof handler === 'function', 'Expected handler to be a function');
    });

    it('should return a valid handler (.mjs)', async () => {
      const handler = await getHandler('test/handlers/plain-modulejs.handler');
      assert.ok(typeof handler === 'function', 'Expected handler to be a function');
    });
  });

  describe('#runHandler', () => {
    it('should run a synchronous handler', async () => {
      const handler = (event, context) => ({ ...event, ...context });
      const result = await runHandler(handler, { a: 1 }, { b: 2 });
      assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    it('should run an asynchronous handler', async () => {
      const handler = async (event, context) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return { ...event, ...context };
      };

      const result = await runHandler(handler, { a: 1 }, { b: 2 });
      assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    it('should run a callback handler', async () => {
      const handler = (event, context, callback) => {
        setTimeout(() => callback(null, { ...event, ...context }), 10);
      };

      const result = await runHandler(handler, { a: 1 }, { b: 2 });
      assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    it('should run an asynchronous callback handler', async () => {
      const handler = async (event, context, callback) => {
        await new Promise(resolve => setTimeout(resolve, 10));
        callback(null, { ...event, ...context });
      };

      const result = await runHandler(handler, { a: 1 }, { b: 2 });
      assert.deepStrictEqual(result, { a: 1, b: 2 });
    });
  });
});
