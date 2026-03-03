import React from 'react'

const statusStyles = {
  APPLIED:   { color: 'var(--status-applied)',   bg: 'var(--status-applied-bg)'   },
  INTERVIEW: { color: 'var(--status-interview)', bg: 'var(--status-interview-bg)' },
  OFFER:     { color: 'var(--status-offer)',     bg: 'var(--status-offer-bg)'     },
  REJECTED:  { color: 'var(--status-rejected)',  bg: 'var(--status-rejected-bg)'  },
  WITHDRAWN: { color: 'var(--status-withdrawn)', bg: 'var(--status-withdrawn-bg)' },
}

export default function StatusBadge({ status }) {
  const style = statusStyles[status] || statusStyles.APPLIED

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: '500',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      color: style.color,
      background: style.bg,
      border: `1px solid ${style.color}30`,
    }}>
      <span style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: style.color,
        flexShrink: 0,
      }} />
      {status}
    </span>
  )
}
