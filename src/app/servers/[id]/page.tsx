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
      platform: true,
      processors: {
        include: { processor: true }
      },
      rams: {
        include: { ram: true }
      },
      disks: {
        include: { disk: true }
      }
    }
  })

  if (!server) return notFound()

  const statusClass = server.status === 'Active'
    ? 'badge-active'
    : server.status === 'Failed'
      ? 'badge-failed'
      : 'badge-maintenance'

  return (
    <div className="flex-col">
      <Link href="/servers" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>&larr; Back to Inventory</Link>

      <div className="flex-row justify-between mb-4 mt-4">
        <div>
          <h1 className="text-2xl" style={{ marginBottom: '0.5rem' }}>{server.assetTag}</h1>
          <div style={{ color: 'var(--text-secondary)' }}>{server.serialNumber || 'No serial number'}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className={statusClass}>{server.status}</span>
          <Link
            href={`/servers/${server.id}/edit`}
            className="btn-secondary"
            style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
          >
            ✏️ Edit
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '2rem' }}>

        {/* Platform & Hardware */}
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
                <td style={{ padding: '0.75rem 0', textAlign: 'right', fontFamily: 'monospace', color: 'var(--accent-primary)' }}>
                  {server.ipAddress || '-'}
                </td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem', marginTop: '2rem' }}>Remote Mgmt</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Mgmt Interface</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  {server.platform?.remoteMgmtType || 'IPMI'}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Mgmt IP URL</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right', fontFamily: 'monospace' }}>
                  {server.managementIp
                    ? <a href={`https://${server.managementIp}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>{server.managementIp}</a>
                    : '-'}
                </td>
              </tr>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Login</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right' }}>{server.managementUser || '-'}</td>
              </tr>
              <tr style={{ borderBottom: '1px dashed var(--border-glass)' }}>
                <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>Secret Password</td>
                <td style={{ padding: '0.75rem 0', textAlign: 'right', fontFamily: 'monospace', opacity: '0.7' }}>
                  {server.managementPass ? '••••••••' : '-'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Installed Hardware */}
        <div className="glass-panel" style={{ padding: '2rem', gridColumn: '1 / -1' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
            Installed Hardware
          </h3>

          {server.processors.length === 0 && server.rams.length === 0 && server.disks.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', padding: '1rem 0' }}>
              No catalog hardware linked to this server. Assign hardware components via the&nbsp;
              <Link href="/catalogs" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Hardware Catalogs</Link>.
            </p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>

              {/* Processors */}
              {server.processors.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                    Processors
                  </div>
                  {server.processors.map(sp => (
                    <div key={sp.id} style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem'
                    }}>
                      <span style={{ fontWeight: 600 }}>×{sp.quantity}</span>
                      {' '}
                      <span>{sp.processor.manufacturer} {sp.processor.model}</span>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                        {sp.processor.socket} · {sp.processor.cores} cores · {sp.processor.frequencyGhz} GHz
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* RAM */}
              {server.rams.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                    Memory
                  </div>
                  {server.rams.map(sr => (
                    <div key={sr.id} style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem'
                    }}>
                      <span style={{ fontWeight: 600 }}>×{sr.quantity}</span>
                      {' '}
                      <span>{sr.ram.manufacturer ? `${sr.ram.manufacturer} ` : ''}{sr.ram.ramType}</span>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                        {sr.ram.capacityGb} GB per stick · {sr.quantity * sr.ram.capacityGb} GB total
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Disks */}
              {server.disks.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                    Storage Drives
                  </div>
                  {server.disks.map(sd => (
                    <div key={sd.id} style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      marginBottom: '0.5rem',
                      fontSize: '0.875rem'
                    }}>
                      <span style={{ fontWeight: 600 }}>×{sd.quantity}</span>
                      {' '}
                      <span>{sd.disk.manufacturer ? `${sd.disk.manufacturer} ` : ''}{sd.disk.storageType} {sd.disk.capacityGb}GB</span>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.2rem' }}>
                        {sd.disk.interface} · {sd.disk.formFactor} · {sd.quantity * sd.disk.capacityGb} GB total
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>

      </div>
    </div>
  )
}
