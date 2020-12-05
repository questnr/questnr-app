import { Injectable } from '@angular/core';
import { ImageSource } from '@nativescript/core';
import { ImageCropper } from 'nativescript-imagecropper';
import { QFileService } from './q-file.service';

@Injectable()
export class ImageCropService {
    static FILE_EXTENSION = "jpeg";

    constructor(private qFileService: QFileService) {
    }

    openCommunityAvatarImageCropper(imageSource: ImageSource): Promise<any> {
        return this.openImageCropper(imageSource, {
            setAspectRatioOptions: {
                defaultIndex: 0,
                aspectRatios: [
                    {
                        aspectRatioTitle: 'Community Avatar',
                        aspectRatioX: 12,
                        aspectRatioY: 4
                    },
                ]
            }
        });
    }

    openImageCropper(imageSource: ImageSource, options): Promise<any> {
        return new Promise((resolve, reject) => {
            var imageCropper = new ImageCropper();
            imageCropper.show(imageSource, {}, options).then((args) => {
                if (args.image !== null) {
                    let communityImage = args.image;
                    let timeStamp = Math.floor(new Date().getTime());
                    let communityAvatarPath = this.qFileService.createPostFile(String(timeStamp) + `.${ImageCropService.FILE_EXTENSION}`);
                    if (ImageCropService.FILE_EXTENSION === 'jpeg') {
                        communityImage.saveToFile(communityAvatarPath, "jpeg");
                    } else {
                        communityImage.saveToFile(communityAvatarPath, "png");
                    }
                    resolve({ image: communityImage, path: communityAvatarPath });
                } else {
                    reject();
                }
            }).catch(function (e) {
                reject(e);
            });
        })
    }
}