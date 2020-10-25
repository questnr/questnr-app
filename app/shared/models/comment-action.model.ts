import { MetaData } from './common.model';
import { PostMedia } from './post-action.model';
import { User } from './user.model';

export class CommentAction {
    commentActionId: number;
    commentObject: string;
    userActorDTO: User;
    childCommentDTOSet: ChildCommentAction[];
    childComment: boolean;
    metaData: MetaData;
    commentActionMeta: CommentActionMeta;
    commentMediaList: PostMedia[];
}

export class ChildCommentAction {
    commentActionId: number;
    commentObject: string;
    userActorDTO: User;
    childComment: boolean;
    metaData: MetaData;
    commentActionMeta: CommentActionMeta;
    commentMediaList: PostMedia[];
}

export class CommentActionMeta {
    liked: boolean;
}

export enum CommentParentClassType {
    feed = 'feed',
    singlePost = 'singlePost'
}
