import { openDB } from 'idb';

const DB_NAME = 'ya-wedding-db';
const STORE_NAME = 'bookings';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    },
  });
};

export const saveBookingOffline = async (booking: any) => {
  const db = await initDB();
  await db.add(STORE_NAME, booking);
  
  // Register background sync
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      await (registration as any).sync.register('sync-bookings');
    } catch (err) {
      console.error('Background sync registration failed:', err);
    }
  }
};
