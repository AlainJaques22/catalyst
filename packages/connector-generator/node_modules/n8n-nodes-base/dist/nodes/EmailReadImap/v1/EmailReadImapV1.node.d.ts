import type { Source as ParserSource } from 'mailparser';
import type { ITriggerFunctions, ICredentialsDecrypted, ICredentialTestFunctions, INodeCredentialTestResult, INodeExecutionData, INodeType, INodeTypeBaseDescription, INodeTypeDescription, ITriggerResponse } from 'n8n-workflow';
export declare function parseRawEmail(this: ITriggerFunctions, messageEncoded: ParserSource, dataPropertyNameDownload: string): Promise<INodeExecutionData>;
export declare class EmailReadImapV1 implements INodeType {
    description: INodeTypeDescription;
    constructor(baseDescription: INodeTypeBaseDescription);
    methods: {
        credentialTest: {
            imapConnectionTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
    };
    trigger(this: ITriggerFunctions): Promise<ITriggerResponse>;
}
//# sourceMappingURL=EmailReadImapV1.node.d.ts.map