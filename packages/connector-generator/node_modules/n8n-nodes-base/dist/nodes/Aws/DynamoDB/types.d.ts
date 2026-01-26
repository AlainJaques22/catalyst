export interface IRequestBody {
    [key: string]: string | IAttributeValue | undefined | boolean | object | number;
    TableName: string;
    Key?: object;
    IndexName?: string;
    ProjectionExpression?: string;
    KeyConditionExpression?: string;
    ExpressionAttributeValues?: IAttributeValue;
    ConsistentRead?: boolean;
    FilterExpression?: string;
    Limit?: number;
    ExclusiveStartKey?: IAttributeValue;
}
export interface IAttributeValue {
    [attribute: string]: IAttributeValueValue;
}
export interface IAttributeValueValue {
    [type: string]: string | string[] | IAttributeValue[];
}
export interface IAttributeValueUi {
    attribute: string;
    type: AttributeValueType;
    value: string;
}
export interface IAttributeNameUi {
    key: string;
    value: string;
}
export type AttributeValueType = 'B' | 'BOOL' | 'BS' | 'L' | 'M' | 'N' | 'NULL' | 'NS' | 'S' | 'SS';
export type PartitionKey = {
    details: {
        name: string;
        type: string;
        value: string;
    };
};
export declare const EAttributeValueTypes: {
    readonly S: "S";
    readonly SS: "SS";
    readonly M: "M";
    readonly L: "L";
    readonly NS: "NS";
    readonly N: "N";
    readonly BOOL: "BOOL";
    readonly B: "B";
    readonly BS: "BS";
    readonly NULL: "NULL";
};
export type EAttributeValueType = (typeof EAttributeValueTypes)[keyof typeof EAttributeValueTypes];
export interface IExpressionAttributeValue {
    attribute: string;
    type: EAttributeValueType;
    value: string;
}
export type FieldsUiValues = Array<{
    fieldId: string;
    fieldValue: string;
}>;
export type PutItemUi = {
    attribute: string;
    type: 'S' | 'N';
    value: string;
};
export type AdjustedPutItem = {
    [attribute: string]: {
        [type: string]: string;
    };
};
//# sourceMappingURL=types.d.ts.map