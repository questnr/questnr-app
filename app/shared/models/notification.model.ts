import { MetaData } from './common.model';
import { User } from './user.model';
import { Community } from './community.model';
import { PostMedia } from './post-action.model';

export class NotificationDTO {
  notificationId: number;
  userActor: User;
  community: Community;
  postMedia: PostMedia;
  message: string;
  notificationType: string;
  clickAction: string;
  opened: boolean;
  metaData: MetaData;
}

export class PushNotificationDTO {
  isNotification: string;
  type: NotificationType;
  purposeType: NotificationPurposeType;

  communitySlug?: string;
  postId?: number;
}

export enum NotificationPurposeType {
  postCreated = "post_created"
}

export enum NotificationType {
  normal = "normal",
  answer = "answer"
}

export class NewPostRequest {
  postId: number;

  constructor(postId: number) {
    this.postId = postId;
  }
}

export enum PostNotificationType {
  feed = "feed",
  community = "community"
}