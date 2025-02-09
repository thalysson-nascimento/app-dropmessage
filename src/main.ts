import { bootstrapApplication } from '@angular/platform-browser';
import { SplashScreen } from '@capacitor/splash-screen';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .then(async () => {
    setTimeout(async () => {
      await SplashScreen.hide(); // Oculta a splash screen após 3 segundos
    }, 3000);
  })
  .catch((err) => console.error(err));
