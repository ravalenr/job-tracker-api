const BASE_URL = 'https://job-tracker-api-ouah.onrender.com/api/applications'

export const api = {
  getAll: async () => {
    const res = await fetch(BASE_URL)
    if (!res.ok) throw new Error('Failed to fetch applications')
    return res.json()
  },

  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`)
    if (!res.ok) throw new Error('Application not found')
    return res.json()
  },

  create: async (data) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to create application')
    }
    return res.json()
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to update application')
    }
    return res.json()
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Failed to delete application')
  },

  getStats: async () => {
    const res = await fetch(`${BASE_URL}/stats`)
    if (!res.ok) throw new Error('Failed to fetch stats')
    return res.json()
  },
}
