export function handler(event, context) {
  console.log(JSON.stringify({ event, context }, null, 2));
  return { hello: 'world' };
}
