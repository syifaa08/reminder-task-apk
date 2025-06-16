
import { LocalNotifications } from '@capacitor/local-notifications';

export interface TaskNotification {
  id: number;
  title: string;
  body: string;
  scheduleAt: Date;
}

export const scheduleTaskNotification = async (
  taskId: string,
  title: string,
  description: string,
  dueDate: Date,
  reminderMinutes: number
) => {
  try {
    const reminderTime = new Date(dueDate.getTime() - (reminderMinutes * 60 * 1000));
    
    if (reminderTime > new Date()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Task Reminder',
            body: `${title} is due in ${reminderMinutes} minutes${description ? `: ${description}` : ''}`,
            id: parseInt(taskId),
            schedule: { at: reminderTime },
            sound: 'default',
            attachments: [],
            actionTypeId: '',
            extra: { taskId }
          }
        ]
      });
    }
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

export const cancelTaskNotification = async (taskId: string) => {
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: parseInt(taskId) }]
    });
  } catch (error) {
    console.error('Error canceling notification:', error);
  }
};

export const requestNotificationPermissions = async () => {
  try {
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};
