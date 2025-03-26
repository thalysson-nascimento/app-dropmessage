# AppDropmessage

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Posteriormente aplicar o SSL

          // "options": {
          //   "proxyConfig": "proxy.conf.json",
          //   "ssl": true,
          //   "sslKey": "cert/server.key",
          //   "sslCert": "cert/server.crt"
          // },

colocar no angular.json
"serve": {
"builder": "@angular-devkit/build-angular:dev-server",
"options": {
"proxyConfig": "proxy.conf.json"
},

./gradlew assembleDebug

para gerar a release .aab
./gradlew bundleRelease

assinar o app
ng build --configuration production
npx cap copy
cd android
./gradlew bundleRelease

Assinar o arquivo .aab
keytool -genkeypair -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore my-release-key.keystore app-release.aab my-key-alias

Por fim, você pode usar o zipalign (ferramenta do Android SDK) para otimizar o pacote
zipalign -v 4 app-release.aab app-release-aligned.aab

sudo kill -9 `sudo lsof -t -i:4200`

executar o emulador
emulator -avd android -gpu host -memory 1500 -no-snapshot -skin 412x915

npx capacitor-assets generate

verificar a chave interna
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android

assinar
jarsigner -verbose -keystore release-key.keystore ./app/app-release.aab DatingMatchSignature
