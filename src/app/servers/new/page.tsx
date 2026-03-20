'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewServerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [datacenters, setDatacenters] = useState<any[]>([])
  const [platforms, setPlatforms] = useState<any[]>([])
  
  const [form, setForm] = useState({
    assetTag: '',
    serialNumber: '',
    status: 'New',
    rackId: '',
    rackUStart: '',
    rackUSize: '1',
    ipAddress: '',
    managementIp: '',
    managementUser: '',
    managementPass: '',
    platformId: '',
    cpuModel: '',
    cpuCores: '',
    ramGb: '',
    storageGb: ''
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/datacenters').then(r => r.json()),
      fetch('/api/catalogs/platform').then(r => r.json())
    ]).then(([dcRes, platRes]) => {
      setDatacenters(dcRes.data || [])
      setPlatforms(platRes.data || [])
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        router.push('/servers')
        router.refresh()
      } else {
        alert('Failed to save')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-col">
      <Link href="/servers" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>&larr; Back to Inventory</Link>
      <h1 className="text-2xl mt-4">Add New Server</h1>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Basic Info</h3>
          </div>

          <div>
            <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Asset Tag *</label>
            <input required className="input-glass" value={form.assetTag} onChange={e => setForm({...form, assetTag: e.target.value})} placeholder="SRV-001" />
          </div>
          <div>
            <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Serial Number</label>
            <input className="input-glass" value={form.serialNumber} onChange={e => setForm({...form, serialNumber: e.target.value})} placeholder="DELL-XX" />
          </div>
          <div>
            <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Status</label>
            <select className="input-glass" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="New">New</option>
              <option value="Ready">Ready</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Location & Placement</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Rack</label>
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
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Start U Position</label>
                <input type="number" className="input-glass" value={form.rackUStart} onChange={e => setForm({...form, rackUStart: e.target.value})} />
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Height (U)</label>
                <input type="number" className="input-glass" value={form.rackUSize} onChange={e => setForm({...form, rackUSize: e.target.value})} />
              </div>
            </div>
          </div>

          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Network & Remote Mgmt</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Primary IP Address</label>
                <input className="input-glass" value={form.ipAddress} onChange={e => setForm({...form, ipAddress: e.target.value})} placeholder="10.0.0.5" />
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Management IP (iLO/iDRAC)</label>
                <input className="input-glass" value={form.managementIp} onChange={e => setForm({...form, managementIp: e.target.value})} placeholder="192.168.x.x" />
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

          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Hardware Specs</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Hardware Platform (Chassis)</label>
              <select className="input-glass" value={form.platformId} onChange={e => {
                const sp = platforms.find(p => p.id === e.target.value)
                if(sp && form.rackUSize === '1' && !form.platformId){
                   setForm({...form, platformId: sp.id, rackUSize: sp.heightU.toString()})
                } else {
                   setForm({...form, platformId: e.target.value})
                }
              }}>
                <option value="">-- Generic / Custom --</option>
                {platforms.map(p => (
                  <option key={p.id} value={p.id}>{p.manufacturer} {p.model} ({p.socket}, {p.heightU}U)</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>CPU Model (Custom)</label>
                <input className="input-glass" value={form.cpuModel} onChange={e => setForm({...form, cpuModel: e.target.value})} placeholder="If no platform CPU mapping..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Cores</label>
                  <input type="number" className="input-glass" value={form.cpuCores} onChange={e => setForm({...form, cpuCores: e.target.value})} />
                </div>
                <div>
                  <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>RAM (GB)</label>
                  <input type="number" className="input-glass" value={form.ramGb} onChange={e => setForm({...form, ramGb: e.target.value})} />
                </div>
                <div>
                  <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Storage (GB)</label>
                  <input type="number" className="input-glass" value={form.storageGb} onChange={e => setForm({...form, storageGb: e.target.value})} />
                </div>
              </div>
            </div>
          </div>

        </div>

         <div className="flex-row justify-between" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
           <Link href="/servers" className="btn-secondary">Cancel</Link>
           <button type="submit" className="btn-primary" disabled={loading}>
             {loading ? 'Saving...' : 'Create Server'}
           </button>
         </div>

      </form>
    </div>
  )
}
