const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api'

async function req(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'Request failed')
  }
  return res.status === 204 ? null : res.json()
}

// Plans
export const getPlans = () => req('/plans')
export const adminUpdatePlan = (id, body) => req(`/admin/plans/${id}`, { method: 'PUT', body: JSON.stringify(body) })

// Tiers
export const getTiers = () => req('/tiers')
export const adminUpdateBenefit = (id, body) => req(`/admin/benefits/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const adminUpdateTier = (id, body) => req(`/admin/tiers/${id}`, { method: 'PUT', body: JSON.stringify(body) })

// Users
export const getUsers = () => req('/admin/users')
export const getUserById = (id) => req(`/users/${id}`)
export const createUser = (body) => req('/users', { method: 'POST', body: JSON.stringify(body) })
export const getRecommendedTier = (id) => req(`/users/${id}/recommended-tier`)
export const adminUpdateUserStats = (id, body) => req(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) })

// Subscriptions
export const getActiveSubscription = (userId) => req(`/subscriptions/users/${userId}`)
export const getSubscriptionHistory = (userId) => req(`/subscriptions/users/${userId}/history`)
export const subscribe = (body) => req('/subscriptions', { method: 'POST', body: JSON.stringify(body) })
export const changeTier = (id, body) => req(`/subscriptions/${id}/tier`, { method: 'PUT', body: JSON.stringify(body) })
export const cancelSubscription = (id) => req(`/subscriptions/${id}`, { method: 'DELETE' })
