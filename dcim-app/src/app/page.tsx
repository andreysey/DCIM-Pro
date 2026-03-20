import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default async function Dashboard() {
  const [
    totalServers,
    activeServers,
    failedServers,
    datacenters,
    totalRacks,
    totalNetworkDevices,
    recentServers
  ] = await Promise.all([
    prisma.server.count(),
    prisma.server.count({ where: { status: 'Active' } }),
    prisma.server.count({ where: { status: { in: ['Failed', 'Maintenance'] } } }),
    prisma.datacenter.count(),
    prisma.rack.count(),
    prisma.networkDevice.count(),
    prisma.server.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { rack: { include: { datacenter: true } } }
    })
  ])

  return (
    <div className="flex-col">
      <h1 className="text-2xl">Dashboard Overview</h1>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

        <div className="glass-card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Servers</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalServers}</div>
        </div>

        <div className="glass-card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Servers</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--status-active)' }}>{activeServers}</div>
        </div>

        <div className="glass-card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Failed / Maintenance</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--status-failed)' }}>{failedServers}</div>
        </div>

        <div className="glass-card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Datacenters</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{datacenters}</div>
        </div>

        <div className="glass-card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Racks</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalRacks}</div>
        </div>

        <div className="glass-card glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Network Devices</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{totalNetworkDevices}</div>
        </div>

      </div>

      {/* Recent Servers Activity Feed */}
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem 1.75rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Recent Activity</h2>
          <Link href="/servers" style={{ color: 'var(--accent-primary)', fontSize: '0.875rem' }}>View all →</Link>
        </div>

        {recentServers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No servers yet.{' '}
            <Link href="/servers/new" style={{ color: 'var(--accent-primary)' }}>Add the first one →</Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.875rem 1.75rem', borderBottom: '1px solid var(--border-glass)' }}>Asset Tag</th>
                <th style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border-glass)' }}>Status</th>
                <th style={{ padding: '0.875rem 1rem', borderBottom: '1px solid var(--border-glass)' }}>Location</th>
                <th style={{ padding: '0.875rem 1.75rem', borderBottom: '1px solid var(--border-glass)', textAlign: 'right' }}>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {recentServers.map((s, idx) => {
                const badgeClass = s.status === 'Active' ? 'badge-active' : s.status === 'Failed' ? 'badge-failed' : 'badge-maintenance'
                const location = s.rack ? `${s.rack.datacenter.name} / ${s.rack.name}` : 'Unassigned'
                return (
                  <tr
                    key={s.id}
                    className="hover-row"
                    style={{
                      borderBottom: idx === recentServers.length - 1 ? 'none' : '1px solid var(--border-glass)',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <td style={{ padding: '1rem 1.75rem', fontWeight: 500 }}>
                      <Link href={`/servers/${s.id}`} style={{ color: 'var(--accent-primary)' }}>{s.assetTag}</Link>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={badgeClass}>{s.status}</span>
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#ccc' }}>{location}</td>
                    <td style={{ padding: '1rem 1.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'right' }}>
                      {timeAgo(s.updatedAt)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}

        <style dangerouslySetInnerHTML={{ __html: `.hover-row:hover { background-color: rgba(255,255,255,0.02) !important; }` }} />
      </div>

    </div>
  )
}
