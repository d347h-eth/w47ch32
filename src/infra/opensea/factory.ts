import { WebSocket } from 'ws';
import { OpenSeaStreamClient } from '@opensea/stream-js';
import logger from '../../utils/logger';

export class Factory {
    constructor(private accessToken: string) {}

    public newStreamClient(): OpenSeaStreamClient {
        return new OpenSeaStreamClient({
            token: this.accessToken,
            connectOptions: {
                transport: WebSocket
            },
            onError: (error) => {
                let clientErr = new ErrorResponse(error);
                if (clientErr.getCode() < 500) {
                  logger.error(clientErr.getReport());
                }
            },
        });
    }
}

class ErrorResponse {
    private message: string;
    private code: number;

    constructor(error: any) {
      let split = error.message.split(': ');
      this.message = split[0];
      this.code = parseInt(split[1]);
    }

    public getMessage() {
      return this.message;
    }

    public getCode() {
      return this.code;
    }

    public getReport() {
      return this.message + ': ' + this.code;
    }
}
