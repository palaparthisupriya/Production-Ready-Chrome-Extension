import { useState, useEffect } from 'react'
import storage, { STORAGE_KEYS } from '../utils/storage'
import '../popup/App.css'

function App() {
  const [blocklist, setBlocklist] = useState([])
  const [newDomain, setNewDomain] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const savedBlocklist = await storage.get(STORAGE_KEYS.BLOCKLIST, 'sync') || []
      setBlocklist(savedBlocklist)
    }
    loadData()
  }, [])

  const handleAddDomain = async () => {
    if (!newDomain.trim()) return
    const domain = newDomain.trim().toLowerCase()
    if (blocklist.includes(domain)) return

    const updated = [...blocklist, domain]
    await storage.set(STORAGE_KEYS.BLOCKLIST, updated, 'sync')
    setBlocklist(updated)
    setNewDomain('')
  }

  const handleRemoveDomain = async (domain) => {
    const updated = blocklist.filter(d => d !== domain)
    await storage.set(STORAGE_KEYS.BLOCKLIST, updated, 'sync')
    setBlocklist(updated)
  }

  const handleExportData = async () => {
    const allData = await storage.getAll('local')
    const syncData = await storage.getAll('sync')
    const exportData = { local: allData, sync: syncData }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `productivity-suite-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  return (
    <div className="popup-container" style={{maxWidth: '600px', margin: '2rem auto', background: '#1a1a1a', padding: '2rem', borderRadius: '12px', border: '1px solid #333'}}>
      <header>
        <h1>Productivity Suite Settings</h1>
      </header>

      <section className="section">
        <h2>Website Blocklist</h2>
        <p style={{fontSize: '0.8rem', color: '#888'}}>Blocked websites will show a warning page when visited.</p>
        <div className="session-controls">
          <input 
            type="text" 
            placeholder="e.g. facebook.com" 
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
          />
          <button onClick={handleAddDomain}>Block Domain</button>
        </div>
        
        <div className="session-list" style={{maxHeight: '300px'}}>
          {blocklist.length === 0 ? (
            <p style={{fontSize: '0.8rem', color: '#666'}}>No domains blocked</p>
          ) : (
            blocklist.map(d => (
              <div key={d} className="session-item">
                <span className="session-name">{d}</span>
                <button className="secondary" style={{padding: '0.2rem 0.5rem'}} onClick={() => handleRemoveDomain(d)}>Remove</button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section" style={{marginTop: '2rem', borderTop: '1px solid #333', paddingTop: '1rem'}}>
        <h2>Export Data</h2>
        <p style={{fontSize: '0.8rem', color: '#888'}}>Download your sessions, notes, and blocklist as a JSON file.</p>
        <button onClick={handleExportData}>Download JSON Export</button>
      </section>
    </div>
  )
}

export default App
