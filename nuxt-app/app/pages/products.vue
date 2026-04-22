<script setup>
useHead({ title: 'Products' })

const subscriptionStore = useSubscriptionStore()
const router = useRouter()

const plans = [
  {
    id: 'team-annual',
    name: 'Team - Annual',
    monthlyPrice: '207.50',
    yearlyPrice: '2490',
    originalYearly: '2,988',
    savings: '498',
    features: [
      { text: 'Primary user + 2 free team members', sub: 'extra team members for $25/month' },
      { text: 'Save unlimited properties' },
      { text: '50,000 exports', sub: 'additional exports at $0.01 each' },
      { text: '1,000 free skip traces', sub: 'additional skip tracing at $0.08 each' },
      { text: 'Imports $0.01' },
      { text: 'FREE daily product trainings and support' },
      { text: 'Full suite of next-gen investing tools' },
      { text: 'Industry first AI powered comp tool' },
      { text: 'Includes dedicated support agent' }
    ]
  },
  {
    id: 'solo-annual',
    name: 'Solo - Annual',
    monthlyPrice: '99.00',
    yearlyPrice: '1188',
    originalYearly: '1,548',
    savings: '360',
    features: [
      { text: 'Primary user only' },
      { text: 'Save unlimited properties' },
      { text: '10,000 exports', sub: 'additional exports at $0.01 each' },
      { text: '500 free skip traces', sub: 'additional skip tracing at $0.08 each' },
      { text: 'Imports $0.01' },
      { text: 'FREE daily product trainings and support' },
      { text: 'Full suite of next-gen investing tools' }
    ]
  }
]

function choosePlan(plan) {
  subscriptionStore.selectPlan(plan)
  router.push('/checkout')
}
</script>

<template>
  <div class="products-page">
    <div class="products-header">
      <h1 class="products-title">Choose Your Plan</h1>
      <p class="products-subtitle">Start your 3-day free trial. Cancel anytime.</p>
    </div>

    <div class="plans-grid">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="plan-card"
        :class="{ 'plan-card--selected': subscriptionStore.selectedPlan?.id === plan.id }"
      >
        <div class="plan-accent-bar"></div>
        <h2 class="plan-name">{{ plan.name }}</h2>
        <p class="plan-trial-label">3-days free then:</p>
        <div class="plan-price">
          <span class="price-amount">${{ plan.monthlyPrice }}</span>
          <span class="price-period">/month</span>
        </div>
        <p class="plan-billing">
          billed yearly at
          <span class="price-original">${{ plan.originalYearly }}</span>
          ${{ plan.yearlyPrice }}
        </p>
        <div class="savings-badge">${{ plan.savings }} in savings</div>

        <ul class="features-list">
          <li v-for="feature in plan.features" :key="feature.text" class="feature-item">
            <span class="feature-icon">✦</span>
            <span>
              {{ feature.text }}
              <span v-if="feature.sub" class="feature-sub">({{ feature.sub }})</span>
            </span>
          </li>
        </ul>

        <button class="choose-btn" @click="choosePlan(plan)">
          Get Started
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #f7f8fa;
  padding: 48px 24px;
  font-family: 'Helvetica Neue', sans-serif;
}

.products-header {
  text-align: center;
  margin-bottom: 40px;
}

.products-title {
  font-size: 2rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 8px;
}

.products-subtitle {
  color: #666;
  font-size: 1rem;
}

.plans-grid {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;
}

.plan-card {
  background: #fff;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 28px 24px;
  width: 320px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.plan-card--selected {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
}

.plan-accent-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4caf50, #26a69a);
}

.plan-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #111;
  margin: 4px 0 12px;
}

.plan-trial-label {
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 4px;
}

.plan-price {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin-bottom: 6px;
}

.price-amount {
  font-size: 2.4rem;
  font-weight: 800;
  color: #111;
  line-height: 1;
}

.price-period {
  font-size: 0.9rem;
  color: #555;
}

.plan-billing {
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 10px;
}

.price-original {
  text-decoration: line-through;
  color: #aaa;
}

.savings-badge {
  display: inline-block;
  background: #e8f5e9;
  color: #2e7d32;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  margin-bottom: 18px;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.85rem;
  color: #333;
  line-height: 1.4;
}

.feature-icon {
  color: #4caf50;
  font-size: 0.7rem;
  margin-top: 3px;
  flex-shrink: 0;
}

.feature-sub {
  color: #888;
  font-size: 0.78rem;
}

.choose-btn {
  width: 100%;
  background: #4caf50;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 13px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.choose-btn:hover {
  background: #388e3c;
}
</style>
