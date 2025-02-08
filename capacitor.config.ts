import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.dropmessage',
  appName: 'DatingMatch',
  webDir: 'dist/app-dropmessage/browser',
  plugins: {
    App: {
      allowNavigation: ['datingmatch://*'],
    },
    DeepLinks: {
      androidPathPrefix: '/', // Prefixo para deep links no Android
      customScheme: 'datingmatch', // Deve coincidir com o esquema do link
      routes: [
        {
          path: '/verify-token-email',
          component: 'app-verify-token-email',
        },
      ],
    },
    AdMob: {
      androidAppId: 'ca-app-pub-8691674404508428~8935039558',
      maxAdContentRating: 'G', // (G, PG, T, MA) -> Altere conforme necessário
      tagForChildDirectedTreatment: false, // Direcionado a crianças (false para não)
      tagForUnderAgeOfConsent: false, // Usuários menores de idade
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId:
        '999388705991-k8nj0pm920domilt0mtoedfqefgqvf0f.apps.googleusercontent.com', // Web Client ID
      forceCodeForRefreshToken: true,
    },
    SplashScreen: {
      launchShowDuration: 2000, // Evita que a splash screen seja oculta automaticamente
      backgroundColor: '#ffffff',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
