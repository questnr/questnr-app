Project Requirements:

- node: 10.16.3
- npm: 6.9.0
- @angular/cli: 10.1.0
- ns: 7.0.11

Add platform:

> tns platform add android

- If above throws error regarding 'main' thread exception and NativeScriptActivity, add platform using below:
  > tns platform add android@next

Check the emulator available on the machine:

> emulator -list-avds
> Run the emulator using avd
> emulator -avd AVD_NAME

Run the project on emulator

- If error occurs regarding 'Window not defined'
  > tns run android --bundle --env.uglify --env.snapshot
- else
  > tns run android --no-hmr

Update the resources:

> rm -rf node_modules platforms hooks webpack.config.js
> tns resources update
> tns migrate
> npm i
> tns run android

Visual Studio Extensions:

- NativeScript XML Snippets | tsvetan-ganev.nativescript-xml-snippets
- NativeScript | nativescript.nativescript
- Angular Language Service | angular.ng-template
- Angular Snippets (Version 9) | johnpapa.angular2
- Angular Schematics | cyrilletuzi.angular-schematics
- Angular Files | alexiv.vscode-angular2-files
