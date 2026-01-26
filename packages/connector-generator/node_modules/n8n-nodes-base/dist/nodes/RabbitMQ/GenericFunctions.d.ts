import * as amqplib from 'amqplib';
import type { IExecuteFunctions, INodeExecutionData, ITriggerFunctions } from 'n8n-workflow';
import type { Options, RabbitMQCredentials, TriggerOptions } from './types';
export declare function rabbitmqConnect(credentials: RabbitMQCredentials): Promise<amqplib.Connection>;
export declare function rabbitmqCreateChannel(this: IExecuteFunctions | ITriggerFunctions): Promise<amqplib.Channel>;
export declare function rabbitmqConnectQueue(this: IExecuteFunctions | ITriggerFunctions, queue: string, options: Options | TriggerOptions): Promise<amqplib.Channel>;
export declare function rabbitmqConnectExchange(this: IExecuteFunctions | ITriggerFunctions, exchange: string, options: Options | TriggerOptions): Promise<amqplib.Channel>;
export declare class MessageTracker {
    messages: number[];
    isClosing: boolean;
    received(message: amqplib.Message): void;
    answered(message: amqplib.Message): void;
    unansweredMessages(): number;
    closeChannel(channel: amqplib.Channel, consumerTag?: string): Promise<void>;
}
export declare const parsePublishArguments: (options: Options) => amqplib.Options.Publish;
export declare const parseMessage: (message: amqplib.Message, options: TriggerOptions, helpers: ITriggerFunctions["helpers"]) => Promise<INodeExecutionData>;
export declare function handleMessage(this: ITriggerFunctions, message: amqplib.Message, channel: amqplib.Channel, messageTracker: MessageTracker, acknowledgeMode: string, options: TriggerOptions): Promise<void>;
//# sourceMappingURL=GenericFunctions.d.ts.map