import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { getPlans, getTiers, getUsers, adminUpdatePlan, adminUpdateBenefit, adminUpdateTier, adminUpdateUserStats, getRecommendedTier } from '../api/client'

function Toast({ message }) {
  if (!message) return null
  return (
    <div className="fixed top-4 right-4 bg-[#1b3a2d] text-white px-4 py-2 rounded-xl shadow-lg text-sm z-50 flex items-center gap-2">
      <span className="text-green-400">✓</span> {message}
    </div>
  )
}

function EditableField({ value, onSave, prefix = '', suffix = '', width = 'w-24' }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)

  function handleSave() {
    onSave(parseFloat(val))
    setEditing(false)
  }

  if (editing) return (
    <span className="inline-flex items-center gap-1.5">
      {prefix && <span className="text-sm text-gray-500">{prefix}</span>}
      <input
        type="number"
        step="0.01"
        value={val}
        onChange={e => setVal(e.target.value)}
        className={`${width} border border-[#1b3a2d]/30 rounded-lg px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b3a2d]/30`}
        autoFocus
        onKeyDown={e => e.key === 'Enter' && handleSave()}
      />
      {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
      <button onClick={handleSave} className="text-xs bg-[#1b3a2d] text-white px-2.5 py-0.5 rounded-lg hover:bg-[#152e23]">Save</button>
      <button onClick={() => { setVal(value); setEditing(false) }} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
    </span>
  )

  return (
    <span
      onClick={() => setEditing(true)}
      className="cursor-pointer text-[#1b3a2d] font-semibold hover:text-orange-600 border-b border-dashed border-[#1b3a2d]/20 hover:border-orange-400 transition-colors"
      title="Click to edit"
    >
      {prefix}{Number(value).toFixed(2)}{suffix}
    </span>
  )
}

const TIER_BADGE = {
  SILVER:   'bg-gray-100 text-gray-700 border-gray-200',
  GOLD:     'bg-amber-100 text-amber-800 border-amber-200',
  PLATINUM: 'bg-violet-100 text-violet-800 border-violet-200',
}

