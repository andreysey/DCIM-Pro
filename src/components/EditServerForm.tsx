'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Platform = {
  id: string
  manufacturer: string
  model: string
  socket: string
  heightU: number
}

type Rack = { id: string; name: string }
type Datacenter = { id: string; name: string; racks: Rack[] }

type ServerData = {
  id: string
  assetTag: string
  serialNumber: string | null
  status: string
  rackId: string | null
  rackUStart: number | null
  rackUSize: number | null
  ipAddress: string | null
  managementIp: string | null
  managementUser: string | null
  managementPass: string | null
  platformId: string | null
  cpuModel: string | null
  cpuCores: number | null
  ramGb: number | null
  storageGb: number | null
}

type Props = {
  server: ServerData
  datacenters: Datacenter[]
  platforms: Platform[]
}

export default function EditServerForm({ server, datacenters, platforms }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState({
    assetTag: server.assetTag,
    serialNumber: server.serialNumber || '',
    status: server.status,
    rackId: server.rackId || '',
    rackUStart: server.rackUStart?.toString() || '',
    rackUSize: server.rackUSize?.toString() || '1',
    ipAddress: server.ipAddress || '',
    managementIp: server.managementIp || '',
    managementUser: server.managementUser || '',
    managementPass: server.managementPass || '',
    platformId: server.platformId || '',
    cpuModel: server.cpuModel || '',
    cpuCores: server.cpuCores?.toString() || '',
    ramGb: server.ramGb?.toString() || '',
    storageGb: server.storageGb?.toString() || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/servers/${server.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (res.ok) {
        router.push(`/servers/${server.id}`)
        router.refresh()
      } else {
        alert('Failed to save changes.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete server "${server.assetTag}"? This cannot be undone.`
    )
    if (!confirmed) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/servers/${server.id}`, { method: 'DELETE' })
      if (res.ok || res.status === 204) {
        router.push('/servers')
        router.refresh()
      } else {
        alert('Failed to delete server.')
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex-col">
      <Link href={`/servers/${server.id}`} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        &larr; Back to {server.assetTag}
      </Link>
      <h1 className="text-2xl mt-4">Edit Server — {server.assetTag}</h1>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', maxWidth: '800px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>

          {/* ── Basic Info ── */}
          <div style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
              Basic Info
            </h3>
          </div>

          <div>
            <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Asset Tag *</label>
            <input required className="input-glass" value={form.assetTag} onChange={e => setForm({ ...form, assetTag: e.target.value })} placeholder="SRV-001" />
          </div>
          <div>
            <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Serial Number</label>
            <input className="input-glass" value={form.serialNumber} onChange={e => setForm({ ...form, serialNumber: e.target.value })} placeholder="DELL-XX" />
          </div>
          <div>
            <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Status</label>
            <select className="input-glass" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="New">New</option>
              <option value="Ready">Ready</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Failed">Failed</option>
              <option value="Decommissioned">Decommissioned</option>
            </select>
          </div>

          {/* ── Location ── */}
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Location & Placement</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Rack</label>
                <select className="input-glass" value={form.rackId} onChange={e => setForm({ ...form, rackId: e.target.value })}>
                  <option value="">Unassigned</option>
                  {datacenters.map(dc => (
                    <optgroup key={dc.id} label={dc.name}>
                      {dc.racks.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Start U Position</label>
                <input type="number" className="input-glass" value={form.rackUStart} onChange={e => setForm({ ...form, rackUStart: e.target.value })} />
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Height (U)</label>
                <input type="number" className="input-glass" value={form.rackUSize} onChange={e => setForm({ ...form, rackUSize: e.target.value })} />
              </div>
            </div>
          </div>

          {/* ── Network ── */}
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Network & Remote Mgmt</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Primary IP Address</label>
                <input className="input-glass" value={form.ipAddress} onChange={e => setForm({ ...form, ipAddress: e.target.value })} placeholder="10.0.0.5" />
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Management IP (iLO/iDRAC)</label>
                <input className="input-glass" value={form.managementIp} onChange={e => setForm({ ...form, managementIp: e.target.value })} placeholder="192.168.x.x" />
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Mgmt Login</label>
                <input className="input-glass" value={form.managementUser} onChange={e => setForm({ ...form, managementUser: e.target.value })} />
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Mgmt Password</label>
                <input className="input-glass" type="password" value={form.managementPass} onChange={e => setForm({ ...form, managementPass: e.target.value })} />
              </div>
            </div>
          </div>

          {/* ── Hardware ── */}
          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Hardware Specs</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Hardware Platform (Chassis)</label>
              <select className="input-glass" value={form.platformId} onChange={e => {
                const sp = platforms.find(p => p.id === e.target.value)
                if (sp && !form.platformId) {
                  setForm({ ...form, platformId: sp.id, rackUSize: sp.heightU.toString() })
                } else {
                  setForm({ ...form, platformId: e.target.value })
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
                <input className="input-glass" value={form.cpuModel} onChange={e => setForm({ ...form, cpuModel: e.target.value })} placeholder="If no platform CPU mapping..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Cores</label>
                  <input type="number" className="input-glass" value={form.cpuCores} onChange={e => setForm({ ...form, cpuCores: e.target.value })} />
                </div>
                <div>
                  <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>RAM (GB)</label>
                  <input type="number" className="input-glass" value={form.ramGb} onChange={e => setForm({ ...form, ramGb: e.target.value })} />
                </div>
                <div>
                  <label className="mb-2" style={{ display: 'block', color: 'var(--text-secondary)' }}>Storage (GB)</label>
                  <input type="number" className="input-glass" value={form.storageGb} onChange={e => setForm({ ...form, storageGb: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer Actions ── */}
        <div className="flex-row justify-between" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.5rem' }}>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.4)',
              color: '#f87171',
              padding: '0.5rem 1.25rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.28)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.15)')}
          >
            {deleting ? 'Deleting...' : '🗑 Delete Server'}
          </button>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href={`/servers/${server.id}`} className="btn-secondary">Cancel</Link>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
