const STORAGE_KEY = 'school_notifications';

export function getNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveNotifications(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save notifications:', e);
  }
}

export function addNotification({ title, message, type = 'info', roleTarget = 'Wali Kelas' }) {
  const list = getNotifications();
  const dateStr = new Date().toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const newNotif = {
    id: Date.now(),
    title,
    message,
    type,
    roleTarget,
    date: dateStr,
    isRead: false
  };
  const updated = [newNotif, ...list];
  saveNotifications(updated);
  return updated;
}
