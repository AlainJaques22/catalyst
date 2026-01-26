export declare const UPLOAD_CHUNK_SIZE: number;
export type SearchFilter = {
    driveId?: {
        value: string;
        mode: string;
    };
    folderId?: {
        value: string;
        mode: string;
    };
    whatToSearch?: 'all' | 'files' | 'folders';
    fileTypes?: string[];
    includeTrashed?: boolean;
};
export declare const RLC_DRIVE_DEFAULT = "My Drive";
export declare const RLC_FOLDER_DEFAULT = "root";
export declare const DRIVE: {
    readonly FOLDER: "application/vnd.google-apps.folder";
    readonly AUDIO: "application/vnd.google-apps.audio";
    readonly DOCUMENT: "application/vnd.google-apps.document";
    readonly SDK: "application/vnd.google-apps.drive-sdk";
    readonly DRAWING: "application/vnd.google-apps.drawing";
    readonly FILE: "application/vnd.google-apps.file";
    readonly FORM: "application/vnd.google-apps.form";
    readonly FUSIONTABLE: "application/vnd.google-apps.fusiontable";
    readonly MAP: "application/vnd.google-apps.map";
    readonly PHOTO: "application/vnd.google-apps.photo";
    readonly PRESENTATION: "application/vnd.google-apps.presentation";
    readonly APP_SCRIPTS: "application/vnd.google-apps.script";
    readonly SITES: "application/vnd.google-apps.sites";
    readonly SPREADSHEET: "application/vnd.google-apps.spreadsheet";
    readonly UNKNOWN: "application/vnd.google-apps.unknown";
    readonly VIDEO: "application/vnd.google-apps.video";
};
//# sourceMappingURL=interfaces.d.ts.map