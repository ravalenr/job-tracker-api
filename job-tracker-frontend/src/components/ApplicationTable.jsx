import React, { useState } from 'react'
import StatusBadge from './StatusBadge'

export default function ApplicationTable({ applications, onEdit, onDelete }) {
  const [deletingId, setDeletingId] = useState(null)
  const [hoveredRow, setHoveredRow] = useState(null)

  const handleDelete = async (id) => {
    if (!confirm('Delete this application?')) return
    setDeletingId(id)
    try {
      await onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (applications.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 20px',
        color: 'var(--text-muted)', fontSize: '14px',
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-card)',
      }}>
        <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          No applications yet
        </div>
        <div>Click "New Application" to get started</div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Company', 'Role', 'Status', 'Applied', 'Notes', ''].map(h => (
              <th key={h} style={{
                padding: '12px 16px', textAlign: 'left',
                fontSize: '10px', color: 'var(--text-muted)',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                fontWeight: '500', background: 'var(--bg-secondary)',
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {applications.map((app, i) => (
            <tr key={app.id}
              onMouseEnter={() => setHoveredRow(app.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                borderBottom: i < applications.length - 1 ? '1px solid var(--border)' : 'none',
                background: hoveredRow === app.id ? 'var(--bg-hover)' : 'transparent',
                transition: 'background 0.15s',
                animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
              }}
            >
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontWeight: '500', fontSize: '14px', color: 'var(--text-primary)' }}>
                  {app.companyName}
                </div>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  {app.jobTitle}
                </div>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <StatusBadge status={app.status} />
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {app.appliedDate || '—'}
                </div>
              </td>
              <td style={{ padding: '14px 16px', maxWidth: '200px' }}>
                <div style={{
                  fontSize: '12px', color: 'var(--text-muted)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {app.notes || '—'}
                </div>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                  {app.jobUrl && (
                    <a href={app.jobUrl} target="_blank" rel="noreferrer" style={{
                      padding: '5px 10px', borderRadius: '6px',
                      border: '1px solid var(--border)', background: 'transparent',
                      color: 'var(--text-muted)', fontSize: '11px',
                      textDecoration: 'none', transition: 'all 0.15s',
                      display: 'inline-flex', alignItems: 'center',
                    }}
                      onMouseEnter={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.color = 'var(--text-primary)' }}
                      onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)' }}
                    >
                      ↗
                    </a>
                  )}
                  <button onClick={() => onEdit(app)} style={{
                    padding: '5px 12px', borderRadius: '6px',
                    border: '1px solid var(--border)', background: 'transparent',
                    color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px',
                    fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)' }}
                    onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    disabled={deletingId === app.id}
                    style={{
                      padding: '5px 12px', borderRadius: '6px',
                      border: '1px solid var(--border)', background: 'transparent',
                      color: 'var(--text-muted)', cursor: 'pointer', fontSize: '11px',
                      fontFamily: 'var(--font-mono)', transition: 'all 0.15s',
                      opacity: deletingId === app.id ? 0.5 : 1,
                    }}
                    onMouseEnter={e => { e.target.style.borderColor = '#ef4444'; e.target.style.color = '#ef4444' }}
                    onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)' }}
                  >
                    {deletingId === app.id ? '...' : 'Del'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