export default function AdminPanel() {
  const [plans, setPlans] = useState([])
  const [tiers, setTiers] = useState([])
  const [users, setUsers] = useState([])
  const [recommendedTiers, setRecommendedTiers] = useState({})
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState('plans')

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function loadData() {
    setLoading(true)
    try {
      const [p, t, u] = await Promise.all([getPlans(), getTiers(), getUsers()])
      setPlans(p)
      setTiers(t)
      setUsers(u)
      const recMap = {}
      await Promise.all(u.map(async user => {
        try {
          recMap[user.id] = await getRecommendedTier(user.id)
        } catch { /* ignore */ }
      }))
      setRecommendedTiers(recMap)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  async function handleUpdatePrice(planId, price) {
    try {
      const updated = await adminUpdatePlan(planId, { price })
      setPlans(prev => prev.map(p => p.id === planId ? updated : p))
      showToast(`Plan price updated to ₹${price}`)
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleToggleBenefit(benefit, tierId) {
    try {
      const updated = await adminUpdateBenefit(benefit.id, {
        enabled: !benefit.enabled,
        discountPercentage: benefit.discountPercentage,
      })
      setTiers(prev => prev.map(t => t.id === tierId
        ? { ...t, benefits: t.benefits.map(b => b.id === benefit.id ? updated : b) }
        : t
      ))
      showToast(`Benefit ${updated.enabled ? 'enabled' : 'disabled'}`)
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleUpdateDiscount(benefit, tierId, discountPercentage) {
    try {
      const updated = await adminUpdateBenefit(benefit.id, { enabled: benefit.enabled, discountPercentage })
      setTiers(prev => prev.map(t => t.id === tierId
        ? { ...t, benefits: t.benefits.map(b => b.id === benefit.id ? updated : b) }
        : t
      ))
      showToast(`Discount updated to ${discountPercentage}%`)
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleUpdateUserStats(userId, field, value) {
    try {
      const updated = await adminUpdateUserStats(userId, { [field]: value })
      setUsers(prev => prev.map(u => u.id === userId ? updated : u))
      const rec = await getRecommendedTier(userId)
      setRecommendedTiers(prev => ({ ...prev, [userId]: rec }))
      showToast(`Updated — recommended tier: ${rec.recommendedTier}`)
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleUpdateMultiplier(tierId, priceMultiplier) {
    try {
      const updated = await adminUpdateTier(tierId, { priceMultiplier })
      setTiers(prev => prev.map(t => t.id === tierId ? { ...t, priceMultiplier: updated.priceMultiplier } : t))
      showToast(`Multiplier updated to ${priceMultiplier}×`)
    } catch (err) {
      alert(err.message)
    }
  }

  const tabs = [
    { key: 'plans', label: 'Plans & Pricing' },
    { key: 'tiers', label: 'Tier Multipliers' },
    { key: 'benefits', label: 'Benefits' },
    { key: 'users', label: 'Users' },
  ]

  return (
    <div className="min-h-screen bg-[#f0f5e8]">
      <Navbar />
      <Toast message={toast} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-[#1b3a2d]">Admin Panel</h1>
            <p className="text-xs text-[#1b3a2d]/50 mt-0.5">Manage plans, tiers, and member benefits</p>
          </div>
          <button onClick={loadData} className="text-xs text-[#1b3a2d]/60 hover:text-[#1b3a2d] border border-[#1b3a2d]/20 hover:border-[#1b3a2d]/40 px-3 py-1.5 rounded-lg transition-colors">
            ↻ Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-[#1b3a2d]/5 rounded-xl p-1 w-fit border border-[#1b3a2d]/10">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${activeTab === tab.key
                  ? 'bg-[#1b3a2d] text-white shadow-sm'
                  : 'text-[#1b3a2d]/60 hover:text-[#1b3a2d]'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16 text-[#1b3a2d]/30">Loading…</div>
        ) : (
          <>
            {/* Plans Tab */}
            {activeTab === 'plans' && (
              <div className="bg-white rounded-2xl border border-[#1b3a2d]/10 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-[#1b3a2d]">Plans & Pricing</p>
                  <p className="text-xs text-gray-400 mt-0.5">Click any price to edit inline</p>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-[#f0f5e8]">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Plan</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Duration</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Base Price</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {plans.map(plan => (
                      <tr key={plan.id} className="hover:bg-[#f0f5e8]/50 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-bold text-[#1b3a2d]">{plan.planType}</span>
                        </td>
                        <td className="px-5 py-4 text-gray-500">{plan.durationDays} days</td>
                        <td className="px-5 py-4">
                          <EditableField value={plan.price} onSave={price => handleUpdatePrice(plan.id, price)} prefix="₹" />
                        </td>
                        <td className="px-5 py-4 text-gray-400 text-xs">{plan.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tier Multipliers Tab */}
            {activeTab === 'tiers' && (
              <div className="bg-white rounded-2xl border border-[#1b3a2d]/10 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-[#1b3a2d]">Tier Price Multipliers</p>
                  <p className="text-xs text-gray-400 mt-0.5">Effective price = base plan price × tier multiplier</p>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-[#f0f5e8]">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Tier</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Multiplier</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Effective prices across plans</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {tiers.map(tier => (
                      <tr key={tier.id} className="hover:bg-[#f0f5e8]/50 transition-colors">
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${TIER_BADGE[tier.tierType]}`}>
                            {tier.tierType}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <EditableField value={tier.priceMultiplier} onSave={v => handleUpdateMultiplier(tier.id, v)} suffix="×" width="w-20" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-4">
                            {plans.map(plan => (
                              <div key={plan.id} className="text-xs">
                                <span className="text-gray-400">{plan.planType}: </span>
                                <span className="font-bold text-[#1b3a2d]">₹{(plan.price * tier.priceMultiplier).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <div className="space-y-4">
                {tiers.map(tier => (
                  <div key={tier.id} className="bg-white rounded-2xl border border-[#1b3a2d]/10 shadow-sm overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 bg-[#f0f5e8]/50">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${TIER_BADGE[tier.tierType]}`}>
                        {tier.tierType}
                      </span>
                      <span className="text-sm text-gray-500">{tier.description}</span>
                    </div>
                    <table className="w-full text-sm">
                      <thead className="bg-[#f0f5e8]/30">
                        <tr>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Benefit</th>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Value</th>
                          <th className="text-left px-5 py-2.5 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Toggle</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {tier.benefits.map(benefit => (
                          <tr key={benefit.id} className="hover:bg-[#f0f5e8]/40 transition-colors">
                            <td className="px-5 py-3.5 font-medium text-[#1b3a2d]">
                              {benefit.benefitType.replace(/_/g, ' ')}
                            </td>
                            <td className="px-5 py-3.5">
                              {benefit.benefitType === 'DISCOUNT' && benefit.discountPercentage != null ? (
                                <EditableField
                                  value={benefit.discountPercentage}
                                  onSave={v => handleUpdateDiscount(benefit, tier.id, v)}
                                  suffix="%"
                                  width="w-16"
                                />
                              ) : benefit.enabled ? (
                                <span className="text-xs text-green-700 font-medium">Active</span>
                              ) : (
                                <span className="text-xs text-gray-400">Disabled</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              <button
                                onClick={() => handleToggleBenefit(benefit, tier.id)}
                                className={`relative inline-flex h-5 w-9 rounded-full transition-colors focus:outline-none
                                  ${benefit.enabled ? 'bg-[#1b3a2d]' : 'bg-gray-200'}`}
                              >
                                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5
                                  ${benefit.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl border border-[#1b3a2d]/10 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <p className="text-sm font-semibold text-[#1b3a2d]">Registered Members</p>
                  <p className="text-xs text-gray-400 mt-0.5">Edit order count or monthly spend to simulate tier promotion</p>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-[#f0f5e8]">
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Name</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Cohort</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Orders</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Monthly Spend</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-[#1b3a2d]/60 uppercase tracking-wide">Recommended Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(user => {
                      const rec = recommendedTiers[user.id]
                      return (
                        <tr key={user.id} className="hover:bg-[#f0f5e8]/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <p className="font-semibold text-[#1b3a2d]">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                              {user.cohort || '—'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <EditableField
                              value={user.orderCount}
                              onSave={v => handleUpdateUserStats(user.id, 'orderCount', Math.round(v))}
                              width="w-16"
                            />
                          </td>
                          <td className="px-5 py-3.5">
                            <EditableField
                              value={user.monthlyOrderValue}
                              onSave={v => handleUpdateUserStats(user.id, 'monthlyOrderValue', v)}
                              prefix="₹"
                              width="w-24"
                            />
                          </td>
                          <td className="px-5 py-3.5">
                            {rec ? (
                              <div>
                                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${TIER_BADGE[rec.recommendedTier]}`}>
                                  {rec.recommendedTier}
                                </span>
                                <p className="text-xs text-gray-400 mt-1 max-w-xs">{rec.reason}</p>
                              </div>
                            ) : <span className="text-xs text-gray-300">—</span>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
