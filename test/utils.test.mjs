import assert from 'assert';
import { getApiGatewayReqTime, getContextLogStreamTime, isPlainObject } from '../lib/utils.mjs';

describe('lib/utils', () => {

  const date1 = new Date('1985-11-05T14:39:23.000Z');
  const date2 = new Date('2020-01-01T09:00:00.000Z');
  const date3 = new Date('2023-03-27T11:02:00.000Z');

  describe('#getApiGatewayReqTime', () => {
    it('should format a date', () => {
      assert.strictEqual(getApiGatewayReqTime(date1), '05/Nov/1985:14:39:23 +0000');
      assert.strictEqual(getApiGatewayReqTime(date2), '01/Jan/2020:09:00:00 +0000');
      assert.strictEqual(getApiGatewayReqTime(date3), '27/Mar/2023:12:02:00 +0000');
    });
  });

  describe('#getContextLogStreamTime', () => {
    it('should format a date', () => {
      assert.strictEqual(getContextLogStreamTime(date1), '1985/11/05');
      assert.strictEqual(getContextLogStreamTime(date2), '2020/01/01');
      assert.strictEqual(getContextLogStreamTime(date3), '2023/03/27');
    });
  });

  describe('#isPlainObject', () => {
    it('should test a plain object', () => {
      assert.strictEqual(isPlainObject('Hello world'), false);
    });
  });
});
