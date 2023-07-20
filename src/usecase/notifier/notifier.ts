import { Notification } from './notification';
import { sleep } from '../../utils/utils';
import logger from '../../utils/logger';

interface QueueService {
    consumeBatch(): Promise<Notification[]>;
}

interface PushService {
    send(message: string): Promise<any>;
}

export class Notifier {
    constructor(
        private queueService: QueueService,
        private pushService: PushService
    ) {}

    public async work(): Promise<void> {
        // the main loop tick rate
        const tickRate = 500; // 500 ms
        // limit how often notifications can be sent out
        const pushTimer = 5000; // 5 seconds

        // main loop:
        // 1. check messages queue and stage messages for pushing
        // 2. push staged messages when throttling timer has elapsed (pushTimer)
        var timeStart = new Date(0); // set to early ts, so the timer would fire right away on the first loop
        var timeEnd = new Date();
        var stagedBatch: Notification[] = [];
        while (true) {
            // skip if some messages have already been staged
            if (stagedBatch.length == 0) {
                stagedBatch = await this.queueService.consumeBatch();
            }

            // check new staged messages
            if (stagedBatch.length > 0) {
                timeEnd = new Date();
                let timeElapsed = timeEnd.getTime() - timeStart.getTime();
                // send staged messages if pushTimer elapsed (otherwise wait)
                if (timeElapsed >= pushTimer) {
                    await this.pushService.send(stagedBatch.map(notification => notification.render()).join('\n'));
                    stagedBatch = [];
                    timeStart = new Date();
                    process.exit();
                }
            }

            await sleep(tickRate);
        }
    }
}
