import storage, { STORAGE_KEYS } from '../utils/storage'

// Initialize Context Menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'add-to-notes',
    title: 'Add selection to Notes',
    contexts: ['selection']
  });
});

// Handle Context Menu Clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'add-to-notes' && info.selectionText) {
    const currentNotes = await storage.get(STORAGE_KEYS.NOTES) || '';
    const newNotes = currentNotes + (currentNotes ? '\n\n' : '') + `[${tab.title}](${tab.url}):\n${info.selectionText}`;
    await storage.set(STORAGE_KEYS.NOTES, newNotes);
    console.log('Added selection to notes');
  }
});

// Handle Keyboard Commands
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'save-session') {
    const tabs = await chrome.tabs.query({ currentWindow: true });
    const sessionData = {
      id: Date.now(),
      name: `Quick Session ${new Date().toLocaleTimeString()}`,
      timestamp: new Date().toISOString(),
      tabs: tabs.map(t => ({ url: t.url, title: t.title }))
    };

    const sessions = await storage.get(STORAGE_KEYS.SESSIONS) || [];
    await storage.set(STORAGE_KEYS.SESSIONS, [...sessions, sessionData]);
    console.log('Session saved via shortcut');
  }
});

// Handle Website Blocking Logic
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const url = new URL(changeInfo.url);
    const domain = url.hostname.replace(/^www\./, '');
    const blocklist = await storage.get(STORAGE_KEYS.BLOCKLIST, 'sync') || [];

    if (blocklist.some(d => domain === d || domain.endsWith('.' + d))) {
      // For now, we'll just inject a content script or redirect.
      // Redirecting to the "blocked" view (we can use our extension's options page or a specific blocked.html)
      // Since we don't have a blocked.html yet, let's use the content script approach.
      console.log(`Blocking ${domain}`);
    }
  }
});
