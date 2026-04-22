// server/api/subscription/plan.get.ts

export default defineEventHandler(async () => {
  // Replace this with your real DB/API logic
  return {
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
  }
})
