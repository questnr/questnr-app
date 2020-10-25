export class ConfirmDialogData {
    title?: string = "Are You Sure?";
    agreeText?: string = "Yes";
    disagreeText?: string = "No";
    confirmDialogContentType?: ConfirmDialogContentType;
}

export enum ConfirmDialogContentType {
    makePrivateCommunity = "makePrivateCommunity",
    makePublicCommunity = "makePublicCommunity"
}