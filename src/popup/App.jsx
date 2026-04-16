import { useState, useEffect } from 'react'
import storage, { STORAGE_KEYS } from '../utils/storage'
import './App.css'

function App() {
  const [sessionName, setSessionName] = useState('')
  const [sessions, setSessions] = useState([])
  const [notes, setNotes] = useState('')

  useEffect(() => {
    // Load existing data
    const loadData = async () => {
      const savedSessions = await storage.get(STORAGE_KEYS.SESSIONS) || []
      const savedNotes = await storage.get(STORAGE_KEYS.NOTES) || ''
      setSessions(savedSessions)
      setNotes(savedNotes)
    }
    loadData()
  }, [])

  const handleSaveSession = async () => {
    if (!sessionName.trim()) return

    const tabs = await chrome.tabs.query({ currentWindow: true })
    const sessionData = {
      id: Date.now(),
      name: sessionName,
      timestamp: new Date().toISOString(),
      tabs: tabs.map(t => ({ url: t.url, title: t.title }))
    }

    const updatedSessions = [...sessions, sessionData]
    await storage.set(STORAGE_KEYS.SESSIONS, updatedSessions)
    setSessions(updatedSessions)
    setSessionName('')
  }

  const handleRestoreSession = async (session) => {
    for (const tab of session.tabs) {
      await chrome.tabs.create({ url: tab.url })
    }
  }

  const handleDeleteSession = async (sessionId) => {
    const updated = sessions.filter(s => s.id !== sessionId)
    await storage.set(STORAGE_KEYS.SESSIONS, updated)
    setSessions(updated)
  }

  const handleNotesChange = async (e) => {
    const newNotes = e.target.value
    setNotes(newNotes)
    await storage.set(STORAGE_KEYS.NOTES, newNotes)
  }

  const openOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  return (
    <div className="popup-container">
      <header>
        <h1>Productivity Suite</h1>
        <button className="secondary" onClick={openOptions}>⚙️</button>
      </header>

      <section className="section">
        <h2>Tab Sessions</h2>
        <div className="session-controls">
          <input 
            type="text" 
            placeholder="Session name..." 
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
          <button onClick={handleSaveSession}>Save</button>
        </div>
        
        <div className="session-list">
          {sessions.length === 0 ? (
            <p style={{fontSize: '0.8rem', color: '#666'}}>No saved sessions</p>
          ) : (
            sessions.map(s => (
              <div key={s.id} className="session-item">
                <span className="session-name" title={s.tabs.map(t=>t.title).join('\n')}>{s.name} ({s.tabs.length})</span>
                <div style={{display: 'flex', gap: '4px'}}>
                  <button className="secondary small" onClick={() => handleRestoreSession(s)}>Open</button>
                  <button className="secondary small danger" onClick={() => handleDeleteSession(s.id)}>×</button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section">
        <h2>Quick Notes</h2>
        <textarea 
          className="notes-area"
          placeholder="Type your notes here..."
          value={notes}
          onChange={handleNotesChange}
        />
      </section>

      <footer className="footer">
        <button className="link-button" onClick={openOptions}>Manage Blocklist & More</button>
      </footer>
    </div>
  )
}

export default App
