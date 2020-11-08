import { Injectable } from '@angular/core';
import { SnackBar, SnackBarOptions } from "@nstudio/nativescript-snackbar";
// https://github.com/nstudio/nativescript-snackbar

// Create an instance of SnackBar
const snackbar = new SnackBar();

@Injectable()
export class SnackBarService {
    constructor() {
    }

    show({ snackText, view = undefined }): void {
        snackbar.simple(snackText, 'white', '#f15152', 3, false, view).then((args) => {
            console.log('jsonResult', JSON.stringify(args));
        });
    }

    showSomethingWentWrong(view = undefined): void {
        this.show({ snackText: 'something went wrong.', view });
    }

    showComingSoon(text, view = undefined): void {
        this.show({ snackText: `${text} is coming soon!`, view });
    }

    close(): void {
        snackbar.dismiss();
    }

    /// Show an Action snack bar
    public showAction({ actionText, snackText }) {
        const options: SnackBarOptions = {
            actionText: actionText,
            actionTextColor: '#ff4081',
            snackText: snackText,
            textColor: '#346db2',
            hideDelay: 3500,
            backgroundColor: '#eaeaea',
            maxLines: 3, // Optional, Android Only
            isRTL: false,
            //   view: <View>someView, // Optional, Android Only, default to topmost().currentPage
            //   padding: number //Optional, iOS only
        };
        return new Promise((resolve, reject) => {
            snackbar.action(options).then((args) => {
                if (args.command === "Action") {
                    console.log('jsonResult', JSON.stringify(args));
                    resolve(args);
                } else {
                    reject(args);
                    console.log('jsonResult', JSON.stringify(args));
                }
            });
        });
    }
}