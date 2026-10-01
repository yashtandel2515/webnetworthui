import { useState } from 'react'
import { buildTrendSeries } from './netWorthHistory.js'

const views = ['Monthly', 'Quarterly', 'Yearly', 'Lifetime']
const money = (crores) => `${crores < 0 ? '− ' : ''}₹${Math.round(Math.abs(crores) * 10000000).toLocaleString('en-IN')}`
const shortMoney = (crores) => `${crores < 0 ? '−' : ''}₹${Math.abs(crores) >= 1 ? `${Math.abs(crores).toFixed(2)} Cr` : `${(Math.abs(crores) * 100).toFixed(1)} L`}`

function pointLabel(point, view) {
  const year = point.date.getUTCFullYear()
  if (view === 'Quarterly') return `Q${Math.floor(point.date.getUTCMonth() / 3) + 1} ${year}`
  if (view === 'Yearly') return `${year}${point.date.getUTCMonth() !== 11 ? ' YTD' : ''}`
  return point.date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit', timeZone: 'UTC' })
}

export default function NetWorthTrend({ netWorth, hidden }) {
  const [view, setView] = useState('Monthly')
  const [selected, setSelected] = useState(null)
  const points = buildTrendSeries(netWorth, view)
  const activeIndex = Math.min(selected ?? points.length - 1, points.length - 1)
  const active = points[activeIndex]
  const first = points[0].value
  const change = points[points.length - 1].value - first
  const percent = first ? change / Math.abs(first) * 100 : null
  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const padding = Math.max((max - min) * 0.18, 0.02)
  const low = min - padding
  const high = max + padding
  const x = (index) => 70 + index / (points.length - 1) * 546
  const y = (value) => 24 + (high - value) / (high - low) * 170
  const path = points.map((point, index) => `${index ? 'L' : 'M'} ${x(index)} ${y(point.value)}`).join(' ')
  const labelStep = Math.ceil((points.length - 1) / 5)
  const selectByPointer = (event) => {
    const box = event.currentTarget.getBoundingClientRect()
    const position = ((event.clientX - box.left) / box.width * 640 - 70) / 546
    setSelected(Math.max(0, Math.min(points.length - 1, Math.round(position * (points.length - 1)))))
  }

  return <section className="networth-trend" aria-labelledby="networth-trend-title">
    <div className="trend-heading"><div><h2 id="networth-trend-title">Net worth over time</h2><p>{view === 'Monthly' ? 'Month-end balances · last 12 months' : view === 'Quarterly' ? 'Quarter-end balances · last 8 quarters' : view === 'Yearly' ? 'Year-end balances · current year to date' : 'All available monthly balances'}</p></div><div className="trend-views" role="group" aria-label="Net worth chart period">{views.map((item) => <button key={item} aria-pressed={view === item} onClick={() => { setView(item); setSelected(null) }}>{item}</button>)}</div></div>
    {hidden ? <div className="trend-hidden">Net worth history is hidden. Show amounts to view the graph.</div> : <>
      <div className="trend-summary"><div><span>{pointLabel(active, view)}{activeIndex === points.length - 1 ? ' · Current' : ''}</span><strong>{money(active.value)}</strong></div><div className={change >= 0 ? 'positive' : 'negative'}><strong>{change >= 0 ? '+' : '−'} {money(Math.abs(change))}{percent !== null ? ` (${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%)` : ''}</strong><small>Change over displayed period</small></div></div>
      <svg className="trend-graph" viewBox="0 0 640 232" role="img" aria-label={`${view} net worth, from ${money(first)} to ${money(netWorth)}. Sample history with current balance as the latest point.`} onPointerMove={selectByPointer} onPointerDown={selectByPointer} onPointerLeave={() => setSelected(null)}>
        <defs><linearGradient id="networth-trend-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8046e8" stopOpacity=".2" /><stop offset="100%" stopColor="#8046e8" stopOpacity=".01" /></linearGradient></defs>
        {[0, 1, 2, 3].map((index) => { const value = low + (high - low) * index / 3; return <g key={index}><line x1="70" x2="616" y1={y(value)} y2={y(value)} stroke="#eeeaf5" strokeDasharray="4 5" /><text x="58" y={y(value) + 4} textAnchor="end">{shortMoney(value)}</text></g> })}
        <path d={`${path} L 616 194 L 70 194 Z`} fill="url(#networth-trend-fill)" />
        <path d={path} fill="none" stroke="#793ce0" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        <line x1={x(activeIndex)} x2={x(activeIndex)} y1="24" y2="194" stroke="#b99ae9" strokeDasharray="4 4" />
        <circle cx={x(activeIndex)} cy={y(active.value)} r="5" fill="#793ce0" stroke="white" strokeWidth="2" />
        {points.map((point, index) => index % labelStep === 0 || index === points.length - 1 ? <text key={index} x={x(index)} y="221" textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}>{pointLabel(point, view)}</text> : null)}
      </svg>
      <label className="trend-scrubber"><span>Explore balances</span><input type="range" min="0" max={points.length - 1} value={activeIndex} onChange={(event) => setSelected(Number(event.target.value))} aria-label="Select a net worth snapshot" aria-valuetext={`${pointLabel(active, view)}: ${money(active.value)}`} /></label>
    </>}
    <p className="trend-data-note">Sample history · latest point reflects current net worth.</p>
  </section>
}
