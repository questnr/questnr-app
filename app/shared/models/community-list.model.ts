import { Community } from './community.model';
import { User } from './user.model';

export class CommunityListData {
    page?: number;
    userId?: number;
    user?: User;
    communityList?: Community[];
    type?: CommunityListType;
    isEnd?: boolean;
    isOwner: boolean;
}

export enum CommunityListType {
    owned = 'owned',
    joined = 'joined',
    suggested = 'suggested'
}

export enum CommunityListMatCardType {
    simple = "simple",
    expansion = "expansion"
}