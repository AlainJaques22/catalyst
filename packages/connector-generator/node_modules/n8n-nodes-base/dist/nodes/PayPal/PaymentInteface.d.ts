export declare const RecipientTypes: {
    readonly email: "EMAIL";
    readonly phone: "PHONE";
    readonly paypalId: "PAYPAL_ID";
};
export type RecipientType = (typeof RecipientTypes)[keyof typeof RecipientTypes];
export declare const RecipientWallets: {
    readonly paypal: "PAYPAL";
    readonly venmo: "VENMO";
};
export type RecipientWallet = (typeof RecipientWallets)[keyof typeof RecipientWallets];
export interface IAmount {
    currency?: string;
    value?: number;
}
export interface ISenderBatchHeader {
    sender_batch_id?: string;
    email_subject?: string;
    email_message?: string;
    note?: string;
}
export interface IItem {
    recipient_type?: RecipientType;
    amount?: IAmount;
    note?: string;
    receiver?: string;
    sender_item_id?: string;
    recipient_wallet?: RecipientWallet;
}
export interface IPaymentBatch {
    sender_batch_header?: ISenderBatchHeader;
    items?: IItem[];
}
//# sourceMappingURL=PaymentInteface.d.ts.map