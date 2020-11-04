import { Component } from '@angular/core';
import { isAndroid, LoadEventData, Page, WebView } from '@nativescript/core';
import * as application from "@nativescript/core/application";
import { AndroidActivityBackPressedEventData } from '@nativescript/core/application/application-interfaces';
import * as fs from "@nativescript/core/file-system";
import { ImagePickerOptions, Mediafilepicker } from 'nativescript-mediafilepicker';
import * as webViewInterfaceModule from 'nativescript-webview-interface';
import * as path from 'path';
import { environment } from '~/environments/environment';
import { LoaderService } from '~/services/loader.service';
import { SnackBarService } from '~/services/snackbar.service';
import { AuthService } from '../services/auth.service';
import { UtilityService } from '../services/utility.service';

declare let android: any;
var oWebViewInterface;

@Component({
  selector: 'qn-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  page: Page;
  webView: WebView;
  webViewLoadedVal: number = 0;
  webViewSRC: string = encodeURI(`${fs.knownFolders.currentApp().path}/assets/browser/index.html`);
  triesToExit: number = 0;

  // This pattern makes use of Angular’s dependency injection implementation to inject an instance of the ItemService service into this class.
  // Angular knows about this service because it is included in your app’s main NgModule, defined in app.module.ts.
  constructor(private loaderService: LoaderService,
    private authService: AuthService,
    private utilityService: UtilityService,
    private snackBarService: SnackBarService) {
    // this.authService.logout();
  }

  ngOnInit(): void {
    this.loaderService.onRequestStart();
    this.webViewLoadedVal = 0;
  }

  webViewLoaded() {
    this.webViewLoadedVal++;
  }

  pageLoaded(args) {
    this.page = args.object;
    this.setupWebViewInterface();
  }

  setupWebViewInterface() {
    console.log("setupWebViewInterface");
    this.webView = <WebView>this.page.getViewById('webView');
    application.android.on(application.AndroidApplication.activityBackPressedEvent,
      (data: AndroidActivityBackPressedEventData) => {
        if (this.webView.canGoBack) //if webview can go back
          this.webView.goBack();
        else {
          // true, prevents default back button behavior
          this.triesToExit++;
          data.cancel = (this.triesToExit > 1) ? false : true;
          if (data.cancel)
            this.snackBarService.show({ snackText: "Press again to exit" });
          setTimeout(() => {
            this.triesToExit = 0;
          }, 2000);
        }
      });
    var baseUrl = "file:///" + require("file-system").knownFolders.documents().path;

    setTimeout(() => {
      oWebViewInterface = new webViewInterfaceModule.WebViewInterface(
        this.webView, environment.production || true ?
        `${baseUrl}/app/www/browser/index.html` :
        'http://10.0.2.2:4200');
    })

    if (isAndroid) {
      // var TNSWebViewClient =
      //   android.webkit.WebViewClient.extend({
      //     shouldOverrideUrlLoading: function (view, url) {
      //       console.log('Show url parameters: ' + url);
      //       // utilityModule.openUrl(url); // for API below 24
      //       openUrl(parseInt(Device.sdkVersion) < 24 ?
      //         url : url.getUrl().toString());
      //       return true;
      //     }
      //   });
      // this.webView.android.setWebViewClient(new TNSWebViewClient());
      try {
        // this.webView.android.setWebChromeClient(new android.webkit.WebChromeClient());
        this.webView.android.getSettings().setJavaScriptEnabled(true);
        this.webView.android.getSettings().setAllowFileAccess(true);
        // this.webView.android.getSettings().setWebContentsDebuggingEnabled(true);
        this.webView.android.getSettings().setDomStorageEnabled(true);
        this.webView.android.getSettings().setDatabaseEnabled(true);
        this.webView.android.getSettings().setDatabasePath(path.join(baseUrl, 'databases/'));
        this.webView.android.getSettings().setUseWideViewPort(true);
        // this.webView.android.setAppCacheMaxSize(1024 * 1024 * 8);
        this.webView.android.getSettings().setPluginsEnabled(true);
        this.webView.android.getSettings().setAppCachePath(path.join(baseUrl, 'cache/'));
        this.webView.android.getSettings().setAppCacheEnabled(true);
        this.webView.android.getSettings().setAllowFileAccessFromFileURLs(true);
        this.webView.android.getSettings().setAllowUniversalAccessFromFileURLs(true);
        this.webView.android.getSettings().setBuiltInZoomControls(false);
        this.webView.android.getSettings().setDisplayZoomControls(false);
      } catch (e) { }

    } else {
      // else iOS
      console.log("ios webview preocessing");
      this.webView.ios.scrollView.scrollEnabled = true;
      this.webView.ios.scrollView.bounces = true;
    }

    // this.webView.android.getSettings().setCacheMode(android.webkit.WebSettings.LOAD_NO_CACHE);

    // var baseUrl = "file:///" + require("file-system").knownFolders.documents().path + '/app/www/browser';
    // this.webView.android.loadDataWithBaseURL(baseUrl, "text/html; charset=utf-8", "utf-8", null);

    this.webView.on(WebView.loadFinishedEvent, (args: LoadEventData) => {
      if (!args.error) {
        this.onWebViewLoaded();
        // emit event to webView or call JS function of webView
      }
      else {
        console.log("Error", args.error)
      }
    });
  }

  onWebViewLoaded() {
    this.webViewLoaded();
    if (this.webViewLoadedVal === 1) {
      console.log("Loaded");
      this.webViewLoaded();
      this.handleEventFromWebView();
      this.onStartUpCallJSFunctions();
    }
  }

  handleEventFromWebView() {
    oWebViewInterface.on('LOGOUT', () => {
      console.log("LOGOUT");
      this.authService.logout();
    });

    oWebViewInterface.on('OPEN_MEDIA_PICKER', this.handleMediaPicker);
  }

  onStartUpCallJSFunctions() {
    console.log("onStartUpCallJSFunctions");
    setTimeout(() => {
      console.log("SENDING...")
      this.loaderService.onRequestEnd();

      // load configuration data
      oWebViewInterface.emit('LOAD_DATA',
        { environment });

      // send the user token
      oWebViewInterface.emit('LOGIN_WITN_TOKEN',
        JSON.parse(this.authService.getLoginResponse()),
        (result) => {
        });
    }, 5000);
  }

  handleMediaPicker(): void {
    let options: ImagePickerOptions = {
      android: {
        isCaptureMood: false, // if true then camera will open directly.
        isNeedCamera: true,
        maxNumberFiles: 10,
        isNeedFolderList: true
      }, ios: {
        isCaptureMood: false, // if true then camera will open directly.
        isNeedCamera: true,
        maxNumberFiles: 10
      }
    };

    let mediafilepicker = new Mediafilepicker();
    mediafilepicker.openImagePicker(options);

    mediafilepicker.on("getFiles", function (res) {
      let results = res.object.get('results');
      console.dir(results);
      oWebViewInterface.emit('FILES_TO_BE_UPLOADED', results);
    });

    // for iOS iCloud downloading status
    // mediafilepicker.on("exportStatus", function (res) {
    //   let msg = res.object.get('msg');
    //   console.log(msg);
    // });

    mediafilepicker.on("error", function (res) {
      let msg = res.object.get('msg');
      console.log(msg);
    });

    mediafilepicker.on("cancel", function (res) {
      let msg = res.object.get('msg');
      console.log(msg);
    });
  }

  isTablet() {
    return this.utilityService.isTablet();
  }
}