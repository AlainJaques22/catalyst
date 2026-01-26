import type { NodeExecutionHint } from 'n8n-workflow';
export declare class FieldsTracker {
    fields: {
        [key: string]: boolean;
    };
    add(key: string): void;
    update(key: string, value: boolean): void;
    getHints(): NodeExecutionHint[];
}
//# sourceMappingURL=utils.d.ts.map