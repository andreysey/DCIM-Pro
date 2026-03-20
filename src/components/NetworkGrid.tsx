'use client'
import { useState } from 'react'

export default function NetworkGrid({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData)

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this network device?')) return
    await fetch(`/api/network/${id}`, { method: 'DELETE' })
    setData(data.filter(d => d.id !== id))
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>Hostname</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>Device Type</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>Location</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>Mgmt IP</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>Ports</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid var(--border-glass)' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, idx) => (
             <tr 
               key={d.id} 
               style={{ borderBottom: idx === data.length - 1 ? 'none' : '1px solid var(--border-glass)', transition: 'background-color 150ms' }} 
               className="hover-row"
             >
               <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{d.hostname}</td>
               <td style={{ padding: '1rem' }}><span className="badge-active" style={{background: 'var(--bg-glass)', color: '#ccc'}}>{d.type}</span></td>
               <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#ccc' }}>{d.location}</td>
               <td style={{ padding: '1rem', fontFamily: 'monospace' }}>
                 {d.managementIp ? <a href={`https://${d.managementIp}`} target="_blank" rel="noopener noreferrer" style={{color: 'var(--accent-primary)', textDecoration: 'underline'}}>{d.managementIp}</a> : '-'}
               </td>
               <td style={{ padding: '1rem' }}>{d.portsTotal || '-'}</td>
               <td style={{ padding: '1rem' }}>
                 <button onClick={() => handleDelete(d.id)} className="btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--status-failed)', borderColor: 'var(--status-failed-bg)' }}>Delete</button>
               </td>
             </tr>
          ))}
          {data.length === 0 && (
             <tr>
               <td colSpan={6} style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No network devices found.</td>
             </tr>
          )}
        </tbody>
      </table>
      <style dangerouslySetInnerHTML={{__html: `
        .hover-row:hover { background-color: rgba(255,255,255,0.02) !important; }
      `}} />
    </div>
  )
}
