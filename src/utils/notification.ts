/* types */
import { Notification } from '../types/notification';
import firebase from 'firebase';

// notificationsと現在時刻を比較して差がn分以内のものがあればTrueを返す
export const isRecent = (
  notifications: Notification[] | false,
  minutes: number
): boolean => {
  const now = firebase.firestore.Timestamp.now();
  const recent = minutes * 60;
  if (!notifications) return false;
  for (const notification of notifications) {
    const diff = now.seconds - notification.notifyAt.seconds;
    if (0 < diff && diff < recent) {
      return true;
    }
  }
  return false;
};
