import { Injectable } from '@angular/core';
import { Post, PostEditorType, PostType } from '../shared/models/post-action.model';
import { GlobalConstants } from '../shared/constants';

@Injectable()
export class CommonService {
    url: RegExp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    constructor() {
    }

    parseTextToFindURL(text): string {
        let urls, output = null;
        while ((urls = this.url.exec(text)) !== null) {
            output = urls[0];
            // console.log("URLS: " + output);
        }
        return output;
        // if (urls = this.url.exec(text) == null) {
        //   return null;
        // }
    }
    indexOfUsingRegex(content, regex, startpos) {
        var indexOf = content.substring(startpos || 0).search(regex);
        return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
    }
    getDateFromNumber(value: string) {
        const d = new Date(value);
        let month = '01';
        let day: string;
        let dayInt: number = d.getDate();
        if (d.getMonth() + 1 < 10) {
            month = `0${d.getMonth() + 1}`;
        }
        if (dayInt < 10) {
            day = `0${dayInt}`;
        } else {
            day = `${dayInt}`
        }
        return `${d.getFullYear()}-${month}-${day}`;
    }

    appendZero(num: number): string {
        if (num < 9) {
            return '0' + num;
        }
        return num.toString();
    }

    getYouTubeVideoId(url: string): string {
        if (!url) return null;
        let VID_REGEX =
            /(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        return url.match(VID_REGEX) ? url.match(VID_REGEX)[1] : null;
    }

    checkFileExtension(file: File) {
        return file.name.split('.').pop();
    }

    getCommunitySharableLink(communitySlug: string) {
        // Get community sharable link locally
        return [GlobalConstants.siteLink, GlobalConstants.communityPath, communitySlug].join("/");
    }

    getPostSharableLink(post: Post) {
        // Get post sharable link locally
        let path = GlobalConstants.postPath;
        if (post.postType === PostType.question) {
            path = GlobalConstants.postQuestionPath;
        } else if (post?.postData?.postEditorType === PostEditorType.blog) {
            path = GlobalConstants.postBlogPath;
        }
        return [GlobalConstants.siteLink, path, post.slug].join("/");
    }
}