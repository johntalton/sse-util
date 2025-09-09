import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

import { ServerSentEvents } from '@johntalton/sse-util'

describe('SSE', () => {
  describe('retryToEventStreamLine', () => {
    it('should throw on undefined', () => {
      assert.throws(() => ServerSentEvents.retryToEventStreamLine())
    })

    it('should handle Zero', () => {
      const line = ServerSentEvents.retryToEventStreamLine(0)
      assert.equal(line, 'retry: 0\n')
    })

    it('should generate 1sec retry', () => {
      const line = ServerSentEvents.retryToEventStreamLine(1000)
      assert.equal(line, 'retry: 1000\n')
    })

    it('should return the same as messageToEvenStreamLines', () => {
      const line = ServerSentEvents.retryToEventStreamLine(1024)
      const lines = ServerSentEvents.messageToEventStreamLines({ retryMs: 1024 })
      assert.equal(line, lines[0])
    })
  })

  describe('keepAliveToEventStreamLine', () => {
    it('should create non-empty line', () => {
      const line = ServerSentEvents.keepAliveToEventStreamLine()
      assert.ok(line != undefined)
      assert.notEqual(line.length, 0)
      assert.equal(line.charAt(0), ':')
    })

    it('should return the same as messageToEvenStreamLines', () => {
      const line = ServerSentEvents.keepAliveToEventStreamLine()
      const lines = ServerSentEvents.messageToEventStreamLines({ comment: '🦄' })
      assert.equal(line, lines[0])
    })
  })

  describe('messageToEventStreamLines', () => {
    it('should throw on undefined', () => {
      assert.throws(() => ServerSentEvents.messageToEventStreamLines())
    })

    it('should handle empty message', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({})
      assert.equal(lines.length, 1)
      assert.equal(lines[0], '\n')
    })

    it('should handle comment message', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({ comment: 'hi' })
      assert.equal(lines.length, 2)
      assert.equal(lines[0], ': hi\n')
      assert.equal(lines[1], '\n')
    })

    it('should handle event message', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({ event: 'boom' })
      assert.equal(lines.length, 2)
      assert.equal(lines[0], 'event: boom\n')
      assert.equal(lines[1], '\n')
    })

    it('should handle id message', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({ id: 42 })
      assert.equal(lines.length, 2)
      assert.equal(lines[0], 'id: 42\n')
      assert.equal(lines[1], '\n')
    })

    it('should handle id / event message', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({ event: 'boom', id: 42 })
      assert.equal(lines.length, 3)
      assert.equal(lines[0], 'event: boom\n')
      assert.equal(lines[1], 'id: 42\n')
      assert.equal(lines[2], '\n')
    })

    it('should handle event / comment message', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({ event: 'boom', comment: 'now is the time' })
      assert.equal(lines.length, 3)
      assert.equal(lines[0], ': now is the time\n')
      assert.equal(lines[1], 'event: boom\n')
      assert.equal(lines[2], '\n')
    })

    it('should handle empty data array', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({
        data: []
      })
      assert.equal(lines.length, 1)
      assert.equal(lines[0], '\n')
    })

    it('should handle data with empty string', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({
        data: ['']
      })
      assert.equal(lines.length, 2)
      assert.equal(lines[0], 'data: \n')
      assert.equal(lines[1], '\n')
    })

    it('should handle data with string', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({
        data: ['now is the time']
      })
      assert.equal(lines.length, 2)
      assert.equal(lines[0], 'data: now is the time\n')
      assert.equal(lines[1], '\n')
    })

    it('should handle data with multiple strings', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({
        data: ['now is the time', 'for all good men']
      })
      assert.equal(lines.length, 3)
      assert.equal(lines[0], 'data: now is the time\n')
      assert.equal(lines[1], 'data: for all good men\n')
      assert.equal(lines[2], '\n')
    })

    it('should handle data and even and id', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({
        id: 42,
        event: 'boom',
        data: ['{ "Key": "Value" }']
      })
      assert.equal(lines.length, 4)
      assert.equal(lines[0], 'event: boom\n')
      assert.equal(lines[1], 'data: { "Key": "Value" }\n')
      assert.equal(lines[2], 'id: 42\n')
      assert.equal(lines[3], '\n')
    })
  })
})