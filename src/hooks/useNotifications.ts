import * as Notifications from "expo-notifications";

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
  const handleNotificate = async ({
    title,
    message,
    delaySeconds = 1,
    repeats = false,
  }: NotificationProps) => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permita notificações");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body: message,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: delaySeconds,
        repeats,
      },
    });
  };
  return { handleNotificate };
};

export default useNotification;
