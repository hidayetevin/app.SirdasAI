import { type CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'com.sirdasai.app',
    appName: 'Sırdaş AI',
    webDir: 'dist',
    bundledWebRuntime: false,
    plugins: {
        SplashScreen: {
            launchShowDuration: 2000,
            backgroundColor: "#0d0f14",
            showSpinner: true,
            androidSplashResourceName: "splash",
            androidScaleType: "CENTER_CROP"
        }
    }
};

export default config;
