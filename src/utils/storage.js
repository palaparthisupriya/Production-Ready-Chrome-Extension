/**
 * Storage wrapper for chrome.storage
 */

export const STORAGE_KEYS = {
  SESSIONS: 'sessions',
  NOTES: 'notes',
  BLOCKLIST: 'blocklist',
  SETTINGS: 'settings'
};

const storage = {
  get: (key, area = 'local') => {
    return new Promise((resolve, reject) => {
      chrome.storage[area].get([key], (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result[key]);
      });
    });
  },

  set: (key, value, area = 'local') => {
    return new Promise((resolve, reject) => {
      chrome.storage[area].set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  },

  getAll: (area = 'local') => {
    return new Promise((resolve, reject) => {
      chrome.storage[area].get(null, (result) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(result);
      });
    });
  },

  remove: (key, area = 'local') => {
    return new Promise((resolve, reject) => {
      chrome.storage[area].remove(key, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve();
      });
    });
  }
};

export default storage;
