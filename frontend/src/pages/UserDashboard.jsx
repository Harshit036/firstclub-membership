import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import {
  getPlans, getTiers, getActiveSubscription,
  subscribe, changeTier, cancelSubscription, getRecommendedTier
} from '../api/client'

const TIER_STYLE = {
  SILVER: { badge: 'bg-gray-100 text-gray-700 border-gray-200', ring: 'ring-gray-300', dot: 'bg-gray-400' },
  GOLD:   { badge: 'bg-amber-100 text-amber-800 border-amber-200', ring: 'ring-amber-300', dot: 'bg-amber-400' },
  PLATINUM: { badge: 'bg-violet-100 text-violet-800 border-violet-200', ring: 'ring-violet-400', dot: 'bg-violet-500' },
}

const PLAN_FEATURES = {
  MONTHLY:   ['Flexible monthly billing', 'Full access to all benefits', 'Cancel anytime', 'Tier-based discounts'],
  QUARTERLY: ['Save vs monthly billing', '3-month commitment', 'Full access to all benefits', 'Tier-based discounts'],
  YEARLY:    ['Best value plan', 'Full year access', 'Priority support', 'Maximum tier discounts', 'Annual billing'],
}

function BenefitBadge({ benefit }) {
  if (!benefit.enabled) return null
  const label = benefit.benefitType === 'DISCOUNT'
    ? `${benefit.discountPercentage}% Discount`
    : benefit.benefitType.replace(/_/g, ' ')
  return (
    <span className="text-xs bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded-full font-medium">{label}</span>
  )
}

