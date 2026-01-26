import type { INodeProperties } from 'n8n-workflow';
import * as deleteRows from './delete.operation';
import * as rowExists from './rowExists.operation';
import * as rowNotExists from './rowNotExists.operation';
import * as get from './get.operation';
import * as insert from './insert.operation';
import * as update from './update.operation';
import * as upsert from './upsert.operation';
export { insert, get, rowExists, rowNotExists, deleteRows, update, upsert };
export declare const description: INodeProperties[];
//# sourceMappingURL=Row.resource.d.ts.map