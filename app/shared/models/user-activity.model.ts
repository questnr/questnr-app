export class UserActivity {
    entityId: number;
    trackingId: number;
    updateRequest: boolean;
    referrer: string;
}

export class TrackingInstance {
    activityInterval: any;
    destroy: Function = () => { };
}

export enum TrackingEntityType {
    post = "post", community = "community", user = "user"
}