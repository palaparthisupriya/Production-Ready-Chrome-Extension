import { useState, useEffect } from 'react'
import storage, { STORAGE_KEYS } from '../utils/storage'
import '../popup/App.css'

function App() {
  const [sessions, setSessions] = useState([])
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const savedSessions = await storage.get(STORAGE_KEYS.SESSIONS) || []
      const savedNotes = await storage.get(STORAGE_KEYS.NOTES) || ''
      setSessions(savedSessions.slice(-5)) // Show last 5
      setNotes(savedNotes)
    }
    loadData()
  }, [])

  const handleRestoreSession = async (session) => {
    for (const tab of session.tabs) {
      await chrome.tabs.create({ url: tab.url })
    }
  }

  return (
    <div className="popup-container" style={{maxWidth: '800px', margin: '3rem auto', padding: '2rem'}}>
      <header style={{marginBottom: '3rem'}}>
        <h1 style={{fontSize: '2.5rem'}}>Focus Mode</h1>
        <p style={{color: '#888'}}>Stay productive with your workspace dashboard.</p>
      </header>

      <div style={{display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem'}}>
        <section className="section">
          <h2>Your Recent Note</h2>
          <div style={{
            background: '#222', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            minHeight: '400px',
            whiteSpace: 'pre-wrap',
            color: '#ddd',
            border: '1px solid #333'
          }}>
            {notes || "No notes yet. Start typing in the extension popup!"}
          </div>
        </section>

        <section className="section">
          <h2>Recent Sessions</h2>
          <div className="session-list">
            {sessions.length === 0 ? (
              <p style={{fontSize: '0.8rem', color: '#666'}}>No saved sessions</p>
            ) : (
              sessions.map(s => (
                <div key={s.id} className="session-item" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem'}}>
                  <span className="session-name" style={{fontWeight: 'bold'}}>{s.name}</span>
                  <span style={{fontSize: '0.7rem', color: '#666'}}>{new Date(s.timestamp).toLocaleDateString()}</span>
                  <button className="secondary" style={{width: '100%'}} onClick={() => handleRestoreSession(s)}>Restore Tabs</button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
