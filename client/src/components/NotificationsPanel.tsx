import React, { useState } from 'react';
import { useNotifications, Notification } from '@/contexts/NotificationsContext';
import { Bell, X, Check, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';

const NotificationItem: React.FC<{
  notification: Notification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
}> = ({ notification, onRead, onDismiss }) => {
  const [, navigate] = useLocation();
  
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };
  
  const handleRead = () => {
    if (!notification.read) {
      onRead(notification.id);
    }
    
    if (notification.action) {
      navigate(notification.action.href);
    }
  };
  
  return (
    <div 
      className={cn(
        "p-3 border-b last:border-b-0 flex gap-3 transition-colors cursor-pointer",
        !notification.read ? "bg-blue-50/50" : "",
        "hover:bg-gray-50"
      )}
    >
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-medium text-gray-900 mb-0.5">{notification.title}</h4>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(notification.id);
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-1.5">{notification.message}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400" title={format(notification.timestamp, 'PPpp')}>
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </span>
          {notification.action && (
            <button 
              onClick={handleRead}
              className="text-xs text-primary font-medium hover:text-primary/80 transition-colors"
            >
              {notification.action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification 
  } = useNotifications();
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1 border-dashed bg-background/80 backdrop-blur-sm relative"
        >
          <Bell className="h-4 w-4" />
          <span className="hidden sm:inline-block">Notifications</span>
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[380px] p-0 max-h-[500px] flex flex-col">
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="font-medium text-sm">Notifications</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs"
            onClick={() => markAllAsRead()}
          >
            <Check className="h-3 w-3 mr-1" />
            Mark all as read
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="h-6 w-6 text-gray-400" />
              </div>
              <p>No notifications yet</p>
              <p className="text-xs mt-1">You're all caught up!</p>
            </div>
          ) : (
            notifications.map(notification => (
              <NotificationItem 
                key={notification.id}
                notification={notification}
                onRead={markAsRead}
                onDismiss={dismissNotification}
              />
            ))
          )}
        </div>
        
        <div className="p-2 border-t text-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs w-full"
            onClick={() => {
              setIsOpen(false);
              window.location.href = '/notifications';
            }}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPanel;