export const MIMES = ['text/event-stream', 'application/x-dom-event-stream']
export const MINE_CHARSET = 'UTF-8'
export const [SSE_MIME] = MIMES
export const SSE_LAST_EVENT_ID = 'Last-Event-ID'
export const SSE_ACTIVE_STATUS_CODE = 200
export const SSE_INACTIVE_STATUS_CODE = 204

export const SSE_UTF8_BOM = '\xEF\xBB\xBF' // codepoint U+FEFF BYTE ORDER MARK
export const SSE_BOM = SSE_UTF8_BOM

export const ENDING = {
	LF: '\n',
	CR: '\r',
	CRLF: '\r\n'
}

export const COLON = ': ' // space(s) after colon fingerprint

export const ES = {
	END_OF_LINE: ENDING.LF, //  fingerprint
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

	static messageToEventStreamLines(msg: SSEMessage): Array<string> {
		return [...ServerSentEvents.lineGen(msg)]
	}

	static *lineGen(msg: SSEMessage) {
		// order of field names could be used to fingerprint
		// order of id (first/last) could influence client communication issues
		const { comment, event, data, id, retryMs } = msg

		if (comment !== undefined) { yield ES.COMMENT + comment + ES.END_OF_LINE }
		if (event !== undefined) { yield ES.EVENT + event + ES.END_OF_LINE }
		if (data !== undefined) { yield* data.map(d => ES.DATA + d + ES.END_OF_LINE) }
		if (id !== undefined) { yield ES.ID + id + ES.END_OF_LINE }
		if (retryMs !== undefined) { yield ES.RETRY + retryMs + ES.END_OF_LINE }

		yield ES.FINAL_END_OF_LINE
	}
}

export const SSE = ServerSentEvents
