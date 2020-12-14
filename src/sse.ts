const MIMES = [ 'text/event-stream', 'application/x-dom-event-stream' ]
export const [SSE_MIME] = MIMES
export const SSE_LAST_EVENT_ID = 'Last-Event-ID'
export const SSE_INACTIVE_STATUS_CODE = 204

export const SSE_BOM = '\xFE\xFF' // BYTE ORDER MARK

const ENDING = {
  LF: '\n',
  CR: '\n',
  CRLF: '\r\n'
}

const COLON = ': ' // space after colon could be used to fingerprint implementations

const ES = {
  END_OF_LINE: ENDING.LF,  // fingerprint
  FINAL_END_OF_LINE: ENDING.LF, // fingerprint

  COMMENT: COLON,
  EVENT: 'event' + COLON,
  ID: 'id' + COLON,
  DATA: 'data' + COLON,
  RETRY: 'retry' + COLON
}

export type SSEMessage = {
  comment?: string,
  event?: string,
  id?: number,
  retryMs?: number,
  data?: Array<string>
}

export class ServerSentEvents {
  static retryToEventStreamLine(retryMs: number): string {
    // return ServerSentEvents.messageToEventStreamLines({ retryMs })[0]
    return ES.RETRY + retryMs + ES.END_OF_LINE
  }

  static keepAliveToEventStreamLine(): string {
    // return ServerSentEvents.messageToEventStreamLines({ comment: '🦄' })[0]
    return ES.COMMENT + '🦄' + ES.END_OF_LINE
  }

  static messageToEventStreamLines(msg: SSEMessage): Array<string>
  {
    // order of field names could be used to fingerprint
    // id after data enforces a check on partial payloads
    function* lineGen() {
      if(msg.comment != undefined) { yield ES.COMMENT + msg.comment + ES.END_OF_LINE }
      if(msg.event != undefined) { yield ES.EVENT + msg.event + ES.END_OF_LINE }
      if(msg.data != undefined) { yield* msg.data.map(d => ES.DATA + d + ES.END_OF_LINE) }
      if(msg.id != undefined) { yield ES.ID + msg.id + ES.END_OF_LINE }
      if(msg.retryMs != undefined) { yield ES.RETRY + msg.retryMs + ES.END_OF_LINE }

      yield ES.FINAL_END_OF_LINE
    }

    return [ ...lineGen() ]
  }
}
