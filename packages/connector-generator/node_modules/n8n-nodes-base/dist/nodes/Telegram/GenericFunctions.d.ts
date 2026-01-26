import type { IDataObject, IExecuteFunctions, IHookFunctions, IHttpRequestMethods, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-workflow';
export interface IMarkupKeyboard {
    rows?: IMarkupKeyboardRow[];
}
export interface IMarkupKeyboardRow {
    row?: IMarkupKeyboardRow;
}
export interface IMarkupKeyboardRow {
    buttons?: IMarkupKeyboardButton[];
}
export interface IMarkupKeyboardButton {
    text: string;
    additionalFields?: IDataObject;
}
export interface ITelegramInlineReply {
    inline_keyboard?: ITelegramKeyboardButton[][];
}
export interface ITelegramKeyboardButton {
    [key: string]: string | number | boolean;
}
export interface ITelegramReplyKeyboard extends IMarkupReplyKeyboardOptions {
    keyboard: ITelegramKeyboardButton[][];
}
export interface IMarkupForceReply {
    force_reply?: boolean;
    selective?: boolean;
}
export interface IMarkupReplyKeyboardOptions {
    one_time_keyboard?: boolean;
    resize_keyboard?: boolean;
    selective?: boolean;
}
export interface IMarkupReplyKeyboardRemove {
    force_reply?: boolean;
    selective?: boolean;
}
/**
 * Add the additional fields to the body
 *
 * @param {IDataObject} body The body object to add fields to
 * @param {number} index The index of the item
 */
export declare function addAdditionalFields(this: IExecuteFunctions, body: IDataObject, index: number, nodeVersion?: number, instanceId?: string): void;
/**
 * Make an API request to Telegram
 *
 */
export declare function apiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: IHttpRequestMethods, endpoint: string, body: IDataObject, query?: IDataObject, option?: IDataObject): Promise<any>;
export declare function getImageBySize(photos: IDataObject[], size: string): IDataObject | undefined;
export declare function getPropertyName(operation: string): string;
export declare function getSecretToken(this: IHookFunctions | IWebhookFunctions): string;
export declare function createSendAndWaitMessageBody(context: IExecuteFunctions): {
    chat_id: string;
    text: string;
    disable_web_page_preview: boolean;
    parse_mode: string;
    reply_markup: {
        inline_keyboard: {
            text: string;
            url: string;
        }[][];
    };
};
//# sourceMappingURL=GenericFunctions.d.ts.map