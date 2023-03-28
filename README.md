# aws-lambda-rie-http

[![Tests](https://github.com/someimportantcompany/aws-lambda-rie-http/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/someimportantcompany/aws-lambda-rie-http/actions/workflows/ci.yml)

A Lambda Runtime Interface Emulator simulating a HTTP server.

```
$ npm install --save-dev aws-lambda-rie-http
$ npx aws-lambda-rie-http app.handler
app.handler listening on 127.0.0.1:3000
```

## Usage

```
# path/to/your.js
#   `module.exports.handler = function handler(event, context) { ... }`
#   `export function handler(event, context) { ... }`
$ npx aws-lambda-rie-http path/to/your.handler
path/to/your.handler listening on 127.0.0.1:3000
```

### Options

```
aws-lambda-rie-http <lambda.handler> [options]

Options:
  --help                             Show help                         [boolean]
  --version                          Show version number               [boolean]
  --host                             HTTP server host to bind to
                                                 [string] [default: "127.0.0.1"]
  --port                             HTTP server port   [number] [default: 3000]
  --event-format, --eventFormat
                                     [string] [choices: "LAMBDA_FUNCTION_EVENT",
                   "API_GATEWAY_PROXY_EVENT_1.0", "API_GATEWAY_PROXY_EVENT_2.0"]
                                              [default: "LAMBDA_FUNCTION_EVENT"]
  --context-format, --contextFormat
                [string] [choices: "LAMBDA_CONTEXT"] [default: "LAMBDA_CONTEXT"]
```

### Typescript

```
# path/to/your.ts
#   `export function handler(event: ..., context: ...): Promise<...> { ... }`
$ npx ts-node ./node_modules/.bin/aws-lambda-rie-http path/to/your.handler
path/to/your.handler listening on 127.0.0.1:3000
```

## Notes

Any questions or suggestions please [open an issue](https://github.com/someimportantcompany/aws-lambda-rie-http/issues).
