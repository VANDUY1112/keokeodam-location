/**
 * Offline-First Background Sync Manager for Keo Keo Dam
 * Manages Outbox Queue, Offline Persistence & Auto-Sync on Network Reconnection
 */

const OUTBOX_STORAGE_KEY = 'kko_offline_outbox';

class OfflineSyncManager {
  constructor() {
    this.isSyncing = false;
    this.listeners = new Set();
  }

  // Get current online status
  isOnline() {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  // Get all items in the outbox queue
  getOutbox() {
    try {
      const raw = localStorage.getItem(OUTBOX_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // Count pending offline items
  getPendingCount() {
    return this.getOutbox().length;
  }

  // Add an action to the outbox queue
  saveToOutbox(action, payload) {
    const outbox = this.getOutbox();
    const item = {
      id: `outbox_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      action, // 'CREATE_RENTAL' | 'CREATE_EXPENSE' | 'UPDATE_RENTAL'
      payload,
      createdAt: new Date().toISOString(),
      retryCount: 0
    };

    outbox.push(item);
    localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(outbox));
    this.notifyListeners('QUEUED', { item, count: outbox.length });
    return item;
  }

  // Remove an item from the outbox
  removeFromOutbox(id) {
    const outbox = this.getOutbox().filter(item => item.id !== id);
    localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(outbox));
    return outbox.length;
  }

  // Clear outbox
  clearOutbox() {
    localStorage.removeItem(OUTBOX_STORAGE_KEY);
    this.notifyListeners('CLEARED', { count: 0 });
  }

  // Execute background sync of all pending items
  async syncOutbox(apiService) {
    if (this.isSyncing || !this.isOnline()) return { synced: 0, pending: this.getPendingCount() };

    const outbox = this.getOutbox();
    if (outbox.length === 0) return { synced: 0, pending: 0 };

    this.isSyncing = true;
    this.notifyListeners('SYNC_START', { count: outbox.length });

    let syncedCount = 0;
    const remainingItems = [];

    for (const item of outbox) {
      try {
        if (item.action === 'CREATE_RENTAL') {
          await apiService.createRental(item.payload, { skipOfflineQueue: true });
          syncedCount++;
        } else if (item.action === 'CREATE_EXPENSE') {
          await apiService.createExpense(item.payload, { skipOfflineQueue: true });
          syncedCount++;
        } else if (item.action === 'UPDATE_RENTAL') {
          await apiService.updateRentalStatus(item.payload.id, item.payload.status, { skipOfflineQueue: true });
          syncedCount++;
        }
      } catch (err) {
        console.warn(`Failed to sync outbox item ${item.id}:`, err.message);
        item.retryCount = (item.retryCount || 0) + 1;
        // Keep in queue if network error, drop if permanent 4xx validation error after 3 tries
        if (item.retryCount < 5) {
          remainingItems.push(item);
        }
      }
    }

    localStorage.setItem(OUTBOX_STORAGE_KEY, JSON.stringify(remainingItems));
    this.isSyncing = false;

    if (syncedCount > 0) {
      this.notifyListeners('SYNC_COMPLETE', { synced: syncedCount, remaining: remainingItems.length });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('kko_offline_synced', {
          detail: { synced: syncedCount, remaining: remainingItems.length }
        }));
      }
    }

    return { synced: syncedCount, pending: remainingItems.length };
  }

  // Subscribe to sync events
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(event, data) {
    this.listeners.forEach(cb => {
      try { cb(event, data); } catch (e) { console.error(e); }
    });
  }

  // Initialize auto-sync on network reconnection
  initAutoSync(apiService) {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => {
      console.log('📶 Internet connection restored. Triggering offline sync...');
      this.notifyListeners('NETWORK_ONLINE', { isOnline: true });
      setTimeout(() => {
        this.syncOutbox(apiService);
      }, 1000);
    });

    window.addEventListener('offline', () => {
      console.log('📵 Internet connection lost. Entering offline-first mode.');
      this.notifyListeners('NETWORK_OFFLINE', { isOnline: false });
    });

    // Initial check on load if online and outbox has items
    if (this.isOnline() && this.getPendingCount() > 0) {
      setTimeout(() => {
        this.syncOutbox(apiService);
      }, 2000);
    }
  }
}

export const offlineSync = new OfflineSyncManager();
export default offlineSync;
