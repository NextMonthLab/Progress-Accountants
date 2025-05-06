import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Simulated initial notifications - in a real app, this would come from an API
  useEffect(() => {
    // Fetch notifications from API
    const fetchNotifications = async () => {
      try {
        // In a real app, this would be an API call
        // For now we'll simulate some demo notifications
        const demoNotifications: Notification[] = [
          {
            id: '1',
            title: 'Welcome to Progress',
            message: 'Thanks for using Progress! Explore the new features we have prepared for you.',
            type: 'info',
            timestamp: new Date(),
            read: false,
          },
          {
            id: '2',
            title: 'New visitor peak',
            message: 'Your site reached a new visitor peak yesterday. Check your analytics dashboard.',
            type: 'success',
            timestamp: new Date(Date.now() - 86400000), // 1 day ago
            read: false,
            action: {
              label: 'View Analytics',
              href: '/admin/analytics',
            },
          },
          {
            id: '3',
            title: 'Social Media Post Due',
            message: 'You have a scheduled social media post due in 2 hours.',
            type: 'warning',
            timestamp: new Date(Date.now() - 172800000), // 2 days ago
            read: true,
            action: {
              label: 'Edit Post',
              href: '/tools/social-media-generator',
            },
          },
        ];

        setNotifications(demoNotifications);
        setUnreadCount(demoNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const dismissNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        dismissNotification,
        addNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};