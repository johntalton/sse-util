# Server Sent Events util

A simple set of transformation functions to abstract away the sse protocol.

[![npm Version](https://img.shields.io/npm/v/@johntalton/sse-util.svg)](https://www.npmjs.com/package/@johntalton/sse-util)
![GitHub package.json version](https://img.shields.io/github/package-json/v/johntalton/sse-util)
![GitHub](https://img.shields.io/github/license/johntalton/sse-util)
[![Downloads Per Month](https://img.shields.io/npm/dm/@johntalton/sse-util.svg)](https://www.npmjs.com/package/@johntalton/sse-util)
![GitHub last commit](https://img.shields.io/github/last-commit/johntalton/sse-util)

## API

Class `ServerSentEvents`
- `messageToEventStreamLines`
- `retryToEventStreamLine`
- `keepAliveToEventStreamLine`

#### `messageToEventStreamLines`
Core method that converts a `SSEMessage` into a set of Server Sent Event Lines.

```javascript
const lines = ServerSentEvents.messageToEventStreamLines({ id: 42, event: '🎁', data: ['i got you this'] })
// result lines array:
// [ "event: 🎁\n", "data: i got you this\n", "id: 42\n", "\n" ]
```


#### `retryToEventStreamLine`
Alias to `messageToEventStreamLines` that only returns the `retryMs` value and extracts the first line as a single `string`.

```javascript
// create a line to request the retry interval be set to 5 sec
const line = ServerSentEvents.retryToEventStreamLine(5 * 1000)
// result "retry: 5000\n"
```


#### `keepAliveToEventStreamLine`
Alias to `messageToEventStreamLines` that sets the comment and returns `string` line instread of and `Array` of lines.


## Docs
- [W3](https://www.w3.org/TR/eventsource/)
- [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
