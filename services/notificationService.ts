// Notification Service for managing browser notifications

export class NotificationService {
  private static instance: NotificationService;
  private isEnabled: boolean = false;
  private dailyNotificationTime: string = '09:00'; // Default to 9 AM
  private notificationInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.loadSettings();
    this.checkPermission();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Load notification settings from localStorage
  private loadSettings(): void {
    try {
      const settings = localStorage.getItem('notificationSettings');
      if (settings) {
        const parsed = JSON.parse(settings);
        this.isEnabled = parsed.isEnabled || false;
        this.dailyNotificationTime = parsed.dailyNotificationTime || '09:00';
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  }

  // Save notification settings to localStorage
  private saveSettings(): void {
    try {
      const settings = {
        isEnabled: this.isEnabled,
        dailyNotificationTime: this.dailyNotificationTime
      };
      localStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }

  // Check if notifications are supported and request permission
  async checkPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification permission denied');
      return false;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Enable notifications
  async enableNotifications(): Promise<boolean> {
    const hasPermission = await this.checkPermission();
    if (!hasPermission) {
      return false;
    }

    this.isEnabled = true;
    this.saveSettings();
    this.scheduleDailyNotification();
    return true;
  }

  // Disable notifications
  disableNotifications(): void {
    this.isEnabled = false;
    this.saveSettings();
    this.clearDailyNotification();
  }

  // Set daily notification time
  setDailyNotificationTime(time: string): void {
    this.dailyNotificationTime = time;
    this.saveSettings();
    if (this.isEnabled) {
      this.scheduleDailyNotification();
    }
  }

  // Get current settings
  getSettings(): { isEnabled: boolean; dailyNotificationTime: string } {
    return {
      isEnabled: this.isEnabled,
      dailyNotificationTime: this.dailyNotificationTime
    };
  }

  // Schedule daily notification
  private scheduleDailyNotification(): void {
    this.clearDailyNotification();

    if (!this.isEnabled) return;

    const [hours, minutes] = this.dailyNotificationTime.split(':').map(Number);
    const now = new Date();
    const notificationTime = new Date();
    notificationTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (notificationTime <= now) {
      notificationTime.setDate(notificationTime.getDate() + 1);
    }

    const timeUntilNotification = notificationTime.getTime() - now.getTime();

    this.notificationInterval = setTimeout(() => {
      this.sendDailyNotification();
      // Schedule the next day's notification
      this.scheduleDailyNotification();
    }, timeUntilNotification);

    console.log(`Daily notification scheduled for ${notificationTime.toLocaleString()}`);
  }

  // Clear daily notification
  private clearDailyNotification(): void {
    if (this.notificationInterval) {
      clearTimeout(this.notificationInterval);
      this.notificationInterval = null;
    }
  }

  // Send daily notification
  private sendDailyNotification(): void {
    if (!this.isEnabled || Notification.permission !== 'granted') return;

    const notification = new Notification('ReWise AI - Daily Study Reminder', {
      body: 'Time to study! Upload a PDF and create flashcards to boost your learning.',
      icon: '/favicon-32x32.svg',
      badge: '/favicon-16x16.svg',
      tag: 'daily-study-reminder',
      requireInteraction: false,
      silent: false
    });

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    // Handle click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  // Send immediate notification (for testing or special events)
  async sendNotification(title: string, body: string, options?: NotificationOptions): Promise<boolean> {
    if (!this.isEnabled || Notification.permission !== 'granted') {
      return false;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: '/favicon-32x32.svg',
        badge: '/favicon-16x16.svg',
        ...options
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  // Test notification
  async testNotification(): Promise<boolean> {
    return this.sendNotification(
      'ReWise AI - Test Notification',
      'This is a test notification to verify everything is working correctly!',
      { tag: 'test-notification' }
    );
  }
}

export const notificationService = NotificationService.getInstance();
