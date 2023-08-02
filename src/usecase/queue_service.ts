import { Notification } from '../domain/notification';
import logger from '../utils/logger';

interface Mutex {
    runExclusive<T>(callback: Function): Promise<T>;
}

export class QueueService {
    // queue max capacity to battle overflowing (will drop/lose messages if traffic is too high)
    private queueMaxCapacity: number = 100;
    // limit batch size at consumption
    private batchSize: number = 50;
    // lock for the shared queue
    private mutex: Mutex;
    // the shared storage
    private queue: Notification[] = [];

    constructor(mutex: Mutex) {
        this.mutex = mutex;
    }

    // enqueue one Notification into the shared storage under mutex
    public async enqueue(notification: Notification): Promise<void> {
        await this.mutex.runExclusive(() => {
            if (this.queue.length < this.queueMaxCapacity) {
                this.queue.push(notification);
            } else {
                logger.debug('queue is full, dropping "' + notification.getId() + '"');
            }
        });
    };

    // consumeBatch locks the shared storage and returns a new batch if it's not empty (not bigger than batchSize)
    public async consumeBatch(): Promise<Notification[]> {
        var result: Notification[] = [];
        if (this.queue.length > 0) {
            await this.mutex.runExclusive(() => {
                let queueLength = this.queue.length;
                if (queueLength <= this.batchSize) {
                    result = this.queue;
                    this.queue = [];
                } else {
                    result = this.queue.slice(0, this.batchSize);
                    this.queue = this.queue.slice(this.batchSize, queueLength);
                }
            });
        }
        return result;
    }
}
