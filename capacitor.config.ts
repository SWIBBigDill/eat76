/**
 * Capacitor wrapper template for Eat76.
 *
 * Option A (recommended for fast iteration): load production URL.
 * Option B: set webDir to "out" after static export (see docs).
 *
 * Install Capacitor locally before use: npm i @capacitor/core @capacitor/cli
 * Native builds are manual. See docs/MOBILE_APP_STORE.md.
 */
const config = {
  appId: "com.eat76.app",
  appName: "Eat76",
  webDir: "out",
  server: {
    url: "https://eat76.vercel.app",
    cleartext: false,
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#0047BA",
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: "automatic",
    scheme: "Eat76",
  },
};

export default config;
