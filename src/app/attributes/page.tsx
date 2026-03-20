'use client'
import { useState, useEffect } from 'react'

const ATTR_TYPES = [
  { value: 'HW_MANUFACTURER', label: 'Hardware Manufacturers' },
  { value: 'CPU_MANUFACTURER', label: 'CPU Manufacturers' },
  { value: 'SOCKET', label: 'CPU Sockets' },
  { value: 'RAM_TYPE', label: 'RAM Types' },
  { value: 'FORM_FACTOR', label: 'Disk Form Factors' },
  { value: 'INTERFACE', label: 'Disk Interfaces' },
  { value: 'MGMT_TYPE', label: 'Management Types' }
]

export default function AttributesPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeType, setActiveType] = useState('SOCKET')
  const [newValue, setNewValue] = useState('')

  const fetchData = async (type: string) => {
    setLoading(true)
    const res = await fetch(`/api/attributes?type=${type}`).then(r => r.json())
    setData(res.data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData(activeType)
  }, [activeType])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newValue) return
    await fetch('/api/attributes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: activeType, value: newValue })
    })
    setNewValue('')
    fetchData(activeType)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/attributes/${id}`, { method: 'DELETE' })
    fetchData(activeType)
  }

  return (
    <div className="flex-col">
      <h1 className="text-2xl mb-4">Base Dictionary Attributes</h1>
      
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
        {ATTR_TYPES.map(t => (
          <button 
            key={t.value} 
            onClick={() => setActiveType(t.value)}
            className={activeType === t.value ? 'btn-primary' : 'btn-secondary'}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', maxWidth: '600px' }}>
        <form onSubmit={handleAdd} className="flex-row mb-4">
          <input className="input-glass" placeholder={`Add new ${ATTR_TYPES.find(x => x.value === activeType)?.label.slice(0, -1)}...`} value={newValue} onChange={e => setNewValue(e.target.value)} required />
          <button type="submit" className="btn-primary" style={{ whiteSpace: 'nowrap' }}>Save To Dictionary</button>
        </form>

        {loading ? <p>Loading...</p> : data.length === 0 ? <p className="text-muted" style={{color: 'var(--text-muted)'}}>No entries found.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
             <tbody>
               {data.map(item => (
                 <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                   <td style={{ padding: '0.75rem', fontWeight: 500, color: '#fff' }}>{item.value}</td>
                   <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                     <button onClick={() => handleDelete(item.id)} style={{ color: 'var(--status-failed)', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                   </td>
                 </tr>
               ))}
             </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
