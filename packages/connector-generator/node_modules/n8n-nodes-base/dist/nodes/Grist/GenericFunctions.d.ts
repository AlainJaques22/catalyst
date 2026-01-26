import type { IDataObject, IExecuteFunctions, IHttpRequestMethods, ILoadOptionsFunctions } from 'n8n-workflow';
import type { GristDefinedFields, GristFilterProperties, GristSortProperties } from './types';
export declare function gristApiRequest(this: IExecuteFunctions | ILoadOptionsFunctions, method: IHttpRequestMethods, endpoint: string, body?: IDataObject | number[], qs?: IDataObject): Promise<any>;
export declare function parseSortProperties(sortProperties: GristSortProperties): string;
export declare function isSafeInteger(val: number): boolean;
export declare function parseFilterProperties(filterProperties: GristFilterProperties): {
    [key: string]: (string | number)[];
};
export declare function parseDefinedFields(fieldsToSendProperties: GristDefinedFields): {
    [key: string]: string;
};
export declare function parseAutoMappedInputs(incomingKeys: string[], inputsToIgnore: string[], item: any): {
    [key: string]: any;
};
export declare function throwOnZeroDefinedFields(this: IExecuteFunctions, fields: GristDefinedFields): void;
//# sourceMappingURL=GenericFunctions.d.ts.map