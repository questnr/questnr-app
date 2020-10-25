import { Community } from './community.model';
import { Post } from './post-action.model';
import { User } from './user.model';

export class UserQuestionListModalData {
    user?: User;
    community?: Community;
    questionList: Post[];
    page: number;
    title: string;
    totalCounts?: number;
    isOwner: boolean;
    isEnd: boolean;
    type: UserQuestionListModalType;
}

export enum UserQuestionListModalType {
    user = "user",
    community = "community"
}