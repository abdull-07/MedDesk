import { useState, useEffect } from 'react';
import { format } from 'date-fns';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/doctor/notifications');
        const data = await response.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/doctor/notifications/${notificationId}/read`, {
        method: 'PUT',
      });

      if (response.ok) {
        setNotifications(currentNotifications =>
          currentNotifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      alert('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/doctor/notifications/read-all', {
        method: 'PUT',
      });

      if (response.ok) {
        setNotifications(currentNotifications =>
          currentNotifications.map(notification => ({
            ...notification,
            read: true,
          }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      alert('Failed to mark all notifications as read');
    }
  };

  const NotificationCard = ({ notification }) => {
    const getIcon = () => {
      switch (notification.type) {
        case 'appointment_request':
          return (
            <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          );
        case 'cancellation':
          return (
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        case 'rescheduling':
          return (
            <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
        default:
          return (
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          );
      }
    };

    return (
      <div
        className={`bg-white rounded-lg shadow-sm p-6 ${
          !notification.read ? 'border-l-4 border-[#006D77]' : ''
        }`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <p
                className={`text-sm font-medium ${
                  notification.read ? 'text-[#457B9D]' : 'text-[#1D3557]'
                }`}
              >
                {notification.title}
              </p>
              <p className="text-sm text-[#457B9D]">
                {format(new Date(notification.timestamp), 'MMM d, h:mm a')}
              </p>
            </div>
            <p className="mt-1 text-sm text-[#457B9D]">{notification.message}</p>
            {!notification.read && (
              <button
                onClick={() => markAsRead(notification.id)}
                className="mt-2 text-sm text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1D3557]">Notifications</h1>
            {unreadCount > 0 && (
              <p className="mt-1 text-sm text-[#457B9D]">
                You have {unreadCount} unread notification
                {unreadCount === 1 ? '' : 's'}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-[#006D77] hover:text-[#83C5BE] transition-colors duration-300"
            >
              Mark all as read
            </button>
          )}
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <p className="text-[#457B9D]">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications; 