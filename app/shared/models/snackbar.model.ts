export enum ActionType {
    learnMore = "Learn More",
    close = "close"
}

export class SnackBarDefaultData {
    duration?: number = 5000;
    actionType?: ActionType = ActionType.close;
    message: string;
    onAction?: Function = () => { };
}
