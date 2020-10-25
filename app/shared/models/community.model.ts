import { AvatarDTO, MetaTagCard } from './common.model';
import { RelationType } from './relation-type';
import { User } from './user.model';

export class Community {
  communityId: number;
  communityName: string;
  description: string;
  rules: string;
  slug: string;
  ownerUserDTO: User;
  status: string;
  avatarDTO: AvatarDTO;
  communityUsers: User[];
  tags: string;
  // metaData: MetaData;
  communityMeta: CommunityMeta;
  communityPrivacy: CommunityPrivacy;
}

export class CommunityPublic extends Community {
  metaTagCard: MetaTagCard;
}

export class CommunityUsers {
  userId: number;
  username: string;
  firstName: string;
  lastName: string;
  emailId: string;
  avatarDTO: AvatarDTO;
}

export class MetaInformation {
  type: string;
  content: string;
  attributeType: string;
  metaData: CommunityMetaData;
}

export class CommunityMetaData {
  timeString: string;
  actionDate: string;
  actionDateForPost: string;
  edited: boolean;
}
export class CommunityMeta {
  relationShipType: RelationType;
}
export class CommunityProfileMeta {
  followers: number;
  posts: number;
  totalQuestions: number;
  totalRequests: number;
  trendRank: number;
  inTrend: boolean;
}

export enum CommunityListType {
  owned = 'owned',
  joined = 'joined',
  suggested = 'suggested'
}

export enum CommunityPrivacy {
  pub = 'pub',
  pri = 'pri'
}

export enum CommunityRequestActionType {
  reject = 'reject', accept = 'accept'
}

export enum CommunityActivityPositionType {
  header = 'header', communityPage = 'communityPage'
}

export enum CommunityUsersListViewType {
  list = 'list',
  ribbon = 'ribbon'
}
