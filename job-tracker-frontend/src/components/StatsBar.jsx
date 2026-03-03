import React from 'react'

const statConfig = [
  { key: 'TOTAL', label: 'Total', color: '#f0a500' },
  { key: 'APPLIED', label: 'Applied', color: '#3b82f6' },
  { key: 'INTERVIEW', label: 'Interview', color: '#a855f7' },
  { key: 'OFFER', label: 'Offer', color: '#22c55e' },
  { key: 'REJECTED', label: 'Rejected', color: '#ef4444' },
]

export default function StatsBar({ stats }) {
  if (!stats) return null

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '12px',
      marginBottom: '32px',
    }}>
      {statConfig.map(({ key, label, color }, i) => (
        <div key={key} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          animation: `fadeIn 0.3s ease ${i * 0.05}s both`,
          transition: 'border-color 0.2s, transform 0.2s',
          cursor: 'default',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = color
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <div style={{
            fontSize: '28px',
            fontWeight: '700',
            fontFamily: 'var(--font-display)',
            color,
            lineHeight: 1,
            marginBottom: '6px',
          }}>
            {stats[key] ?? 0}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}
