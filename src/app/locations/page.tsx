'use client'
import { useState, useEffect } from 'react'

type Rack = { id: string; name: string; unitsTotal: number; _count?: { servers: number } }
type DC = { id: string; name: string; location: string | null; racks: Rack[] }

export default function LocationsPage() {
  const [dcs, setDcs] = useState<DC[]>([])
  const [loading, setLoading] = useState(true)
  
  // Forms
  const [newDcName, setNewDcName] = useState('')
  const [newDcLoc, setNewDcLoc] = useState('')
  const [newRackName, setNewRackName] = useState('')
  const [newRackUnits, setNewRackUnits] = useState('42')
  const [activeDcId, setActiveDcId] = useState<string | null>(null)

  const fetchDcs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/datacenters').then(r => r.json())
      setDcs(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDcs() }, [])

  const handleAddDc = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDcName) return
    await fetch('/api/datacenters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newDcName, location: newDcLoc })
    })
    setNewDcName('')
    setNewDcLoc('')
    fetchDcs()
  }

  const handleDeleteDc = async (id: string) => {
    if (!confirm('Delete this datacenter? All associated racks must be deleted first or it will fail.')) return
    await fetch(`/api/datacenters/${id}`, { method: 'DELETE' })
    fetchDcs()
  }

  const handleAddRack = async (dcId: string, e: React.FormEvent) => {
    e.preventDefault()
    if (!newRackName) return
    await fetch('/api/racks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newRackName, unitsTotal: newRackUnits, datacenterId: dcId })
    })
    setNewRackName('')
    setActiveDcId(null)
    fetchDcs()
  }

  const handleDeleteRack = async (id: string) => {
    if (!confirm('Delete and remove this rack?')) return
    await fetch(`/api/racks/${id}`, { method: 'DELETE' })
    fetchDcs()
  }

  return (
    <div className="flex-col">
      <h1 className="text-2xl mb-4">Location Configurator</h1>
      
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Add New Datacenter</h3>
        <form onSubmit={handleAddDc} className="flex-row">
          <input className="input-glass" placeholder="Datacenter Name *" value={newDcName} onChange={e => setNewDcName(e.target.value)} required />
          <input className="input-glass" placeholder="Physical Location" value={newDcLoc} onChange={e => setNewDcLoc(e.target.value)} />
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>+ Add DC</button>
        </form>
      </div>

      {loading ? <p>Loading...</p> : dcs.length === 0 ? <p className="text-muted" style={{color: 'var(--text-muted)'}}>No datacenters found.</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {dcs.map(dc => (
            <div key={dc.id} className="glass-card glass-panel" style={{ padding: '1.5rem' }}>
              <div className="flex-row justify-between mb-4">
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{dc.name}</h2>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{dc.location || 'No location set'}</div>
                </div>
                <button onClick={() => handleDeleteDc(dc.id)} className="btn-secondary" style={{ color: 'var(--status-failed)', borderColor: 'var(--status-failed-bg)' }}>Delete DC</button>
              </div>

              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                <div className="flex-row justify-between mb-2">
                  <strong style={{ color: 'var(--text-secondary)' }}>Racks ({dc.racks?.length || 0})</strong>
                  <button onClick={() => setActiveDcId(activeDcId === dc.id ? null : dc.id)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                    + Add Rack
                  </button>
                </div>

                {activeDcId === dc.id && (
                  <form onSubmit={e => handleAddRack(dc.id, e)} className="flex-row mb-4" style={{ background: 'var(--bg-glass-hover)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                    <input className="input-glass" placeholder="Rack Name (e.g. A-10) *" value={newRackName} onChange={e => setNewRackName(e.target.value)} required />
                    <input type="number" className="input-glass" placeholder="Units (e.g. 42)" value={newRackUnits} onChange={e => setNewRackUnits(e.target.value)} style={{ width: '120px' }} />
                    <button type="submit" className="btn-primary" style={{ padding: '0.5rem', fontSize: '0.875rem' }}>Save Rack</button>
                  </form>
                )}

                {dc.racks && dc.racks.length > 0 ? (
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem', fontSize: '0.875rem' }}>
                    <tbody>
                      {dc.racks.map(rack => (
                        <tr key={rack.id} style={{ borderBottom: '1px var(--border-glass) solid' }}>
                          <td style={{ padding: '0.75rem 0', fontWeight: 500 }}>{rack.name}</td>
                          <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>{rack.unitsTotal}U Total</td>
                          <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>{rack._count?.servers || 0} Servers Configured</td>
                          <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                            <button onClick={() => handleDeleteRack(rack.id)} style={{ background: 'none', border: 'none', color: 'var(--status-failed)', cursor: 'pointer' }}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>No racks found in this datacenter.</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
