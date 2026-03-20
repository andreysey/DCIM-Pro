'use client'
import { useState, useEffect } from 'react'

type TabType = 'platform' | 'processor' | 'ram' | 'disk'

export default function CatalogsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('platform')
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<any>({ storageType: 'SSD', socketNum: '' })

  // Attributes Lists
  const [sockets, setSockets] = useState<any[]>([])
  const [ramTypes, setRamTypes] = useState<any[]>([])
  const [formFactors, setFormFactors] = useState<any[]>([])
  const [interfaces, setInterfaces] = useState<any[]>([])
  const [cpuMfrs, setCpuMfrs] = useState<any[]>([])
  const [hwMfrs, setHwMfrs] = useState<any[]>([])
  const [mgmtTypes, setMgmtTypes] = useState<any[]>([])

  // Nested Platform Configs
  const [pcieSlotsConfig, setPcieSlotsConfig] = useState<any[]>([])
  const [diskSlotsConfig, setDiskSlotsConfig] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/attributes').then(r => r.json()).then(res => {
      const d = res.data || []
      setSockets(d.filter((x: any) => x.type === 'SOCKET'))
      setRamTypes(d.filter((x: any) => x.type === 'RAM_TYPE'))
      setFormFactors(d.filter((x: any) => x.type === 'FORM_FACTOR'))
      setInterfaces(d.filter((x: any) => x.type === 'INTERFACE'))
      setCpuMfrs(d.filter((x: any) => x.type === 'CPU_MANUFACTURER'))
      setHwMfrs(d.filter((x: any) => x.type === 'HW_MANUFACTURER'))
      setMgmtTypes(d.filter((x: any) => x.type === 'MGMT_TYPE'))
    })
  }, [])

  const fetchData = async (type: TabType) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/catalogs/${type}`).then(r => r.json())
      setData(res.data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(activeTab)
    setForm({ storageType: 'SSD', socketNum: '' })
    setPcieSlotsConfig([])
    setDiskSlotsConfig([])
  }, [activeTab])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let payload: any = {}
    if (activeTab === 'platform') {
      payload = { manufacturer: form.manufacturer, model: form.model, socket: form.socket, socketNum: form.socketNum, ramType: form.ramType, ramSlots: form.ramSlots, heightU: form.heightU, remoteMgmtType: form.remoteMgmtType, pcieSlotsConfig, diskSlotsConfig }
    } else if (activeTab === 'processor') {
      payload = { manufacturer: form.manufacturer, model: form.model, socket: form.socket, cores: form.cores, frequencyGhz: form.frequencyGhz }
    } else if (activeTab === 'ram') {
      payload = { manufacturer: form.manufacturer, ramType: form.ramType, capacityGb: form.capacityGb }
    } else if (activeTab === 'disk') {
      payload = { manufacturer: form.manufacturer, storageType: form.storageType, formFactor: form.formFactor, capacityGb: form.capacityGb, interface: form.interface }
    }

    const res = await fetch(`/api/catalogs/${activeTab}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    if (!res.ok) {
       alert('Failed to save: ' + await res.text())
       return
    }

    setForm({ storageType: 'SSD', socketNum: '' })
    setPcieSlotsConfig([])
    setDiskSlotsConfig([])
    fetchData(activeTab)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    await fetch(`/api/catalogs/${activeTab}/${id}`, { method: 'DELETE' })
    fetchData(activeTab)
  }

  // PCI-E Helpers
  const addPcieSlot = () => setPcieSlotsConfig([...pcieSlotsConfig, { version: 'PCI-E 4.0', width: 'x16', heightProfile: 'FH', lengthProfile: 'FL' }])
  const updatePcieSlot = (idx: number, key: string, val: string) => {
    const arr = [...pcieSlotsConfig]
    arr[idx][key] = val
    setPcieSlotsConfig(arr)
  }
  const removePcieSlot = (idx: number) => setPcieSlotsConfig(pcieSlotsConfig.filter((_, i) => i !== idx))

  // Disk Slot Helpers
  const addDiskSlot = () => setDiskSlotsConfig([...diskSlotsConfig, { quantity: 1, interface: 'SATA' }])
  const updateDiskSlot = (idx: number, key: string, val: string) => {
    const arr = [...diskSlotsConfig]
    arr[idx][key] = val
    setDiskSlotsConfig(arr)
  }
  const removeDiskSlot = (idx: number) => setDiskSlotsConfig(diskSlotsConfig.filter((_, i) => i !== idx))

  return (
    <div className="flex-col">
      <h1 className="text-2xl mb-4">Hardware Catalogs (Справочники)</h1>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
        {['platform', 'processor', 'ram', 'disk'].map(t => (
          <button 
            key={t}
            onClick={() => setActiveTab(t as TabType)}
            className={activeTab === t ? 'btn-primary' : 'btn-secondary'}
            style={{ textTransform: 'capitalize' }}
          >
            {t}s
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '2rem' }}>
        
        <form onSubmit={handleCreate} className="glass-panel" style={{ padding: '1.5rem', alignSelf: 'start' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Add new {activeTab}</h3>
          
          <div className="flex-col" style={{ gap: '1rem' }}>
            {activeTab === 'platform' && (
              <>
                <select required className="input-glass" value={form.manufacturer||''} onChange={e => setForm({...form, manufacturer: e.target.value})}>
                  <option value="">Hardware Manufacturer...</option>
                  {hwMfrs.map(s => <option key={s.id} value={s.value}>{s.value}</option>)}
                </select>

                <input required className="input-glass" placeholder="Model (e.g. SSG-6049P)" value={form.model||''} onChange={e => setForm({...form, model: e.target.value})} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <select required className="input-glass" value={form.socket||''} onChange={e => setForm({...form, socket: e.target.value})}>
                    <option value="">Select Socket...</option>
                    {sockets.map(s => <option key={s.id} value={s.value}>{s.value}</option>)}
                  </select>

                  <input type="number" required className="input-glass" placeholder="Socket Num" title="Number of Sockets" value={form.socketNum||''} onChange={e => setForm({...form, socketNum: e.target.value})} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <select className="input-glass" value={form.ramType||''} onChange={e => setForm({...form, ramType: e.target.value})}>
                    <option value="">Select RAM Type...</option>
                    {ramTypes.map(s => <option key={s.id} value={s.value}>{s.value}</option>)}
                  </select>

                  <input type="number" required className="input-glass" placeholder="RAM Slots (qty)" value={form.ramSlots||''} onChange={e => setForm({...form, ramSlots: e.target.value})} />
                </div>
                
                <input type="number" required className="input-glass" placeholder="Height U (e.g. 2)" value={form.heightU||''} onChange={e => setForm({...form, heightU: e.target.value})} />
                
                <select required className="input-glass" value={form.remoteMgmtType||''} onChange={e => setForm({...form, remoteMgmtType: e.target.value})}>
                  <option value="">Mgmt Type (iLO, IPMI)...</option>
                  {mgmtTypes.map(s => <option key={s.id} value={s.value}>{s.value}</option>)}
                </select>

                {/* PCI-E Configurator */}
                <div style={{ border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                  <div className="flex-row justify-between" style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: 'var(--text-primary)' }}>PCI-E Slots</h4>
                    <button type="button" onClick={addPcieSlot} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>+ Add Slot</button>
                  </div>
                  {pcieSlotsConfig.map((slot, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <select className="input-glass" style={{flex: 2}} value={slot.version} onChange={e => updatePcieSlot(i, 'version', e.target.value)}>
                        <option value="PCI-E 3.0">PCI-E 3.0</option>
                        <option value="PCI-E 4.0">PCI-E 4.0</option>
                        <option value="PCI-E 5.0">PCI-E 5.0</option>
                      </select>
                      <select className="input-glass" style={{flex: 1}} value={slot.width} onChange={e => updatePcieSlot(i, 'width', e.target.value)}>
                        <option value="x1">x1</option>
                        <option value="x4">x4</option>
                        <option value="x8">x8</option>
                        <option value="x16">x16</option>
                      </select>
                      <select className="input-glass" style={{flex: 1}} value={slot.heightProfile} onChange={e => updatePcieSlot(i, 'heightProfile', e.target.value)}>
                        <option value="FH">FH</option>
                        <option value="HH">HH</option>
                      </select>
                      <select className="input-glass" style={{flex: 1}} value={slot.lengthProfile} onChange={e => updatePcieSlot(i, 'lengthProfile', e.target.value)}>
                        <option value="FL">FL</option>
                        <option value="HL">HL</option>
                      </select>
                      <button type="button" onClick={() => removePcieSlot(i)} style={{ color: 'var(--status-failed)', background: 'transparent', border: 'none', cursor: 'pointer' }}>&times;</button>
                    </div>
                  ))}
                </div>

                {/* Disk Configurator */}
                <div style={{ border: '1px solid var(--border-glass)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                  <div className="flex-row justify-between" style={{ marginBottom: '1rem' }}>
                    <h4 style={{ color: 'var(--text-primary)' }}>Disk Subsystem</h4>
                    <button type="button" onClick={addDiskSlot} className="btn-secondary" style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>+ Add Group</button>
                  </div>
                  {diskSlotsConfig.map((slot, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input type="number" className="input-glass" style={{flex: 1}} placeholder="Qty" value={slot.quantity} onChange={e => updateDiskSlot(i, 'quantity', e.target.value)} />
                      <select className="input-glass" style={{flex: 2}} value={slot.interface} onChange={e => updateDiskSlot(i, 'interface', e.target.value)}>
                        <option value="">Select Interface</option>
                        {interfaces.map(s => <option key={s.id} value={s.value}>{s.value}</option>)}
                      </select>
                      <button type="button" onClick={() => removeDiskSlot(i)} style={{ color: 'var(--status-failed)', background: 'transparent', border: 'none', cursor: 'pointer' }}>&times;</button>
                    </div>
                  ))}
                </div>

              </>
            )}

            {activeTab === 'processor' && (
              <>
                <select required className="input-glass" value={form.manufacturer||''} onChange={e => setForm({...form, manufacturer: e.target.value})}>
                  <option value="">CPU Manufacturer...</option>
                  {cpuMfrs.map(s => <option key={s.id} value={s.value}>{s.value}</option>)}
                </select>
                <input required className="input-glass" placeholder="Model (e.g. Xeon Gold 6230)" value={form.model||''} onChange={e => setForm({...form, model: e.target.value})} />
                
                <select required className="input-glass" value={form.socket||''} onChange={e => setForm({...form, socket: e.target.value})}>
                  <option value="">Select Socket...</option>
                  {sockets.map(s => <option key={s.id} value={s.value}>{s.value}</option>)}
                </select>

                <input type="number" required className="input-glass" placeholder="Cores (e.g. 20)" value={form.cores||''} onChange={e => setForm({...form, cores: e.target.value})} />
                <input type="number" step="0.1" required className="input-glass" placeholder="Freq GHz (e.g. 2.1)" value={form.frequencyGhz||''} onChange={e => setForm({...form, frequencyGhz: e.target.value})} />
              </>
            )}

            {activeTab === 'ram' && (
              <>
                <select className="input-glass" value={form.manufacturer||''} onChange={e => setForm({...form, manufacturer: e.target.value})}>
                  <option value="">Hardware Manufacturer...</option>
                  {hwMfrs.map(s => <option key={s.id} value={s.value}>{s.value}</option>)}
                </select>

                <select required className="input-glass" value={form.ramType||''} onChange={e => setForm({...form, ramType: e.target.value})}>
                  <option value="">Select RAM Type...</option>
                  {ramTypes.map(s => <option key={s.id} value={s.value}>{s.value}</option>)}
                </select>

                <input type="number" required className="input-glass" placeholder="Capacity GB (e.g. 64)" value={form.capacityGb||''} onChange={e => setForm({...form, capacityGb: e.target.value})} />
              </>
            )}

            {activeTab === 'disk' && (
              <>
                <select className="input-glass" value={form.manufacturer||''} onChange={e => setForm({...form, manufacturer: e.target.value})}>
                  <option value="">Hardware Manufacturer...</option>
                  {hwMfrs.map(s => <option key={s.id} value={s.value}>{s.value}</option>)}
                </select>

                <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', color: 'var(--text-secondary)' }}>
                  <label><input type="radio" name="storageType" value="SSD" checked={form.storageType === 'SSD'} onChange={e => setForm({...form, storageType: e.target.value})} /> SSD</label>
                  <label><input type="radio" name="storageType" value="HDD" checked={form.storageType === 'HDD'} onChange={e => setForm({...form, storageType: e.target.value})} /> HDD</label>
                  <label><input type="radio" name="storageType" value="NVMe" checked={form.storageType === 'NVMe'} onChange={e => setForm({...form, storageType: e.target.value})} /> NVMe</label>
                </div>

                <select required className="input-glass" value={form.formFactor||''} onChange={e => setForm({...form, formFactor: e.target.value})}>
                  <option value="">Select Form Factor...</option>
                  {formFactors.map(s => <option key={s.id} value={s.value}>{s.value}</option>)}
                </select>

                <input type="number" required className="input-glass" placeholder="Capacity GB (e.g. 3840)" value={form.capacityGb||''} onChange={e => setForm({...form, capacityGb: e.target.value})} />
                
                <select required className="input-glass" value={form.interface||''} onChange={e => setForm({...form, interface: e.target.value})}>
                   <option value="">Select Interface...</option>
                   {interfaces.map(s => <option key={s.id} value={s.value}>{s.value}</option>)}
                </select>
              </>
            )}
            
            <button type="submit" className="btn-primary mt-2 w-full">Save into Catalog</button>
          </div>
        </form>

        <div className="glass-panel" style={{ padding: '0', overflowX: 'auto', overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
           {loading ? <p style={{padding: '2rem'}}>Loading...</p> : data.length === 0 ? <p className="text-muted" style={{padding: '2rem', color:'var(--text-muted)'}}>No entries found.</p> : (
             <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
               <thead>
                 <tr style={{ background: 'rgba(0,0,0,0.2)', color: 'var(--text-secondary)', textAlign: 'left', borderBottom: '1px solid var(--border-glass)' }}>
                   <th style={{ padding: '1rem' }}>Identifer / Specs</th>
                   <th style={{ padding: '1rem', width: '80px', textAlign: 'right' }}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {data.map(item => (
                   <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)' }} className="hover:bg-[rgba(255,255,255,0.02)]">
                     <td style={{ padding: '1rem', color: '#ccc' }}>
                       {activeTab === 'platform' && (
                         <>
                           <div style={{color:'#fff', fontWeight:600, fontSize:'1rem'}}>{item.manufacturer} {item.model}</div>
                           <div style={{marginTop:'0.25rem'}}>Sockets: {item.socketNum}x {item.socket} | {item.heightU}U | {item.ramSlots} RAM slots ({item.remoteMgmtType})</div>
                           <div style={{marginTop:'0.25rem', fontSize: '0.8rem', color: 'var(--accent-primary)'}}>
                             {item.pcieSlots && item.pcieSlots.map((s:any) => `${s.version} ${s.width}`).join(', ')}
                           </div>
                           <div style={{fontSize: '0.8rem', color: 'var(--status-running)'}}>
                             {item.diskSlots && item.diskSlots.map((s:any) => `${s.quantity}x ${s.interface}`).join(' + ')}
                           </div>
                         </>
                       )}
                       
                       {activeTab === 'processor' && <div style={{color:'#fff', fontWeight:600, fontSize:'1rem'}}>{item.manufacturer} {item.model}</div>}
                       {activeTab === 'processor' && <div style={{marginTop:'0.25rem'}}>{item.cores} Cores @ {item.frequencyGhz}GHz, Socket: {item.socket}</div>}

                       {activeTab === 'ram' && <div style={{color:'#fff', fontWeight:600, fontSize:'1rem'}}>{item.manufacturer && <span style={{opacity:0.7, fontWeight:400}}>{item.manufacturer}</span>} {item.capacityGb}GB {item.ramType}</div>}
                       
                       {activeTab === 'disk' && <div style={{color:'#fff', fontWeight:600, fontSize:'1rem'}}>{item.manufacturer && <span style={{opacity:0.7, fontWeight:400}}>{item.manufacturer}</span>} <span style={{color: 'var(--accent-primary)'}}>[{item.storageType}]</span> {item.capacityGb}GB {item.interface} {item.formFactor}</div>}
                     </td>
                     <td style={{ padding: '1rem', textAlign: 'right', verticalAlign: 'middle' }}>
                       <button onClick={() => handleDelete(item.id)} style={{ background: 'var(--status-failed-bg)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--status-failed)', color: 'var(--status-failed)', cursor: 'pointer' }}>Delete</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           )}
        </div>

      </div>
    </div>
  )
}
