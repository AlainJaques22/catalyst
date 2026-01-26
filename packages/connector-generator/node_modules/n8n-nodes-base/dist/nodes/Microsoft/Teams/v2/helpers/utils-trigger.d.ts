import type { IHookFunctions } from 'n8n-workflow';
import type { TeamResponse, ChannelResponse, SubscriptionResponse } from './types';
export declare function fetchAllTeams(this: IHookFunctions): Promise<TeamResponse[]>;
export declare function fetchAllChannels(this: IHookFunctions, teamId: string): Promise<ChannelResponse[]>;
export declare function createSubscription(this: IHookFunctions, webhookUrl: string, resourcePath: string): Promise<SubscriptionResponse>;
export declare function getResourcePath(this: IHookFunctions, event: string): Promise<string | string[]>;
//# sourceMappingURL=utils-trigger.d.ts.map