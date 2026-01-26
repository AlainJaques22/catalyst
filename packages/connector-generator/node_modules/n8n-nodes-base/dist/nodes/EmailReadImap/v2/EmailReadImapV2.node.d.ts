import type { ITriggerFunctions, ICredentialsDecrypted, ICredentialTestFunctions, INodeCredentialTestResult, INodeType, INodeTypeBaseDescription, INodeTypeDescription, ITriggerResponse } from 'n8n-workflow';
export declare class EmailReadImapV2 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        credentialTest: {
            imapConnectionTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
    };
    trigger(this: ITriggerFunctions): Promise<ITriggerResponse>;
}
//# sourceMappingURL=EmailReadImapV2.node.d.ts.map