import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import NetWorthTrend from './NetWorthTrend.jsx'

export default function NetWorthTrendDialog({ netWorth, hidden, hasHistory = true, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    dialog.showModal()
    return () => dialog.close()
  }, [])

  return <dialog ref={ref} className="networth-chart-dialog" aria-labelledby="chart-dialog-title" onCancel={(event) => { event.preventDefault(); onClose() }} onClick={(event) => {
    if (event.target !== event.currentTarget) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose()
  }}>
    <div className="chart-dialog-heading"><div><span className="rail-kicker">NET WORTH HISTORY</span><h2 id="chart-dialog-title">Your net worth in detail</h2></div><button autoFocus className="close-button" aria-label="Close net worth details" onClick={onClose}><X size={19} /></button></div>
    <NetWorthTrend netWorth={netWorth} hidden={hidden} hasHistory={hasHistory} />
  </dialog>
}
