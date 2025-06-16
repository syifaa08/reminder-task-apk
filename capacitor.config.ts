
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.163c1979a5f9425687ec614a7a7b1e05',
  appName: 'daily-task-whisperer-apk',
  webDir: 'dist',
  server: {
    url: 'https://163c1979-a5f9-4256-87ec-614a7a7b1e05.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;
