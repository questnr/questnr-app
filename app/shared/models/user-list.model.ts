import { Community } from './community.model';
import { User } from './user.model';

export class UserListData {
    user?: User;
    type?: UserListType;
    community?: Community;
    postId?: number;
    title?: string;
}

export enum UserListType {
    following = "following",
    followers = "followers",
    like = "like",
    members = "members",
    requests = "requests",
    inviteUserList = "inviteUserList"
}

export class UserListViewVariables {
    public static get small() {
        return {
            profileIconSize: 50
        }
    }
    public static get large() {
        return {
            profileIconSize: 60
        }
    }
}

export enum UserListViewSizeType {
    small = 'small', large = 'large'
}
