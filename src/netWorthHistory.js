// Illustrative month-end snapshots until a historical balance source is connected.
const sampleHistory = Array.from({ length: 57 }, (_, index) => ({
  date: new Date(Date.UTC(2022, index + 1, 0)),
  value: 0.82 + index * 0.018 + Math.sin(index * 0.65) * 0.045,
}))

export function buildTrendSeries(currentNetWorth, view) {
  const history = sampleHistory.map((point, index) => ({ ...point, value: index === sampleHistory.length - 1 ? currentNetWorth : point.value }))
  if (view === 'Monthly') return history.slice(-12)
  if (view === 'Quarterly') return history.filter((point) => point.date.getUTCMonth() % 3 === 2).slice(-8)
  if (view === 'Yearly') return history.filter((point, index) => point.date.getUTCMonth() === 11 || index === history.length - 1)
  return history
}

