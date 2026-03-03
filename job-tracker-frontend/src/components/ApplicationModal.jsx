import React, { useState, useEffect } from 'react'

const STATUSES = ['APPLIED', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN']

const inputStyle = {
  width: '100%',
  background: 'var(--bg-secondary)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--text-primary)',
  padding: '10px 14px',
  fontSize: '13px',
  fontFamily: 'var(--font-mono)',
  outline: 'none',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '6px',
}

export default function ApplicationModal({ app, onClose, onSave }) {
  const isEdit = !!app?.id

  const [form, setForm] = useState({
    companyName: '',
    jobTitle: '',
    status: 'APPLIED',
    notes: '',
    jobUrl: '',
    appliedDate: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (app) {
      setForm({
        companyName: app.companyName || '',
        jobTitle: app.jobTitle || '',
        status: app.status || 'APPLIED',
        notes: app.notes || '',
        jobUrl: app.jobUrl || '',
        appliedDate: app.appliedDate || new Date().toISOString().split('T')[0],
      })
    }
  }, [app])

  const handleSubmit = async () => {
    if (!form.companyName.trim() || !form.jobTitle.trim()) {
      setError('Company name and job title are required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await onSave(form)
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100,
      padding: '20px',
      animation: 'fadeIn 0.2s ease',
    }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        width: '100%',
        maxWidth: '520px',
        boxShadow: 'var(--shadow)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '700' }}>
            {isEdit ? 'Edit Application' : 'New Application'}
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            cursor: 'pointer', fontSize: '20px', lineHeight: 1,
            padding: '4px', borderRadius: '4px',
          }}>✕</button>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Company *</label>
              <input style={inputStyle} value={form.companyName} onChange={set('companyName')}
                placeholder="e.g. Google"
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={labelStyle}>Job Title *</label>
              <input style={inputStyle} value={form.jobTitle} onChange={set('jobTitle')}
                placeholder="e.g. Java Developer"
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.status} onChange={set('status')}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Applied Date</label>
              <input type="date" style={inputStyle} value={form.appliedDate} onChange={set('appliedDate')}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Job URL</label>
            <input style={inputStyle} value={form.jobUrl} onChange={set('jobUrl')}
              placeholder="https://..."
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div>
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
              value={form.notes} onChange={set('notes')}
              placeholder="Referral, recruiter name, anything useful..."
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {error && (
          <div style={{
            marginTop: '16px', padding: '10px 14px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius)', color: '#ef4444', fontSize: '13px',
          }}>
            {error}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '10px 20px', borderRadius: 'var(--radius)',
            border: '1px solid var(--border)', background: 'transparent',
            color: 'var(--text-secondary)', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '13px',
            transition: 'border-color 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--border-light)'; e.target.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{
            padding: '10px 24px', borderRadius: 'var(--radius)',
            border: 'none', background: 'var(--accent)',
            color: '#0a0a0f', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '500',
            opacity: loading ? 0.7 : 1,
            transition: 'background 0.2s, transform 0.1s',
          }}
            onMouseEnter={e => !loading && (e.target.style.background = 'var(--accent-hover)')}
            onMouseLeave={e => (e.target.style.background = 'var(--accent)')}
          >
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Application'}
          </button>
        </div>
      </div>
    </div>
  )
}
