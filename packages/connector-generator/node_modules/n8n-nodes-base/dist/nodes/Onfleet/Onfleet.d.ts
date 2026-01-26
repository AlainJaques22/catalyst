import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, INodeExecutionData, IWebhookFunctions } from 'n8n-workflow';
import type { OnfleetAdmins, OnfleetCloneTask, OnfleetDestination, OnfleetHubs, OnfleetListTaskFilters, OnfleetRecipient, OnfleetTask, OnfleetTaskComplete, OnfleetTaskUpdate, OnfleetTeamAutoDispatch, OnfleetTeams, OnfleetWebhook, OnfleetWorker, OnfleetWorkerEstimates, OnfleetWorkerFilter, OnfleetWorkerSchedule } from './interfaces';
export declare class Onfleet {
    /**
     * Returns a valid formatted destination object
     * @param unparsed Whether the address is parsed or not
     * @param address Destination address
     * @param addressNumber Destination number
     * @param addressStreet Destination street
     * @param addressCity Destination city
     * @param addressCountry Destination country
     * @param additionalFields Destination additional fields
     */
    /**
     * Gets the properties of a destination according to the operation chose
     * @param item Current execution data
     * @param operation Current destination operation
     * @param shared Whether the collection is in other resource or not
     */
    static getDestinationFields(this: IWebhookFunctions | IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, item: number, operation: string, shared?: {
        parent: string;
    } | boolean): OnfleetDestination | OnfleetDestination[] | null;
    /**
     * Gets the properties of an administrator according to the operation chose
     * @param item Current execution data
     * @param operation Current administrator operation
     */
    static getAdminFields(this: IExecuteFunctions, item: number, operation: string): OnfleetAdmins | null;
    /**
     * Gets the properties of a hub according to the operation chose
     * @param item Current execution data
     * @param operation Current hub operation
     */
    static getHubFields(this: IExecuteFunctions, item: number, operation: string): OnfleetHubs | null;
    /**
     * Gets the properties of a worker according to the operation chose
     * @param item Current execution data
     * @param operation Current worker operation
     */
    static getWorkerFields(this: IExecuteFunctions, item: number, operation: string): OnfleetWorker | OnfleetWorkerFilter | OnfleetWorkerSchedule | null;
    /**
     * Gets the properties of a webhooks according to the operation chose
     * @param item Current execution data
     * @param operation Current webhooks operation
     */
    static getWebhookFields(this: IExecuteFunctions, item: number, operation: string): OnfleetWebhook | null;
    /**
     * Returns a valid formatted recipient object
     * @param name Recipient name
     * @param phone Recipient phone
     * @param additionalFields Recipient additional fields
     */
    static formatRecipient(name: string, phone: string, additionalFields: IDataObject, options?: IDataObject): OnfleetRecipient;
    /**
     * Gets the properties of a recipient according to the operation chose
     * @param item Current execution data
     * @param operation Current recipient operation
     * @param shared Whether the collection is in other resource or not
     */
    static getRecipientFields(this: IWebhookFunctions | IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, item: number, operation: string, shared?: boolean): OnfleetRecipient | OnfleetRecipient[] | null;
    /**
     * Gets the properties of a task according to the operation chose
     * @param item Current execution data
     * @param operation Current task operation
     */
    static getTaskFields(this: IWebhookFunctions | IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, item: number, operation: string): OnfleetListTaskFilters | OnfleetTask | OnfleetCloneTask | OnfleetTaskComplete | OnfleetTaskUpdate | null;
    /**
     * Gets the properties of a team according to the operation chose
     * @param item Current execution data
     * @param operation Current team operation
     */
    static getTeamFields(this: IExecuteFunctions, item: number, operation: string): OnfleetTeams | OnfleetWorkerEstimates | OnfleetTeamAutoDispatch | null;
    /**
     * Execute the task operations
     * @param resource Resource to be executed (Task)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     */
    static executeTaskOperations(this: IWebhookFunctions | IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, resource: string, operation: string, items: INodeExecutionData[]): Promise<IDataObject | IDataObject[]>;
    /**
     * Execute the destination operations
     * @param resource Resource to be executed (Destination)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     */
    static executeDestinationOperations(this: IExecuteFunctions, resource: string, operation: string, items: INodeExecutionData[]): Promise<IDataObject | IDataObject[]>;
    /**
     * Execute the organization operations
     * @param resource Resource to be executed (Organization)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     */
    static executeOrganizationOperations(this: IExecuteFunctions, resource: string, operation: string, items: INodeExecutionData[]): Promise<IDataObject | IDataObject[]>;
    /**
     * Execute the recipient operations
     * @param resource Resource to be executed (Recipient)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     */
    static executeRecipientOperations(this: IExecuteFunctions, resource: string, operation: string, items: INodeExecutionData[]): Promise<IDataObject | IDataObject[]>;
    /**
     * Execute the administrator operations
     * @param resource Resource to be executed (Administrator)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     */
    static executeAdministratorOperations(this: IExecuteFunctions, resource: string, operation: string, items: INodeExecutionData[]): Promise<IDataObject | IDataObject[]>;
    /**
     * Execute the hub operations
     * @param resource Resource to be executed (Hub)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     */
    static executeHubOperations(this: IExecuteFunctions, resource: string, operation: string, items: INodeExecutionData[]): Promise<IDataObject | IDataObject[]>;
    /**
     * Execute the worker operations
     * @param resource Resource to be executed (Worker)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     */
    static executeWorkerOperations(this: IExecuteFunctions, resource: string, operation: string, items: INodeExecutionData[]): Promise<IDataObject | IDataObject[]>;
    /**
     * Execute the webhook operations
     * @param resource Resource to be executed (Webhook)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     */
    static executeWebhookOperations(this: IExecuteFunctions, resource: string, operation: string, items: INodeExecutionData[]): Promise<IDataObject | IDataObject[]>;
    /**
     * Execute the containers operations
     * @param resource Resource to be executed (Container)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     */
    static executeContainerOperations(this: IExecuteFunctions, resource: string, operation: string, items: INodeExecutionData[]): Promise<IDataObject | IDataObject[]>;
    /**
     * Execute the team operations
     * @param resource Resource to be executed (Team)
     * @param operation Operation to be executed
     * @param items Number of items to process by the node
     */
    static executeTeamOperations(this: IExecuteFunctions, resource: string, operation: string, items: INodeExecutionData[]): Promise<IDataObject | IDataObject[]>;
}
//# sourceMappingURL=Onfleet.d.ts.map