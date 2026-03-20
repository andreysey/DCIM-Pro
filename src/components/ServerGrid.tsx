'use client'

import { useState } from 'react'
import Link from 'next/link'

type ServerRow = {
  id: string
  assetTag: string
  serialNumber: string | null
  status: string
  location: string
  ipAddress: string | null
  cpuModel: string | null
  ramGb: number | null
  storageGb: number | null
}

export default function ServerGrid({ initialData }: { initialData: ServerRow[] }) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = initialData.filter(s => {
    const matchesSearch = s.assetTag.toLowerCase().includes(search.toLowerCase()) || 
                          (s.ipAddress && s.ipAddress.includes(search))
    const matchesStatus = statusFilter ? s.status === statusFilter : true
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Search Asset Tag or IP..." 
          className="input-glass"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <select 
          className="input-glass" 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="New">New</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>Asset Tag</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>Status</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>Location</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>IP Address</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>Hardware</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, idx) => (
              <tr 
                key={s.id} 
                className="hover-row"
                style={{ 
                  borderBottom: idx === filtered.length - 1 ? 'none' : '1px solid var(--border-glass)',
                  backgroundColor: 'transparent'
                }} 
              >
                <td style={{ padding: '1rem', fontWeight: '500' }}>
                  <Link href={`/servers/${s.id}`} style={{ color: 'var(--accent-primary)' }}>
                    {s.assetTag}
                  </Link>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span className={s.status === 'Active' ? 'badge-active' : s.status === 'Failed' ? 'badge-failed' : 'badge-maintenance'}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#ccc' }}>{s.location}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', fontFamily: 'monospace' }}>{s.ipAddress || '-'}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#aaa' }}>
                  {s.cpuModel ? `${s.cpuModel}` : 'Unknown'}
                  <div style={{ fontSize: '0.75em', marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                    {s.ramGb ? `${s.ramGb}GB RAM` : ''} {s.storageGb ? `| ${s.storageGb}GB` : ''}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <Link href={`/servers/${s.id}`} className="btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
               <tr>
                 <td colSpan={6} style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                   No servers found matching your filters.
                 </td>
               </tr>
            )}
          </tbody>
        </table>
        <style dangerouslySetInnerHTML={{__html: `
          .hover-row:hover { background-color: rgba(255,255,255,0.02) !important; }
        `}} />
      </div>
    </div>
  )
}
