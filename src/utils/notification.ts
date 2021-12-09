/* types */
import { Notification } from '../types/notification';
import firebase from 'firebase';

// notificationsと現在時刻を比較して差がn分以内のものがあればTrueを返す
export const getCurrentNotification = (
  notifications: Notification[] | false,
  minutes: number
): Notification | null => {
  const now = firebase.firestore.Timestamp.now();
  const recent = minutes * 60;
  if (!notifications) return null;
  for (const notification of notifications) {
    const diff = now.seconds - notification.notifyAt.seconds;
    if (0 < diff && diff < recent) {
      console.log(notification);
      // かつ写真がまだ撮られていなければnotificationを返す
      if (notification.isTaken === false) return notification;
      // 写真が撮られていれば、nullを返す
      else return null;
    }
  }
  return null;
};
