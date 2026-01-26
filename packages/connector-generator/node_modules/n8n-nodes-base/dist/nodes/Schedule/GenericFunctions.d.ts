import { type CronExpression, type INode } from 'n8n-workflow';
import type { IRecurrenceRule, ScheduleInterval } from './SchedulerInterface';
export declare function validateInterval(node: INode, itemIndex: number, interval: ScheduleInterval): void;
export declare function recurrenceCheck(recurrence: IRecurrenceRule, recurrenceRules: number[], timezone: string): boolean;
export declare const toCronExpression: (interval: ScheduleInterval) => CronExpression;
export declare function intervalToRecurrence(interval: ScheduleInterval, index: number): IRecurrenceRule;
//# sourceMappingURL=GenericFunctions.d.ts.map