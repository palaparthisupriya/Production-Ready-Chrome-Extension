# Productivity Suite Chrome Extension

A premium, multi-feature Chrome extension built with React and Vite for Manifest V3. Designed to streamline your digital workspace and minimize distractions.

##  Features

- **Tab Session Management**: Save your entire window of tabs and restore them with one click.
- **Focus Mode (Website Blocker)**: Manage a domain-based blocklist. Blocked sites display a custom productivity dashboard.
- **Quick Notes**: A persistent notes area synced across the extension popup and your new tab page.
- **Context Menu Integration**: Highlight any text on the web and right-click to save it directly to your notes.
- **Keyboard Shortcuts**: Use `Ctrl+Shift+S` to instantly save your current tab session.
- **Custom New Tab Page**: Replaces the default new tab with a focus-oriented dashboard showing your recent notes and sessions.

##  Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite (configured for multi-entry Chrome extension bundling)
- **Styling**: Vanilla CSS (Premium Glassmorphism & Dark Mode)
- **Persistence**: Chrome Storage API (Local & Sync)
- **Manifest**: MV3

##  Installation

1. Clone or download this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Load into Chrome:
   - Go to `chrome://extensions/`.
   - Enable **Developer mode**.
   - Click **Load unpacked**.
   - Select the `dist` folder in the project directory.

##  Usage Guide

- **Popup**: Click the extension icon to save sessions or take notes.
- **Options**: Use the gear icon in the popup to manage your website blocklist and export data.
- **New Tab**: Open a new tab to see your focus dashboard.
- **Notes**: Highlight text on any website, right-click, and select "Add selection to Notes".
- **Shortcuts**: `Ctrl+Shift+S` (Windows/Linux) or `Cmd+Shift+S` (Mac) to save current window session.

## License
MIT
