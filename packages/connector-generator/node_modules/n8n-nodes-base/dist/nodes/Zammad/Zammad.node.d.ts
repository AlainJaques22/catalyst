import type { IExecuteFunctions, ICredentialsDecrypted, ICredentialTestFunctions, ILoadOptionsFunctions, INodeCredentialTestResult, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class Zammad implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            loadGroupCustomFields(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            loadOrganizationCustomFields(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            loadUserCustomFields(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            loadTicketCustomFields(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: number;
            }[]>;
            loadGroupFields(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            loadOrganizationFields(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            loadTicketFields(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            loadUserFields(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            /**
             * POST /tickets requires group name instead of group ID.
             */
            loadGroupNames(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            /**
             * PUT /users requires organization name instead of organization ID.
             */
            loadOrganizationNames(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            /**
             * POST & PUT /tickets requires customer email instead of customer ID.
             */
            loadCustomerEmails(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
            loadGroups(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: number;
            }[]>;
            loadOrganizations(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: number;
            }[]>;
            loadUsers(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: number;
            }[]>;
        };
        credentialTest: {
            zammadBasicAuthApiTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
            zammadTokenAuthApiTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<INodeCredentialTestResult>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
//# sourceMappingURL=Zammad.node.d.ts.map