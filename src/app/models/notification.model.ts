export interface Notification {
    notificationId: number;
    userId: number;
    message: string;
    dateSent: string; 
    type: string;
    readStatus: boolean;
  }
  