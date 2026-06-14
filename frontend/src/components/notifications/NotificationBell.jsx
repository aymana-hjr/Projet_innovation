import React, { useState, useEffect, useRef } from 'react';
import { notificationService } from '../../services/notificationService';
import { FiBell, FiMail, FiCheckCircle, FiInfo, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      const countData = await notificationService.getUnreadCount();
      setNotifications(data || []);
      setUnreadCount(countData.count || 0);
    } catch (err) {
      console.error("Erreur notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Polling toutes les 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleRead = async (id) => {
    await notificationService.markAsRead(id);
    fetchNotifications();
  };

  const handleReadAll = async () => {
    await notificationService.markAllAsRead();
    fetchNotifications();
  };

  const getIcon = (type) => {
    switch (type) {
      case 'INVITE': return <FiMail className="text-blue-500" />;
      case 'GOAL_REACHED': return <FiCheckCircle className="text-amber-500" />;
      default: return <FiInfo className="text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative group p-2 rounded-xl hover:bg-slate-50 transition-all active:scale-90"
      >
        <FiBell className={`w-6 h-6 transition-colors ${unreadCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm"
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 bg-white/80 backdrop-blur-xl rounded-[24px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white overflow-hidden z-[100]"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Notifications</h3>
              <button 
                onClick={handleReadAll}
                className="text-[10px] font-bold text-emerald-600 hover:underline"
              >
                Tout marquer lu
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto overflow-x-hidden custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-10 text-center text-slate-400 text-xs font-medium italic">
                  Aucune notification
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-4 flex gap-4 transition-colors hover:bg-slate-50/50 cursor-pointer border-b border-slate-50 relative ${!n.read ? 'bg-emerald-50/30' : ''}`}
                    onClick={() => !n.read && handleRead(n.id)}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-xs leading-relaxed ${!n.read ? 'font-bold text-slate-900' : 'text-slate-500'}`}>
                        {n.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-medium">
                        {new Date(n.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!n.read && (
                       <div className="w-2 h-2 rounded-full bg-emerald-500 absolute top-4 right-4" />
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-slate-50/50 text-center">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Centre de contrôle v1.0</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
