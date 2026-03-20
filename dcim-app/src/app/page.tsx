import { prisma } from '@/lib/prisma'

export default async function Dashboard() {
  const totalServers = await prisma.server.count()
  const activeServers = await prisma.server.count({ where: { status: 'Active' } })
  const failedServers = await prisma.server.count({ where: { status: { in: ['Failed', 'Maintenance'] } } })
  const datacenters = await prisma.datacenter.count()

  return (
    <div className="flex-col">
      <h1 className="text-2xl">Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
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

      </div>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Welcome to DCIM Pro</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: '1.7' }}>
          This is the Minimum Viable Product (MVP) dashboard for managing server hardware 
          lifecycle and physical locations. Use the sidebar to navigate the inventory. 
          Real-time visualizations and alerts will be added in Phase 2.
        </p>
      </div>

    </div>
  )
}
