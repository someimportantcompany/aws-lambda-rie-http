export { default as isPlainObject } from 'lodash.isplainobject';

export function createDefaultAwsAccountId() {
  return Math.ceil(Math.random() * Math.pow(10, 20)).toString().substring(0, 12);
}
