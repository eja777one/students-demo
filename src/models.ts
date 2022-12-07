export type h01_Resolutions = Array<string>

export type FieldError = {
    message: string | null,
    field: string | null,
};

export type APIErrorResult = {
    errorsMessages: Array<FieldError>,
};

export type h01_CreateVideoInputModel = {
    title: string,
    author: string,
    availableResolutions?: h01_Resolutions | null,
};

export type h01_UpdateVideoInputModel = {
    title: string,
    author: string,
    availableResolutions?: h01_Resolutions | null,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number | null,
    publicationDate?: string
};

export type h01_Video = {
    id: number,
    title: string,
    author: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number | null,
    createdAt?: string,
    publicationDate?: string,
    availableResolutions?: h01_Resolutions | null,
}

export enum videoResolution {
    P144,
    P240,
    P360,
    P480,
    P720,
    P1080,
    P1440,
    P2160
};