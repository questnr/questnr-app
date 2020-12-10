import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { environment } from '~/environments/environment';

@Injectable()
export class AWSService {
  s3: S3;
  constructor() {
    AWS.config.accessKeyId = "AKIAWRAGJU6P5PXDJMBN";
    AWS.config.secretAccessKey = "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";
    AWS.config.region = 'ap-southeast-1'; // Region
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'ap-southeast-1:d7e62d98-ce2d-4e0b-b74b-d9793cdab7ff',
    });
    this.initialise();
  }

  initialise() {
    console.log("initialise");
    this.s3 = new AWS.S3({
      apiVersion: '2008-10-17',
      accessKeyId: "AKIAWRAGJU6P5PXDJMBN",
      secretAccessKey: "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",
      params: { Bucket: environment.s3Bucket }
    });
  }

  getObjectURL(key: string): string {
    if (!this.s3) {
      this.initialise();
    }
    let url = this.s3.getSignedUrl('getObject', {
      Key: key
    });
    return url;
  }
}
