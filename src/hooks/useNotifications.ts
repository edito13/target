import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface NotificationProps {
  title: string;
  message: string;
  repeats?: boolean;
  delaySeconds?: number;
}

const useNotification = () => {
  useEffect(() => {
    const setupAndroidChannel = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          sound: "default",
        });
      }
    };

    setupAndroidChannel();
  }, []);

  const handleNotificate = async ({
    title,
    message,
    delaySeconds = 0,
    repeats = false,
  }: NotificationProps) => {
    let { status } = await Notifications.getPermissionsAsync();

    if (status !== "granted") {
      const permission = await Notifications.requestPermissionsAsync();
      status = permission.status;
    }

    if (status !== "granted") {
      alert("Permita notificações nas configurações do app");
      return;
    }

    // ✅ NOTIFICAÇÃO IMEDIATA
    if (delaySeconds <= 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          sound: "default",
        },
        trigger: null, // ✅ ESSENCIAL NO iOS
      });
      return;
    }

    // ✅ NOTIFICAÇÃO AGENDADA
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
        sound: "default",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.max(delaySeconds, repeats ? 60 : 1),
        repeats,
      },
    });
  };

  return { handleNotificate };
};

export default useNotification;
