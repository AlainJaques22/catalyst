import type { IDataObject } from 'n8n-workflow';
import type { IMembershipDto } from './CommonDtos';
declare const UserStatuses: {
    ACTIVE: number;
    PENDING_EMAIL_VERIFICATION: number;
    DELETED: number;
};
export type UserStatusEnum = (typeof UserStatuses)[keyof typeof UserStatuses];
export interface IUserDto {
    activeWorkspace: string;
    defaultWorkspace: string;
    email: string;
    id: string;
    memberships: IMembershipDto[];
    name: string;
    profilePicture: string;
    settings: IDataObject;
    status: UserStatusEnum;
}
export {};
//# sourceMappingURL=UserDtos.d.ts.map