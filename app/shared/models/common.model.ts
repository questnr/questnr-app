export class MetaList {
    metaInformation: MetaInformation;
    constructor(metaInformation: MetaInformation) {
        this.metaInformation = metaInformation;
    }
}

export class MetaInformation {
    type: string;
    content: string;
    attributeType: string;
}

export class AvatarDTO {
    avatarLink: string;
    iconLink: string;
    smallLink: string;
    mediumLink: string;
}

export class MetaData {
    timeString: string;
    actionDate: string;
    actionDateForPost: string;
    createdAtTimeInUTC: string;
    createdAtTimestamp: number;
    updatedAtTimeInUTC: string;
    updatedAtTimestamp: number;
    edited: boolean;
}

export class MetaTagCard {
    title: string;
    metaList: MetaList[];
}

export class Tag {
    constructor(value) {
        this.value = value;
    }
    value: string;
}

export class ServerError {
    errorMessage: string;
    requestedURI: string;
}

export class CustomError {
    errorMessage: string;
    errorCode: number;
}

export enum ProfileIconTemplateType {
    normal = 'normal',
    heading = 'heading'
}