function PricingCard({ plan, tier, isSelected, onSelect }) {
  const isBestDeal = plan.planType === 'YEARLY'
  const effectivePrice = tier ? (plan.price * tier.priceMultiplier).toFixed(2) : plan.price.toFixed(2)
  const features = PLAN_FEATURES[plan.planType] || []

  return (
    <div
      onClick={onSelect}
      className={`relative flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer transition-all
        ${isSelected ? 'ring-2 ring-[#1b3a2d] shadow-lg scale-[1.02]' : 'border border-gray-200 hover:shadow-md hover:border-[#1b3a2d]/30'}`}
    >
      {isBestDeal && (
        <div className="bg-[#1b3a2d] text-white text-xs font-bold text-center py-1.5 tracking-widest uppercase">
          Best Deal
        </div>
      )}
      {!isBestDeal && <div className="h-[30px]" />}

      <div className="p-6 flex flex-col flex-1">
        {/* Plan name */}
        <div className="text-center mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{plan.planType}</p>
          {tier && (
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${TIER_STYLE[tier.tierType]?.badge}`}>
              {tier.tierType} tier
            </span>
          )}
        </div>

        {/* Price */}
        <div className="text-center mb-4">
          <div className="flex items-start justify-center gap-0.5">
            <span className="text-lg font-bold text-[#1b3a2d] mt-2">₹</span>
            <span className="text-5xl font-extrabold text-[#1b3a2d] leading-none">
              {effectivePrice.split('.')[0]}
            </span>
            <span className="text-xl font-bold text-[#1b3a2d] mt-2">.{effectivePrice.split('.')[1]}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">/ {plan.durationDays} days</p>
          {isBestDeal && (
            <p className="text-xs text-orange-600 font-semibold mt-1 bg-orange-50 inline-block px-2 py-0.5 rounded-full">
              Best value
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 text-center mb-5">{plan.description}</p>

        {/* CTA */}
        <button
          className={`w-full py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors mb-5
            ${isSelected
              ? 'bg-[#1b3a2d] text-white'
              : isBestDeal
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-[#1b3a2d] hover:bg-[#152e23] text-white'
            }`}
        >
          {isSelected ? 'Selected ✓' : 'GET STARTED'}
        </button>

        {/* Divider */}
        <div className="border-t border-gray-100 mb-4" />

        {/* Features */}
        <ul className="space-y-2 flex-1">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
              <span className="text-green-600 font-bold mt-0.5 flex-shrink-0">✓</span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TierCard({ tier, isSelected, onSelect, currentSubscriptionTier }) {
  const style = TIER_STYLE[tier.tierType] || {}
  const isCurrent = currentSubscriptionTier?.id === tier.id

  return (
    <button
      onClick={onSelect}
      disabled={isCurrent}
      className={`relative w-full text-left bg-white rounded-2xl p-5 border-2 transition-all
        ${isCurrent ? 'border-[#1b3a2d] cursor-default' :
          isSelected ? 'border-[#1b3a2d] shadow-md' :
          'border-gray-200 hover:border-[#1b3a2d]/40 hover:shadow-sm'}`}
    >
      {isCurrent && (
        <span className="absolute top-3 right-3 text-xs bg-[#1b3a2d] text-white px-2 py-0.5 rounded-full">Current</span>
      )}
      <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border mb-3 ${style.badge}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
        {tier.tierType}
      </div>
      <p className="text-xs text-gray-500 mb-3">{tier.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {tier.benefits.map(b => <BenefitBadge key={b.id} benefit={b} />)}
      </div>
    </button>
  )
}

export default function UserDashboard() {
  const { auth } = useAuth()
  const [plans, setPlans] = useState([])
  const [tiers, setTiers] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedTier, setSelectedTier] = useState(null)
  const [recommendedTier, setRecommendedTier] = useState(null)
  const [actionError, setActionError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [toast, setToast] = useState('')

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function loadData() {
    setLoading(true)
    try {
      const [p, t] = await Promise.all([getPlans(), getTiers()])
      setPlans(p)
      setTiers(t)
      try {
        const sub = await getActiveSubscription(auth.userId)
        setSubscription(sub)
      } catch {
        setSubscription(null)
      }
      try {
        const rec = await getRecommendedTier(auth.userId)
        setRecommendedTier(rec)
      } catch {
        setRecommendedTier(null)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  async function handleSubscribe() {
    if (!selectedPlan || !selectedTier) { setActionError('Please select a plan and tier'); return }
    setActionError('')
    setActionLoading(true)
    try {
      await subscribe({ userId: auth.userId, planId: selectedPlan, tierId: selectedTier })
      showToast('Subscribed successfully!')
      setSelectedPlan(null)
      setSelectedTier(null)
      await loadData()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleChangeTier(tierId) {
    setActionLoading(true)
    setActionError('')
    try {
      await changeTier(subscription.id, { tierId })
      showToast('Tier updated!')
      await loadData()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  async function handleCancel() {
    if (!confirm('Cancel your subscription?')) return
    setActionLoading(true)
    setActionError('')
    try {
      await cancelSubscription(subscription.id)
      showToast('Subscription cancelled.')
      await loadData()
    } catch (err) {
      setActionError(err.message)
    } finally {
      setActionLoading(false)
    }
  }

  const selectedPlanObj = plans.find(p => p.id === selectedPlan)
  const selectedTierObj = tiers.find(t => t.id === selectedTier)
  const previewPrice = selectedPlanObj && selectedTierObj
    ? (selectedPlanObj.price * selectedTierObj.priceMultiplier).toFixed(2)
    : null

  if (loading) return (
    <div className="min-h-screen bg-[#f0f5e8]">
      <Navbar />
      <div className="flex items-center justify-center h-64 text-[#1b3a2d]/40">Loading…</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f0f5e8]">
      <Navbar />

      {toast && (
        <div className="fixed top-4 right-4 bg-[#1b3a2d] text-white px-4 py-2 rounded-xl shadow-lg text-sm z-50 flex items-center gap-2">
          <span className="text-green-400">✓</span> {toast}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">

        {/* Active Subscription */}
        {subscription ? (
          <section>
            <h2 className="text-lg font-bold text-[#1b3a2d] mb-3">My Membership</h2>
            <div className="bg-white rounded-2xl border border-[#1b3a2d]/10 p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${TIER_STYLE[subscription.tier.tierType]?.badge}`}>
                      {subscription.tier.tierType}
                    </span>
                    <span className="text-sm text-gray-500">{subscription.plan.planType} Plan</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 font-medium">Active</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Expires: <span className="font-semibold text-[#1b3a2d]">{subscription.endDate}</span>
                    <span className="mx-1.5 text-gray-300">·</span>
                    <span className="text-orange-600 font-semibold">{subscription.daysRemaining} days left</span>
                    <span className="mx-1.5 text-gray-300">·</span>
                    <span className="text-2xl font-extrabold text-[#1b3a2d]">₹{Number(subscription.effectivePrice).toFixed(2)}</span>
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {subscription.tier.benefits.map(b => <BenefitBadge key={b.id} benefit={b} />)}
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="text-xs border border-red-200 text-red-500 hover:bg-red-50 px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel Plan
                </button>
              </div>

              {/* Change Tier */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-[#1b3a2d]/60 mb-2 uppercase tracking-wide">Change Tier</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {tiers.map(t => (
                    <TierCard
                      key={t.id}
                      tier={t}
                      isSelected={false}
                      currentSubscriptionTier={subscription.tier}
                      onSelect={() => handleChangeTier(t.id)}
                    />
                  ))}
                </div>
                {actionError && <p className="text-red-500 text-xs mt-2">{actionError}</p>}
              </div>
            </div>
          </section>
        ) : (
          <>
            {/* Recommended Tier Banner */}
            {recommendedTier && (
              <section>
                <div className={`rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 border
                  ${recommendedTier.recommendedTier === 'PLATINUM'
                    ? 'bg-violet-50 border-violet-200'
                    : recommendedTier.recommendedTier === 'GOLD'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-gray-50 border-gray-200'}`}
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Recommended for you</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-bold px-3 py-1 rounded-full border
                        ${TIER_STYLE[recommendedTier.recommendedTier]?.badge}`}>
                        {recommendedTier.recommendedTier} Tier
                      </span>
                      <span className="text-xs text-gray-500">Based on: {recommendedTier.reason}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {recommendedTier.orderCount} orders · ₹{Number(recommendedTier.monthlyOrderValue).toLocaleString()} monthly spend
                      {recommendedTier.cohort ? ` · ${recommendedTier.cohort} cohort` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const match = tiers.find(t => t.tierType === recommendedTier.recommendedTier)
                      if (match) setSelectedTier(match.id)
                    }}
                    className="text-sm font-bold bg-[#1b3a2d] text-white px-5 py-2 rounded-xl hover:bg-[#152e23] transition-colors flex-shrink-0"
                  >
                    Use This Tier →
                  </button>
                </div>
              </section>
            )}

            {/* Step 1: Choose Tier */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#1b3a2d] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</div>
                <h2 className="text-lg font-bold text-[#1b3a2d]">Choose Your Tier</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {tiers.map(tier => (
                  <TierCard
                    key={tier.id}
                    tier={tier}
                    isSelected={selectedTier === tier.id}
                    onSelect={() => setSelectedTier(tier.id)}
                  />
                ))}
              </div>
            </section>

            {/* Step 2: Choose Plan */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 rounded-full bg-[#1b3a2d] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</div>
                <h2 className="text-lg font-bold text-[#1b3a2d]">Choose Your Plan</h2>
                {selectedTierObj && (
                  <span className="text-xs text-gray-400">Prices shown for <span className={`font-bold ${TIER_STYLE[selectedTierObj.tierType]?.badge.split(' ').slice(1).join(' ')}`}>{selectedTierObj.tierType}</span> tier</span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {plans.map(plan => (
                  <PricingCard
                    key={plan.id}
                    plan={plan}
                    tier={selectedTierObj || null}
                    isSelected={selectedPlan === plan.id}
                    onSelect={() => setSelectedPlan(plan.id)}
                  />
                ))}
              </div>
            </section>

            {/* Subscribe CTA */}
            {(selectedPlan || selectedTier) && (
              <section className="sticky bottom-4">
                <div className="bg-[#1b3a2d] rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
                  <div>
                    {previewPrice ? (
                      <div className="text-white">
                        <span className="text-sm text-green-300">Total: </span>
                        <span className="text-2xl font-extrabold">₹{previewPrice}</span>
                        <span className="text-green-300/70 text-sm ml-1">/ {selectedPlanObj?.durationDays} days</span>
                      </div>
                    ) : (
                      <p className="text-green-300 text-sm">
                        {!selectedTier ? 'Select a tier to see pricing' : 'Select a plan to continue'}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {actionError && <p className="text-red-300 text-xs">{actionError}</p>}
                    <button
                      onClick={handleSubscribe}
                      disabled={!selectedPlan || !selectedTier || actionLoading}
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors"
                    >
                      {actionLoading ? 'Processing…' : 'Subscribe Now →'}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
