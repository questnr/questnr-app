import { Injectable } from '@angular/core';
import { File, knownFolders, path } from '@nativescript/core';

@Injectable()
export class QFileService {
    constructor() {
    }

    getAppPostFolderPath(): string {
        return path.join(knownFolders.documents().path, "posts");
    }

    createPostFile(fileName: string): string {
        let filePath = path.join(this.getAppPostFolderPath(), fileName);
        // creates a file at given path, filePath
        const file: File = File.fromPath(filePath);
        return filePath;
    }
}