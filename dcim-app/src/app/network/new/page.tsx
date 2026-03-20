'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewNetworkDevicePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [datacenters, setDatacenters] = useState<any[]>([])
  
  const [form, setForm] = useState({
    hostname: '',
    type: 'Switch',
    ipAddress: '',
    managementIp: '',
    managementUser: '',
    managementPass: '',
    portsTotal: '24',
    rackId: '',
    rackUStart: '',
    rackUSize: '1',
  })

  useEffect(() => {
    fetch('/api/datacenters').then(r => r.json())
      .then(res => setDatacenters(res.data || []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/network', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        router.push('/network')
        router.refresh()
      } else {
        alert('Failed to save device')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-col">
      <Link href="/network" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>&larr; Back to Network Inventory</Link>
      <h1 className="text-2xl mt-4">Add Network Device</h1>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Basic Info</h3>
          </div>

          <div>
            <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Hostname *</label>
            <input required className="input-glass" value={form.hostname} onChange={e => setForm({...form, hostname: e.target.value})} placeholder="SW-CORE-01" />
          </div>
          <div>
            <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Device Type</label>
            <select className="input-glass" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              <option value="Switch">Switch</option>
              <option value="Router">Router</option>
              <option value="Firewall">Firewall</option>
              <option value="PDU">PDU / Power Distribution</option>
            </select>
          </div>
          <div>
             <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Total Ports</label>
             <input type="number" className="input-glass" value={form.portsTotal} onChange={e => setForm({...form, portsTotal: e.target.value})} />
          </div>
          
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Location Placement</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Rack Assignment</label>
                <select className="input-glass" value={form.rackId} onChange={e => setForm({...form, rackId: e.target.value})}>
                  <option value="">Unassigned</option>
                  {datacenters.map(dc => (
                    <optgroup key={dc.id} label={dc.name}>
                      {dc.racks.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Start U</label>
                <input type="number" className="input-glass" value={form.rackUStart} onChange={e => setForm({...form, rackUStart: e.target.value})} placeholder="e.g. 42" />
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Height (U)</label>
                <input type="number" className="input-glass" value={form.rackUSize} onChange={e => setForm({...form, rackUSize: e.target.value})} />
              </div>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Network Links & Mgmt</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Primary / Routing IP</label>
                <input className="input-glass" value={form.ipAddress} onChange={e => setForm({...form, ipAddress: e.target.value})} placeholder="10.0.0.1" />
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Management IP (OOB)</label>
                <input className="input-glass" value={form.managementIp} onChange={e => setForm({...form, managementIp: e.target.value})} placeholder="192.168.1.100" />
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Mgmt Login</label>
                <input className="input-glass" value={form.managementUser} onChange={e => setForm({...form, managementUser: e.target.value})} />
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Mgmt Password</label>
                <input className="input-glass" type="password" value={form.managementPass} onChange={e => setForm({...form, managementPass: e.target.value})} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-row justify-between" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
           <Link href="/network" className="btn-secondary">Cancel</Link>
           <button type="submit" className="btn-primary" disabled={loading}>
             {loading ? 'Saving...' : 'Add Device'}
           </button>
        </div>

      </form>
    </div>
  )
}
