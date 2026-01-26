import type { INodeProperties } from 'n8n-workflow';
export declare const showFor: (resources: string[]) => (operations?: string[]) => Partial<INodeProperties>;
export declare const mapWith: <T>(...objects: Array<Partial<T>>) => (item: Partial<T>) => any;
export declare const getId: () => INodeProperties;
export declare const getAdditionalOptions: (fields: INodeProperties[]) => INodeProperties;
//# sourceMappingURL=utils.d.ts.map