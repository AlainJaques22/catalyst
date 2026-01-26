"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMessage = exports.parsePublishArguments = exports.MessageTracker = void 0;
exports.rabbitmqConnect = rabbitmqConnect;
exports.rabbitmqCreateChannel = rabbitmqCreateChannel;
exports.rabbitmqConnectQueue = rabbitmqConnectQueue;
exports.rabbitmqConnectExchange = rabbitmqConnectExchange;
exports.handleMessage = handleMessage;
const amqplib = __importStar(require("amqplib"));
const n8n_workflow_1 = require("n8n-workflow");
const utilities_1 = require("../../utils/utilities");
const credentialKeys = ['hostname', 'port', 'username', 'password', 'vhost'];
async function rabbitmqConnect(credentials) {
    const credentialData = credentialKeys.reduce((acc, key) => {
        acc[key] = credentials[key] === '' ? undefined : credentials[key];
        return acc;
    }, {});
    const optsData = {};
    if (credentials.ssl) {
        credentialData.protocol = 'amqps';
        optsData.ca =
            credentials.ca === '' ? undefined : [Buffer.from((0, utilities_1.formatPrivateKey)(credentials.ca))];
        if (credentials.passwordless) {
            optsData.cert =
                credentials.cert === '' ? undefined : Buffer.from((0, utilities_1.formatPrivateKey)(credentials.cert));
            optsData.key =
                credentials.key === '' ? undefined : Buffer.from((0, utilities_1.formatPrivateKey)(credentials.key));
            optsData.passphrase = credentials.passphrase === '' ? undefined : credentials.passphrase;
            optsData.credentials = amqplib.credentials.external();
        }
    }
    return await amqplib.connect(credentialData, optsData);
}
async function rabbitmqCreateChannel() {
    const credentials = await this.getCredentials('rabbitmq');
    return await new Promise(async (resolve, reject) => {
        try {
            const connection = await rabbitmqConnect(credentials);
            // TODO: why is this error handler being added here?
            connection.on('error', reject);
            const channel = await connection.createChannel();
            resolve(channel);
        }
        catch (error) {
            reject(error);
        }
    });
}
async function rabbitmqConnectQueue(queue, options) {
    const channel = await rabbitmqCreateChannel.call(this);
    return await new Promise(async (resolve, reject) => {
        try {
            if (options.assertQueue) {
                await channel.assertQueue(queue, options);
            }
            else {
                await channel.checkQueue(queue);
            }
            if ('binding' in options && options.binding?.bindings.length) {
                options.binding.bindings.forEach(async (binding) => {
                    await channel.bindQueue(queue, binding.exchange, binding.routingKey);
                });
            }
            resolve(channel);
        }
        catch (error) {
            reject(error);
        }
    });
}
async function rabbitmqConnectExchange(exchange, options) {
    const exchangeType = this.getNodeParameter('exchangeType', 0);
    const channel = await rabbitmqCreateChannel.call(this);
    return await new Promise(async (resolve, reject) => {
        try {
            if (options.assertExchange) {
                await channel.assertExchange(exchange, exchangeType, options);
            }
            else {
                await channel.checkExchange(exchange);
            }
            resolve(channel);
        }
        catch (error) {
            reject(error);
        }
    });
}
class MessageTracker {
    messages = [];
    isClosing = false;
    received(message) {
        this.messages.push(message.fields.deliveryTag);
    }
    answered(message) {
        if (this.messages.length === 0) {
            return;
        }
        const index = this.messages.findIndex((value) => value !== message.fields.deliveryTag);
        this.messages.splice(index);
    }
    unansweredMessages() {
        return this.messages.length;
    }
    async closeChannel(channel, consumerTag) {
        if (this.isClosing) {
            return;
        }
        this.isClosing = true;
        // Do not accept any new messages
        if (consumerTag) {
            await channel.cancel(consumerTag);
        }
        let count = 0;
        let unansweredMessages = this.unansweredMessages();
        // Give currently executing messages max. 5 minutes to finish before
        // the channel gets closed. If we would not do that, it would not be possible
        // to acknowledge messages anymore for which the executions were already running
        // when for example a new version of the workflow got saved. That would lead to
        // them getting delivered and processed again.
        while (unansweredMessages !== 0 && count++ <= 300) {
            await (0, n8n_workflow_1.sleep)(1000);
            unansweredMessages = this.unansweredMessages();
        }
        await channel.close();
        await channel.connection.close();
    }
}
exports.MessageTracker = MessageTracker;
const parsePublishArguments = (options) => {
    const additionalArguments = {};
    if (options.arguments?.argument.length) {
        options.arguments.argument.forEach((argument) => {
            additionalArguments[argument.key] = argument.value;
        });
    }
    return additionalArguments;
};
exports.parsePublishArguments = parsePublishArguments;
const parseMessage = async (message, options, helpers) => {
    if (options.contentIsBinary) {
        const { content } = message;
        message.content = undefined;
        return {
            binary: {
                data: await helpers.prepareBinaryData(content),
            },
            json: message,
        };
    }
    else {
        let content = message.content.toString();
        if ('jsonParseBody' in options && options.jsonParseBody) {
            content = (0, n8n_workflow_1.jsonParse)(content);
        }
        if ('onlyContent' in options && options.onlyContent) {
            return { json: content };
        }
        else {
            message.content = content;
            return { json: message };
        }
    }
};
exports.parseMessage = parseMessage;
async function handleMessage(message, channel, messageTracker, acknowledgeMode, options) {
    try {
        if (acknowledgeMode !== 'immediately') {
            messageTracker.received(message);
        }
        const item = await (0, exports.parseMessage)(message, options, this.helpers);
        let responsePromise = undefined;
        let responsePromiseHook = undefined;
        if (acknowledgeMode !== 'immediately' && acknowledgeMode !== 'laterMessageNode') {
            responsePromise = this.helpers.createDeferredPromise();
        }
        else if (acknowledgeMode === 'laterMessageNode') {
            responsePromiseHook = this.helpers.createDeferredPromise();
        }
        if (responsePromiseHook) {
            this.emit([[item]], responsePromiseHook, undefined);
        }
        else {
            this.emit([[item]], undefined, responsePromise);
        }
        if (responsePromise && acknowledgeMode !== 'laterMessageNode') {
            // Acknowledge message after the execution finished
            await responsePromise.promise.then(async (data) => {
                if (data.data.resultData.error) {
                    // The execution did fail
                    if (acknowledgeMode === 'executionFinishesSuccessfully') {
                        channel.nack(message);
                        messageTracker.answered(message);
                        return;
                    }
                }
                channel.ack(message);
                messageTracker.answered(message);
            });
        }
        else if (responsePromiseHook && acknowledgeMode === 'laterMessageNode') {
            await responsePromiseHook.promise.then(() => {
                channel.ack(message);
                messageTracker.answered(message);
            });
        }
        else {
            // Acknowledge message directly
            channel.ack(message);
        }
    }
    catch (error) {
        const workflow = this.getWorkflow();
        const node = this.getNode();
        if (acknowledgeMode !== 'immediately') {
            messageTracker.answered(message);
        }
        this.logger.error(`There was a problem with the RabbitMQ Trigger node "${node.name}" in workflow "${workflow.id}": "${error.message}"`, {
            node: node.name,
            workflowId: workflow.id,
        });
    }
}
//# sourceMappingURL=GenericFunctions.js.map