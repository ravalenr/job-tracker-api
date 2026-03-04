import React, { useState, useEffect, useCallback } from 'react'
import { api } from './api/applications'
import StatsBar from './components/StatsBar'
import ApplicationTable from './components/ApplicationTable'
import ApplicationModal from './components/ApplicationModal'

const STATUSES = ['ALL', 'APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN']

export default function App() {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null) // null | 'new' | app object
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const loadData = useCallback(async () => {
    try {
      const [apps, statsData] = await Promise.all([api.getAll(), api.getStats()])
      setApplications(apps)
      setStats(statsData)
      setError('')
    } catch (e) {
      setError('Could not connect to the API. Make sure your Spring Boot server is running on port 8080.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleSave = async (formData) => {
    if (modal?.id) {
      await api.update(modal.id, formData)
    } else {
      await api.create(formData)
    }
    await loadData()
  }

  const handleDelete = async (id) => {
    await api.delete(id)
    await loadData()
  }

  const filtered = applications
    .filter(a => filter === 'ALL' || a.status === filter)
    .filter(a =>
      !search ||
      a.companyName.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'sticky',
        top: 0,
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(12px)',
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'var(--accent)',
            borderRadius: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px',
          }}>⚡</div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '800',
            fontSize: '17px',
            letterSpacing: '-0.02em',
          }}>
            Job Tracker
          </span>
          <span style={{
            fontSize: '10px',
            color: 'var(--text-muted)',
            padding: '2px 7px',
            border: '1px solid var(--border)',
            borderRadius: '20px',
          }}>
            v1.0
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="https://job-tracker-api-ouah.onrender.com/swagger-ui/index.html"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: '12px', color: 'var(--text-muted)',
              textDecoration: 'none', padding: '6px 12px',
              border: '1px solid var(--border)', borderRadius: 'var(--radius)',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.borderColor = 'var(--border-light)' }}
            onMouseLeave={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.borderColor = 'var(--border)' }}
          >
            API Docs ↗
          </a>
          <button
            onClick={() => setModal({})}
            style={{
              padding: '8px 18px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 'var(--radius)',
              color: '#0a0a0f',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background 0.15s, transform 0.1s',
            }}
            onMouseEnter={e => { e.target.style.background = 'var(--accent-hover)'; e.target.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.target.style.background = 'var(--accent)'; e.target.style.transform = 'translateY(0)' }}
          >
            + New Application
          </button>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px' }}>

        {/* Stats */}
        <StatsBar stats={stats} />

        {/* Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          gap: '16px',
          flexWrap: 'wrap',
        }}>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setFilter(s)} style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid',
                borderColor: filter === s ? 'var(--accent)' : 'var(--border)',
                background: filter === s ? 'var(--accent-dim)' : 'transparent',
                color: filter === s ? 'var(--accent)' : 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'all 0.15s',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                {s}
              </button>
            ))}
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company or role..."
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              padding: '8px 14px',
              fontSize: '13px',
              fontFamily: 'var(--font-mono)',
              outline: 'none',
              width: '220px',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Count */}
        <div style={{
          fontSize: '11px', color: 'var(--text-muted)',
          marginBottom: '12px', letterSpacing: '0.05em',
        }}>
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '16px 20px',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: 'var(--radius-lg)',
            color: '#ef4444',
            fontSize: '13px',
            marginBottom: '24px',
          }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{
            textAlign: 'center', padding: '80px',
            color: 'var(--text-muted)', fontSize: '13px',
          }}>
            <div style={{ animation: 'pulse 1.5s ease infinite', marginBottom: '8px' }}>●●●</div>
            Loading...
          </div>
        ) : (
          <ApplicationTable
            applications={filtered}
            onEdit={app => setModal(app)}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Modal */}
      {modal !== null && (
        <ApplicationModal
          app={modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
