import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ServerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const server = await prisma.server.findUnique({
    where: { id },
    include: {
      rack: { include: { datacenter: true } },
      platform: true
    }
  })

  if (!server) return notFound()

  return (
    <div className="flex-col">
      <Link href="/servers" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>&larr; Back to Inventory</Link>
      
      <div className="flex-row justify-between mb-4 mt-4">
        <div>
          <h1 className="text-2xl" style={{ marginBottom: '0.5rem' }}>{server.assetTag}</h1>
          <div style={{ color: 'var(--text-secondary)' }}>{server.serialNumber || 'No serial number'}</div>
        </div>
        <div>
           <span className={server.status === 'Active' ? 'badge-active' : server.status === 'Failed' ? 'badge-failed' : 'badge-maintenance'}>
             {server.status}
           </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* Hardware details */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Platform & Hardware</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Platform/Chassis</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 600 }}>
                  {server.platform ? `${server.platform.manufacturer} ${server.platform.model}` : 'Generic'}
                </td>
              </tr>
              {server.platform && (
                <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Platform Specs</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right', fontSize: '0.875rem', color: '#aaa' }}>
                    {server.platform.socket} | {server.platform.heightU}U | {server.platform.ramSlots} RAM Slots
                  </td>
                </tr>
              )}
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>CPU Model</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{server.cpuModel || '-'}</td>
              </tr>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>CPU Cores</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{server.cpuCores || '-'}</td>
              </tr>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>RAM Memory</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{server.ramGb ? `${server.ramGb} GB` : '-'}</td>
              </tr>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Storage</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{server.storageGb ? `${server.storageGb} GB` : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Location & Network */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>Location & Transport</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Datacenter</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{server.rack?.datacenter.name || 'Unassigned'}</td>
              </tr>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Rack Alias</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{server.rack?.name || '-'}</td>
              </tr>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Unit Position</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>
                  {server.rackUStart ? `U${server.rackUStart} (Height: ${server.rackUSize}U)` : '-'}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Primary IP</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>{server.ipAddress || '-'}</td>
              </tr>
            </tbody>
          </table>
          
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginTop: '2rem' }}>Remote Mgmt</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Mgmt Interface</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right', color: 'var(--accent-primary)', fontWeight: 600 }}>{server.platform?.remoteMgmtType || 'IPMI'}</td>
              </tr>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Mgmt IP URL</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right', fontFamily: 'monospace' }}>
                  {server.managementIp ? <a href={`https://${server.managementIp}`} target="_blank" rel="noopener noreferrer" style={{textDecoration:'underline'}}>{server.managementIp}</a> : '-'}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Login</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{server.managementUser || '-'}</td>
              </tr>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Secret Password</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right', fontFamily: 'monospace', opacity: '0.7' }}>
                  {server.managementPass ? '********' : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
