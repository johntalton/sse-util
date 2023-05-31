import { expect } from 'chai'
import { describe, it } from 'mocha'

import { ServerSentEvents } from '@johntalton/sse-util'

describe('SSE', () => {
  describe('retryToEventStreamLine', () => {
    it('should throw on undefined', () => {
      expect(() => ServerSentEvents.retryToEventStreamLine()).to.throw
    })

    it('should handle Zero', () => {
      const line = ServerSentEvents.retryToEventStreamLine(0)
      expect(line).to.be.equal('retry: 0\n')
    })

    it('should generate 1sec retry', () => {
      const line = ServerSentEvents.retryToEventStreamLine(1000)
      expect(line).to.be.equal('retry: 1000\n')
    })

    it('should return the same as messageToEvenStreamLines', () => {
      const line = ServerSentEvents.retryToEventStreamLine(1024)
      const lines = ServerSentEvents.messageToEventStreamLines({ retryMs: 1024 })
      expect(line).to.equal(lines[0])
    })
  })

  describe('keepAliveToEventStreamLine', () => {
    it('should create non-empty line', () => {
      const line = ServerSentEvents.keepAliveToEventStreamLine()
      expect(line).to.not.be.empty
      expect(line.length).to.not.equal(0)
      expect(line.charAt(0)).to.equal(':')
    })

    it('should return the same as messageToEvenStreamLines', () => {
      const line = ServerSentEvents.keepAliveToEventStreamLine()
      const lines = ServerSentEvents.messageToEventStreamLines({ comment: '🦄' })
      expect(line).to.equal(lines[0])
    })
  })

  describe('messageToEventStreamLines', () => {
    it('should throw on undefined', () => {
      expect(() => ServerSentEvents.messageToEventStreamLines()).to.throw
    })

    it('should handle empty message', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({})
      expect(lines.length).to.equal(1)
      expect(lines[0]).to.equal('\n')
    })

    it('should handle comment message', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({ comment: 'hi' })
      expect(lines.length).to.equal(2)
      expect(lines[0]).to.equal(': hi\n')
      expect(lines[1]).to.equal('\n')
    })

    it('should handle event message', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({ event: 'boom' })
      expect(lines.length).to.equal(2)
      expect(lines[0]).to.equal('event: boom\n')
      expect(lines[1]).to.equal('\n')
    })

    it('should handle id message', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({ id: 42 })
      expect(lines.length).to.equal(2)
      expect(lines[0]).to.equal('id: 42\n')
      expect(lines[1]).to.equal('\n')
    })

    it('should handle id / event message', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({ event: 'boom', id: 42 })
      expect(lines.length).to.equal(3)
      expect(lines[0]).to.equal('event: boom\n')
      expect(lines[1]).to.equal('id: 42\n')
      expect(lines[2]).to.equal('\n')
    })

    it('should handle event / comment message', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({ event: 'boom', comment: 'now is the time' })
      expect(lines.length).to.equal(3)
      expect(lines[0]).to.equal(': now is the time\n')
      expect(lines[1]).to.equal('event: boom\n')
      expect(lines[2]).to.equal('\n')
    })

    it('should handle empty data array', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({
        data: []
      })
      expect(lines.length).to.equal(1)
      expect(lines[0]).to.equal('\n')
    })

    it('should handle data with empty string', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({
        data: ['']
      })
      expect(lines.length).to.equal(2)
      expect(lines[0]).to.equal('data: \n')
      expect(lines[1]).to.equal('\n')
    })

    it('should handle data with string', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({
        data: ['now is the time']
      })
      expect(lines.length).to.equal(2)
      expect(lines[0]).to.equal('data: now is the time\n')
      expect(lines[1]).to.equal('\n')
    })

    it('should handle data with multiple strings', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({
        data: ['now is the time', 'for all good men']
      })
      expect(lines.length).to.equal(3)
      expect(lines[0]).to.equal('data: now is the time\n')
      expect(lines[1]).to.equal('data: for all good men\n')
      expect(lines[2]).to.equal('\n')
    })

    it('should handle data and even and id', () => {
      const lines = ServerSentEvents.messageToEventStreamLines({
        id: 42,
        event: 'boom',
        data: ['{ "Key": "Value" }']
      })
      expect(lines.length).to.equal(4)
      expect(lines[0]).to.equal('event: boom\n')
      expect(lines[1]).to.equal('data: { "Key": "Value" }\n')
      expect(lines[2]).to.equal('id: 42\n')
      expect(lines[3]).to.equal('\n')
    })
  })
})