import { useMemo, useRef, useState } from 'react'
import {
  Activity, ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUpRight,
  Bell, BriefcaseBusiness, Building2, Check, CheckCircle2, ChevronDown, ChevronRight,
  Clock3, CloudUpload, Coins, CreditCard, FileCheck2, FileText, Filter, Home,
  Landmark, Link2, LockKeyhole, MoreHorizontal, Plus, RefreshCw, Search,
  Shield, ShieldCheck, Sparkles, Upload, X,
} from 'lucide-react'
import './index.css'
import { fetchGoldQuote, goldValue, isUsableGoldQuote } from './goldPrice.js'
import NetWorthTrend from './NetWorthTrend.jsx'
import NetWorthTrendDialog from './NetWorthTrendDialog.jsx'

const client = { name: 'Amol Surve', crn: 'LST065', relationshipOwner: 'Nisha Sharma' }
const initialAssets = [
  { id: 'a1', category: 'Real estate', label: '2 properties', value: 1.55, date: '2 Jun', source: 'Partner-entered', tone: 'plum', icon: Home },
  { id: 'a2', category: 'Gold', label: '5 items', value: 0.287, date: '4 Sep', source: 'Partner-entered', tone: 'gold', icon: Coins },
  { id: 'a3', category: 'AIF / PMS', label: '1 fund', value: 0.274, date: '31 Aug', source: 'Portfolio statement', tone: 'blue', icon: BriefcaseBusiness },
  { id: 'a4', category: 'Mutual funds', label: '5 holdings', value: 0.1122204, date: 'yesterday 11:00 pm', source: 'CAMS · KFintech', tone: 'green', icon: Activity },
  { id: 'a5', category: 'Stocks', label: '5 stocks', value: 0.0746861, date: '9:00 am today', source: 'Zerodha · NSDL', tone: 'mint', icon: ArrowUpRight },
  { id: 'a6', category: 'Insurance', label: '3 policies', value: 0.065, date: '23 Aug', source: 'Client documents', tone: 'blue', icon: ShieldCheck },
  { id: 'a7', category: 'Fixed & recurring deposits', label: '2 deposits', value: 0.0646, date: '9:00 am today', source: 'Account Aggregator', tone: 'gold', icon: Landmark },
  { id: 'a8', category: 'PPF', label: '1 account', value: 0.0639, date: '31 Jul', source: 'Partner-entered', tone: 'mint', icon: Landmark },
  { id: 'a9', category: 'Bank accounts', label: '2 accounts', value: 0.0603, date: '9:00 am today', source: 'Account Aggregator', tone: 'green', icon: Landmark },
  { id: 'a10', category: 'NPS', label: '1 account', value: 0.0331, date: '9:00 am today', source: 'NPS CRA', tone: 'plum', icon: Shield },
  { id: 'a11', category: 'EPF', label: '1 account', value: 0.013976, date: '15 Aug', source: 'EPFO passbook', tone: 'blue', icon: BriefcaseBusiness },
  { id: 'a12', category: 'Vehicles', label: '1 vehicle', value: 0.01, date: '30 Aug', source: 'Partner-entered', tone: 'mint', icon: Building2 },
]
const initialLiabilities = [
  { id: 'l1', category: 'Home loan', label: 'HDFC home loan', value: 0.684, date: '12 Sep', source: 'HDFC Bank', tone: 'rose', icon: Home },
  { id: 'l2', category: 'Credit card', label: 'Card outstanding', value: 0.04482, date: '28 Sep', source: 'Partner-entered', tone: 'rose', icon: CreditCard },
]

const initialFunds = [
  { id: 'mf1', name: 'Parag Parikh Flexi Cap Fund Direct Growth', folio: '1299••8812', current: 101894, invested: 92000, day: 480, xirr: 7.4, source: 'CAMS RTA', heldWith: 'Internal', verdict: 'Outperforming', category: 'Flexi Cap', transactions: [{ date: '05 Aug 2026', type: 'SIP', amount: 25000, units: 211.4 }, { date: '05 Jul 2026', type: 'SIP', amount: 25000, units: 215.8 }] },
  { id: 'mf2', name: 'HDFC Mid Cap Opportunities Fund Direct Growth', folio: '9107••3390', current: 108799, invested: 95000, day: -340, xirr: 8.1, source: 'CAMS RTA', heldWith: 'External', verdict: 'Underperforming', category: 'Mid Cap', transactions: [{ date: '20 Jun 2026', type: 'Lumpsum', amount: 45000, units: 252.4 }] },
  { id: 'mf3', name: 'SBI Liquid Fund Direct Growth', folio: '9107••3390', current: 367761, invested: 350000, day: 74, xirr: 6.2, source: 'CAMS RTA', heldWith: 'External', verdict: 'On par', category: 'Liquid', transactions: [{ date: '12 Jan 2026', type: 'Lumpsum', amount: 350000, units: 88.1 }] },
  { id: 'mf4', name: 'Motilal Oswal Midcap Fund Direct Growth', folio: '5521••0074', current: 231250, invested: 198000, day: 612, xirr: 14.5, source: 'KFintech RTA', heldWith: 'Internal', verdict: 'Outperforming', category: 'Mid Cap', transactions: [{ date: '05 Aug 2026', type: 'SIP', amount: 25000, units: 238.7 }] },
  { id: 'mf5', name: 'Nippon India Small Cap Fund Regular Growth', folio: '4019••0197', current: 312500, invested: 260000, day: -346, xirr: 12.7, source: 'KFintech RTA', heldWith: 'External', verdict: 'Underperforming', category: 'Small Cap', transactions: [{ date: '05 Jul 2026', type: 'SIP', amount: 20000, units: 134.9 }] },
]

const initialStocks = [
  { id: 'st1', name: 'HDFC Bank', quantity: 120, average: 1420, price: 1512, day: 0.34, source: 'Zerodha', type: 'Stock' },
  { id: 'st2', name: 'Infosys', quantity: 80, average: 1480, price: 1560, day: -0.21, source: 'Zerodha', type: 'Stock' },
  { id: 'st3', name: 'TCS', quantity: 25, average: 10300, price: 11194.12, day: 0.48, source: 'NSDL', type: 'Stock' },
  { id: 'st4', name: 'Nippon India ETF Nifty 50', quantity: 400, average: 201, price: 214, day: 0.15, source: 'NSDL', type: 'ETF' },
  { id: 'st5', name: 'ITC', quantity: 174, average: 420, price: 432, day: -0.08, source: 'Zerodha', type: 'Stock' },
]

const initialPolicies = [
  { id: 'in1', name: 'HDFC Life Click 2 Wealth', insurer: 'HDFC Life', type: 'ULIP', policy: '•••• 8921', value: 425000, cover: 2500000, premium: 48000, frequency: 'Annual', renewal: '18 Sep 2026', source: 'Policy document', claim: 'No claim' },
  { id: 'in2', name: 'ICICI Pru iProtect Smart', insurer: 'ICICI Prudential', type: 'Term', policy: '•••• 3314', value: 0, cover: 5000000, premium: 21500, frequency: 'Annual', renewal: '02 Jan 2027', source: 'Partner-entered', claim: 'No claim' },
  { id: 'in3', name: 'Star Health Family Health Optima', insurer: 'Star Health', type: 'Health', healthCoverType: 'Family', policy: '•••• 1550', value: 225000, cover: 2000000, premium: 18000, frequency: 'Annual', renewal: '23 Aug 2026', source: 'Partner-entered', claim: 'No claim' },
]

const genericRecords = {
  'Real estate': [{ name: '2BHK, Baner, Pune', value: 1.2, date: '2 Jun', source: 'Partner-entered · unconfirmed', detail: 'Residential · 100% ownership' }, { name: 'Plot, Nashik', value: 0.35, date: '18 Sep', source: 'Partner-entered · unconfirmed', detail: 'Land · 100% ownership' }],
  Gold: [{ name: 'Family jewellery', value: 0.218, date: '4 Sep', source: 'Partner-entered · unconfirmed', detail: '22K · 160 g' }, { name: 'Diwali coins', value: 0.069, date: '4 Sep', source: 'Partner-entered · unconfirmed', detail: '24K · 40 g' }],
  'AIF / PMS': [{ name: 'ASK Emerging Opportunities PMS', value: 0.274, date: '31 Aug', source: 'Portfolio statement', detail: 'Statement dated 31 Aug 2026' }],
  'Fixed & recurring deposits': [{ name: 'HDFC fixed deposit ••9081', value: 0.0646, date: 'Today, 9:00 am', source: 'Account Aggregator', detail: '7.1% · maturity 12 Oct 2026' }],
  'Bank accounts': [{ name: 'HDFC Bank ••4412', value: 0.0482, date: 'Today, 9:00 am', source: 'Account Aggregator', detail: 'Savings account' }, { name: 'ICICI Bank ••7730', value: 0.0121, date: 'Today, 9:00 am', source: 'Account Aggregator', detail: 'Savings account' }],
  PPF: [{ name: 'PPF · SBI ••0455', value: 0.0639, date: '31 Jul', source: 'Partner-entered · unconfirmed', detail: '7.1% · maturity 2033' }],
  NPS: [{ name: 'NPS Tier I ••6274', value: 0.0331, date: 'Today, 9:00 am', source: 'NPS CRA', detail: '3 investment schemes' }],
  EPF: [{ name: 'EPF passbook', value: 0.013976, date: '15 Aug', source: 'EPFO passbook', detail: 'Last contribution 5 Aug 2026' }],
  Vehicles: [{ name: 'Honda City ZX', value: 0.01, date: '30 Aug', source: 'Partner-entered · unconfirmed', detail: '2022 · value estimate' }],
}

const institutions = [
  { id: 'cams', name: 'CAMS RTA', detail: 'CAMS-serviced mutual fund folios', icon: Activity, categories: ['Mutual funds'] },
  { id: 'kfin', name: 'KFintech RTA', detail: 'KFintech-serviced mutual fund folios', icon: Activity, categories: ['Mutual funds'] },
  { id: 'mfcentral', name: 'MF Central', detail: 'Consolidated mutual fund folios', icon: Landmark, categories: ['Mutual funds'] },
  { id: 'zerodha', name: 'Zerodha', detail: 'Broker holdings', icon: Activity, categories: ['Stocks'] },
  { id: 'groww', name: 'Groww', detail: 'Broker holdings', icon: Activity, categories: ['Stocks'] },
  { id: 'upstox', name: 'Upstox', detail: 'Broker holdings', icon: Activity, categories: ['Stocks'] },
  { id: 'nsdl', name: 'NSDL / CDSL', detail: 'Demat securities', icon: FileText, categories: ['Stocks'] },
  { id: 'hdfclife', name: 'HDFC Life', detail: 'Insurance policy details', icon: ShieldCheck, categories: ['Insurance'] },
  { id: 'icicipru', name: 'ICICI Prudential', detail: 'Insurance policy details', icon: ShieldCheck, categories: ['Insurance'] },
  { id: 'starhealth', name: 'Star Health', detail: 'Health insurance policy details', icon: ShieldCheck, categories: ['Insurance'] },
]

const uploadTypes = {
  'Mutual funds': 'CAS or RTA statement · PDF / Excel (.xlsx)',
  Stocks: 'Broker or demat statement · PDF / Excel (.xlsx)',
  Insurance: 'Policy schedule · PDF / Excel (.xlsx)',
  'Real estate': 'Property valuation / ownership document · PDF / Excel (.xlsx)',
  Gold: 'Purchase or valuation record · PDF / Excel (.xlsx)',
  'AIF / PMS': 'Latest portfolio statement · PDF / Excel (.xlsx)',
  'Home loan': 'Lender statement · PDF / Excel (.xlsx)',
  'Other liability': 'Latest lender statement · PDF / Excel (.xlsx)',
}
const documentSources = [{ id: 'client-doc', name: 'Client-provided document', detail: 'Uploaded by partner for this client' }]

const insuranceTypes = ['ULIP', 'Term', 'Health', 'Endowment', 'Money-back', 'Whole life', 'Motor', 'Travel', 'Personal accident']
const allowsManual = (name) => !['Mutual funds', 'Stocks'].includes(name)
const allowsSync = (name) => name !== 'Insurance'

const periods = ['Today', 'This week', 'This month', 'All time']
const addableCategories = ['Mutual funds', 'Stocks', 'Insurance', 'Real estate', 'Gold', 'Silver', 'AIF / PMS', 'Bank accounts', 'Fixed & recurring deposits', 'PPF', 'EPF', 'NPS', 'Vehicles', 'Other asset']
const periodChanges = { Today: '+ ₹1.13 L', 'This week': '+ ₹2.70 L', 'This month': '− ₹64,200', 'All time': '+ ₹18.4 L' }
const demoToday = new Date('2026-09-30T14:30:00+05:30')

const formatCr = (value) => Math.abs(Number(value)) >= 1 ? `₹${Math.abs(Number(value)).toFixed(2)} Cr` : `₹${(Math.abs(Number(value)) * 100).toFixed(2)} L`
const formatInr = (crores) => `₹${Math.round(Math.abs(Number(crores)) * 10000000).toLocaleString('en-IN')}`
const formatRupees = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`
const formatPercent = (value, total) => {
  const percentage = total ? (value / total) * 100 : 0
  return percentage > 0 && percentage < 1 ? '<1%' : `${Math.round(percentage)}%`
}

export function NetWorthWorkspace({ populated = true }) {
  const [storedAssets, setAssets] = useState(populated ? initialAssets : [])
  const [goldQuote, setGoldQuote] = useState(null)
  const [goldPriceStatus, setGoldPriceStatus] = useState('idle')
  const [liabilities, setLiabilities] = useState(populated ? initialLiabilities : [])
  const [extraRecords, setExtraRecords] = useState({})
  const [funds, setFunds] = useState(populated ? initialFunds : [])
  const [stocks, setStocks] = useState(populated ? initialStocks : [])
  const [policies, setPolicies] = useState(populated ? initialPolicies : [])
  const [modal, setModal] = useState(null)
  const [customAssetName, setCustomAssetName] = useState('')
  const [customCategories, setCustomCategories] = useState([])
  const [activity, setActivity] = useState([])
  const [toast, setToast] = useState('')
  const [hidden, setHidden] = useState(false)
  const [activeTab, setActiveTab] = useState('Net Worth')
  const [category, setCategory] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [period, setPeriod] = useState('Today')
  const [workflowCategory, setWorkflowCategory] = useState('Mutual funds')
  const [providerId, setProviderId] = useState('cams')
  const [selectedFipDetail, setSelectedFipDetail] = useState(null)
  const [connectedFips, setConnectedFips] = useState(populated ? ['cams', 'kfin', 'zerodha', 'nsdl'] : [])
  const [manualKind, setManualKind] = useState('asset')
  const [manualMeta, setManualMeta] = useState({ propertyType: 'Residential', address: '', lender: '', emi: '', rate: '', endDate: '', grams: '', purity: '22K', purchaseDate: '' })
  const [syncChannel, setSyncChannel] = useState('WhatsApp')
  const [syncRequests, setSyncRequests] = useState(populated ? [{ id: 'req-initial', fip: 'MF Central', category: 'Mutual funds', channel: 'WhatsApp', status: 'pending', date: '2026-09-30T10:42:00+05:30', displayDate: 'Sent today, 10:42 am' }] : [])
  const [requestsTab, setRequestsTab] = useState('Sent')
  const [requestFilter, setRequestFilter] = useState('All time')
  const [selectedRequestIds, setSelectedRequestIds] = useState([])
  const [fundFilter, setFundFilter] = useState('All')
  const [fundValueMode, setFundValueMode] = useState('Current')
  const [expanded, setExpanded] = useState(null)
  const [manual, setManual] = useState({ name: '', goldCategory: 'Jewellery', carat: '22', purchasePricePerGram: '', investmentPrice: '', investmentUnits: '', investmentDate: '', currentPrice: '', amount: '', date: '2026-09-30', owner: 'Amol Surve', share: '100', source: 'Partner estimate', folio: '', units: '', invested: '', ticker: '', quantity: '', average: '', insurer: '', policy: '', policyType: 'ULIP', brokerCode: '', maturity: '', premiumPayingDate: '', healthCoverType: 'Individual', vehicleNumber: '', destination: '', cover: '', premium: '', frequency: 'Annual', renewal: '', claim: 'No claim', lender: '', outstanding: '', emi: '', rate: '', endDate: '', fundHouse: '', plan: 'Direct', option: 'Growth', nav: '', insuredPerson: '', paidToDate: '', policyStart: '', address: '', purchaseDate: '', grams: '' })
  const [uploadFile, setUploadFile] = useState(null)
  const [reviewRows, setReviewRows] = useState([])
  const [reviewTab, setReviewTab] = useState('Client')
  const [reviewSearch, setReviewSearch] = useState('')
  const fileRef = useRef(null)
  const goldAdjustment = goldQuote ? (extraRecords.Gold || []).filter((record) => record.grams !== undefined).reduce((sum, record) => sum + goldValue(record.grams, record.carat, goldQuote.pricePerGram24k) / 10000000 - record.value, 0) : 0
  const assets = useMemo(() => storedAssets.map((item) => item.category === 'Gold' ? { ...item, value: item.value + goldAdjustment } : item), [storedAssets, goldAdjustment])
  const totalAssets = useMemo(() => assets.reduce((sum, item) => sum + item.value, 0), [assets])
  const totalLiabilities = useMemo(() => liabilities.reduce((sum, item) => sum + item.value, 0), [liabilities])
  const hasBalances = assets.length > 0 || liabilities.length > 0
  const netWorth = totalAssets - totalLiabilities
  const activeFips = institutions.filter((item) => item.categories.includes(workflowCategory))
  const pendingFips = syncRequests.filter((request) => request.status === 'pending').map((request) => institutions.find((item) => item.name === request.fip)?.id).filter(Boolean)
  const selectedFip = activeFips.find((item) => item.id === providerId) || activeFips[0] || documentSources[0]
  const availableCategories = [...addableCategories.filter((name) => name !== 'Other asset'), ...customCategories, 'Other asset']
  const focusAssets = assets.filter((item) => ['Mutual funds', 'Stocks', 'Insurance'].includes(item.category))
  const filteredAssets = category === 'All' ? focusAssets : focusAssets.filter((item) => item.category === category)
  const isCustomAsset = (name) => customCategories.includes(name)
  const selectedRows = reviewRows.filter((row) => row.selected && !row.excluded && row.owner === client.name)
  const visibleReviewRows = reviewRows.filter((row) => !row.excluded && (reviewTab === 'Client' ? row.owner === client.name : row.owner !== client.name) && `${row.name} ${row.owner} ${row.category}`.toLowerCase().includes(reviewSearch.toLowerCase()))
  const selectedValue = selectedRows.reduce((sum, row) => sum + row.value, 0)
  const visibleRequests = syncRequests.filter((request) => {
    if ((requestsTab === 'Sent' && request.status !== 'pending') || (requestsTab === 'Synced' && request.status !== 'synced')) return false
    if (requestFilter === 'All time') return true
    const requestDate = new Date(request.date)
    const today = demoToday
    if (requestFilter === 'Today') return requestDate.toDateString() === today.toDateString()
    if (requestFilter === 'This week') return today - requestDate <= 7 * 86400000
    return requestDate.getMonth() === today.getMonth() && requestDate.getFullYear() === today.getFullYear()
  })

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2500)
  }

  const updateCategoryValue = (categoryName, change) => {
    setAssets((current) => {
      const found = current.some((item) => item.category === categoryName)
      return found
        ? current.map((item) => {
            if (item.category !== categoryName) return item
            const match = item.label.match(/^(\d+)\s+(.*)$/)
            return { ...item, value: Math.max(0, item.value + change), label: `${Number(match?.[1] || 0) + 1} ${match?.[2] || 'holdings'}` }
          })
        : [...current, { id: `a-${Date.now()}`, category: categoryName, label: '1 holding', value: change, date: 'Today', source: 'Partner-entered', tone: 'plum', icon: Activity }]
    })
  }

  const openFlow = (nextCategory = 'Mutual funds', fip = null) => {
    if (nextCategory === 'Other asset') {
      setCustomAssetName('')
      setModal('custom-asset')
      return
    }
    if (isCustomAsset(nextCategory)) { startManual(nextCategory); return }
    setWorkflowCategory(nextCategory)
    const first = fip || institutions.find((item) => item.categories.includes(nextCategory))
    setProviderId(first?.id || documentSources[0].id)
    setModal('add-data')
  }

  const createCustomAsset = (event) => {
    event.preventDefault()
    const entered = customAssetName.trim().replace(/\s+/g, ' ')
    if (!entered || entered.toLowerCase() === 'other asset') return
    const existing = availableCategories.find((name) => name.toLowerCase() === entered.toLowerCase())
    const name = existing || entered
    if (!existing) setCustomCategories((current) => [...current, name])
    if (existing && !isCustomAsset(name)) openFlow(name)
    else startManual(name)
  }

  const recordActivity = (title, detail, categoryName = workflowCategory, fipId = selectedFip.id) => {
    setActivity((current) => [{ id: crypto.randomUUID(), title, detail, category: categoryName, providerId: fipId, date: new Date().toISOString() }, ...current])
  }

  const finishAddition = () => {
    setModal(null)
    setActiveTab('Net Worth')
    setSelectedFipDetail(null)
    setSelectedCategory(workflowCategory)
  }

  const startSync = (nextCategory = workflowCategory) => {
    if (isCustomAsset(nextCategory) || !allowsSync(nextCategory)) return
    setWorkflowCategory(nextCategory)
    const first = institutions.find((item) => item.id === providerId && item.categories.includes(nextCategory)) || institutions.find((item) => item.categories.includes(nextCategory))
    setProviderId(first?.id || documentSources[0].id)
    setModal('sync')
  }

  const startUpload = (nextCategory = workflowCategory) => {
    if (isCustomAsset(nextCategory)) return
    setWorkflowCategory(nextCategory)
    const first = institutions.find((item) => item.id === providerId && item.categories.includes(nextCategory)) || institutions.find((item) => item.categories.includes(nextCategory))
    setProviderId(first?.id || documentSources[0].id)
    setUploadFile(null)
    setModal('upload')
  }

  const loadGoldPrice = async () => {
    setGoldPriceStatus('loading')
    try {
      setGoldQuote(await fetchGoldQuote())
      setGoldPriceStatus('ready')
    } catch {
      setGoldPriceStatus('error')
    }
  }

  const startManual = (nextCategory = workflowCategory) => {
    if (!allowsManual(nextCategory)) return
    if (nextCategory === 'Gold') loadGoldPrice()
    setWorkflowCategory(nextCategory)
    const liability = ['Home loan', 'Car loan', 'Personal loan', 'Loan against securities', 'Overdraft', 'Credit card', 'Business loan', 'Tax payable', 'Other liability'].includes(nextCategory)
    setManualKind(liability ? 'liability' : 'asset')
    setManualMeta({ propertyType: 'Residential', address: '', lender: '', emi: '', rate: '', endDate: '', grams: '', purity: '22K', purchaseDate: '' })
    const first = institutions.find((item) => item.id === providerId && item.categories.includes(nextCategory)) || institutions.find((item) => item.categories.includes(nextCategory))
    setProviderId(first?.id || documentSources[0].id)
    setManual({ name: '', goldCategory: 'Jewellery', carat: '22', purchasePricePerGram: '', investmentPrice: '', investmentUnits: '', investmentDate: '', currentPrice: '', amount: '', date: '2026-09-30', owner: 'Amol Surve', share: '100', source: 'Partner estimate', folio: '', units: '', invested: '', ticker: '', quantity: '', average: '', insurer: '', policy: '', policyType: 'ULIP', brokerCode: '', maturity: '', premiumPayingDate: '', healthCoverType: 'Individual', vehicleNumber: '', destination: '', cover: '', premium: '', frequency: 'Annual', renewal: '', claim: 'No claim', lender: '', outstanding: '', emi: '', rate: '', endDate: '', fundHouse: '', plan: 'Direct', option: 'Growth', nav: '', insuredPerson: '', paidToDate: '', policyStart: '', address: '', purchaseDate: '', grams: '' })
    setModal('manual')
  }

  const openFipFlow = (fip, mode) => {
    if ((mode === 'manual' && !allowsManual(fip.categories[0])) || (mode === 'sync' && !allowsSync(fip.categories[0]))) return
    setWorkflowCategory(fip.categories[0])
    setProviderId(fip.id)
    if (mode === 'upload') setUploadFile(null)
    if (mode === 'manual') {
      setManualKind('asset')
      setManual({ name: '', goldCategory: 'Jewellery', carat: '22', purchasePricePerGram: '', investmentPrice: '', investmentUnits: '', investmentDate: '', currentPrice: '', amount: '', date: '2026-09-30', owner: 'Amol Surve', share: '100', source: 'Partner estimate', folio: '', units: '', invested: '', ticker: '', quantity: '', average: '', insurer: '', policy: '', policyType: 'ULIP', brokerCode: '', maturity: '', premiumPayingDate: '', healthCoverType: 'Individual', vehicleNumber: '', destination: '', cover: '', premium: '', frequency: 'Annual', renewal: '', claim: 'No claim', lender: '', outstanding: '', emi: '', rate: '', endDate: '', fundHouse: '', plan: 'Direct', option: 'Growth', nav: '', insuredPerson: '', paidToDate: '', policyStart: '' })
    }
    setModal(mode)
  }

  const openFipDetail = (fip) => {
    setSelectedFipDetail(fip)
    setSelectedCategory(null)
  }

  const sendSyncRequest = () => {
    if (!allowsSync(workflowCategory)) return
    setSyncRequests((current) => [{ id: `req-${Date.now()}`, fip: selectedFip.name, category: workflowCategory, channel: syncChannel, status: 'pending', date: demoToday.toISOString(), displayDate: 'Sent just now' }, ...current])
    recordActivity('Sync requested', `Client consent requested via ${syncChannel}`)
    finishAddition()
    if (!populated && !hasBalances) setSelectedCategory(null)
    notify(`Request sent to ${selectedFip.name}`)
  }

  const deletePendingRequests = () => {
    setSyncRequests((current) => current.filter((item) => item.status !== 'pending' || !selectedRequestIds.includes(item.id)))
    setSelectedRequestIds([])
    notify('Selected pending requests deleted')
  }

  const markSynced = (requestId) => {
    const request = syncRequests.find((item) => item.id === requestId)
    const fip = institutions.find((item) => item.name === request?.fip)
    if (request) recordActivity('Sync completed', request.fip, request.category, fip?.id)
    if (fip) setConnectedFips((current) => current.includes(fip.id) ? current : [...current, fip.id])
    setSyncRequests((current) => current.map((item) => item.id === requestId ? { ...item, status: 'synced', displayDate: 'Completed just now' } : item))
    notify('Request moved to successfully synced')
  }

  const stageUpload = (file) => {
    setUploadFile(file)
    const rows = workflowCategory === 'Mutual funds'
      ? [
          { id: 'up1', owner: client.name, category: 'Mutual funds', name: 'HDFC Flexi Cap Fund · Folio 8842', value: 0.0042, selected: true, excluded: false, source: selectedFip.name },
          { id: 'up2', owner: client.name, category: 'Mutual funds', name: 'SBI Liquid Fund · Folio 9107', value: 0.0085, selected: true, excluded: false, source: selectedFip.name },
          { id: 'up3', owner: 'Rhea Surve', category: 'Mutual funds', name: 'SBI Bluechip Fund · Folio 2191', value: 0.0016, selected: false, excluded: false, source: selectedFip.name },
          { id: 'up4', owner: 'Unidentified', category: 'Mutual funds', name: 'Folio ending 7162', value: 0.0008, selected: false, excluded: false, source: selectedFip.name },
        ]
      : workflowCategory === 'Stocks'
        ? [
            { id: 'up1', owner: client.name, category: 'Stocks', name: 'HDFC Bank · 120 shares', value: 0.0181, selected: true, excluded: false, source: selectedFip.name },
            { id: 'up2', owner: client.name, category: 'Stocks', name: 'Infosys · 80 shares', value: 0.0124, selected: true, excluded: false, source: selectedFip.name },
            { id: 'up3', owner: 'Rhea Surve', category: 'Stocks', name: 'TCS · 25 shares', value: 0.028, selected: false, excluded: false, source: selectedFip.name },
          ]
        : workflowCategory === 'Insurance'
          ? [
            { id: 'up1', owner: client.name, category: 'Insurance', name: 'HDFC Life Click 2 Wealth', value: 0.00425, selected: true, excluded: false, source: selectedFip.name },
            { id: 'up2', owner: client.name, category: 'Insurance', name: 'Policy schedule · term cover', value: 0, selected: true, excluded: false, source: selectedFip.name },
            { id: 'up3', owner: 'Rhea Surve', category: 'Insurance', name: 'Family health policy', value: 0.00225, selected: false, excluded: false, source: selectedFip.name },
          ]
          : ['Home loan', 'Car loan', 'Personal loan', 'Loan against securities', 'Overdraft', 'Credit card', 'Business loan', 'Tax payable'].includes(workflowCategory)
            ? [{ id: 'up1', owner: client.name, category: workflowCategory, name: `${workflowCategory} · outstanding balance`, value: 0.08, selected: true, excluded: false, source: selectedFip.name, type: 'Liability' }]
            : [
                { id: 'up1', owner: client.name, category: workflowCategory, name: workflowCategory === 'Real estate' ? 'Property valuation · Baner' : `${workflowCategory} · statement record`, value: 0.12, selected: true, excluded: false, source: selectedFip.name },
                { id: 'up2', owner: 'Rhea Surve', category: workflowCategory, name: 'Other client record', value: 0.04, selected: false, excluded: false, source: selectedFip.name },
              ]
    setReviewRows(rows)
    setReviewTab('Client')
    setReviewSearch('')
    setModal('review')
  }

  const toggleReviewRow = (id) => setReviewRows((current) => current.map((row) => row.id === id && row.owner === client.name ? { ...row, selected: !row.selected } : row))
  const toggleAllVisible = () => {
    const ownRows = visibleReviewRows.filter((row) => row.owner === client.name)
    const allChecked = ownRows.length > 0 && ownRows.every((row) => row.selected)
    const ids = new Set(ownRows.map((row) => row.id))
    setReviewRows((current) => current.map((row) => ids.has(row.id) ? { ...row, selected: !allChecked } : row))
  }
  const excludeSelected = () => {
    setReviewRows((current) => current.map((row) => row.owner === client.name && row.selected ? { ...row, selected: false, excluded: true } : row))
    notify('Selected records excluded from this upload')
  }

  const applyUpload = () => {
    const rows = selectedRows
    rows.filter((row) => row.type !== 'Liability').forEach((row) => updateCategoryValue(row.category, row.value))
    const liabilityRows = rows.filter((row) => row.type === 'Liability')
    if (liabilityRows.length) setLiabilities((current) => [...current, ...liabilityRows.map((row) => ({ id: row.id, category: row.category, label: row.name, value: row.value, date: 'Today', source: `Uploaded · ${row.source}`, tone: 'rose', icon: CreditCard }))])
    if (workflowCategory === 'Mutual funds') setFunds((current) => [...current, ...rows.map((row) => ({ id: crypto.randomUUID(), providerId: selectedFip.id, name: row.name, folio: 'Uploaded statement', current: row.value * 10000000, invested: row.value * 10000000, day: 0, xirr: 0, source: selectedFip.name, heldWith: 'External', verdict: 'On par', category: 'Uploaded' }))])
    if (workflowCategory === 'Stocks') setStocks((current) => [...current, ...rows.map((row) => ({ id: crypto.randomUUID(), providerId: selectedFip.id, name: row.name, quantity: 1, average: row.value * 10000000, price: row.value * 10000000, day: 0, source: selectedFip.name, type: 'Stock' }))])
    if (workflowCategory === 'Insurance') setPolicies((current) => [...current, ...rows.map((row) => ({ id: crypto.randomUUID(), providerId: selectedFip.id, name: row.name, insurer: selectedFip.name, type: 'ULIP', policy: 'Uploaded', value: row.value * 10000000, cover: 0, premium: 0, frequency: 'Annual', renewal: 'Not provided', source: 'Uploaded policy schedule', claim: 'No claim' }))])
    if (!['Mutual funds', 'Stocks', 'Insurance'].includes(workflowCategory)) setExtraRecords((current) => ({ ...current, [workflowCategory]: [...(current[workflowCategory] || []), ...rows.filter((row) => row.type !== 'Liability').map((row) => ({ name: row.name, value: row.value, date: 'Today', source: `Uploaded · ${row.source}`, detail: 'Verified from uploaded document' }))] }))
    recordActivity('Upload applied', `${rows.length} records · ${uploadFile?.name || 'Statement'}`)
    finishAddition()
    notify(`${rows.length} verified ${workflowCategory.toLowerCase()} record${rows.length === 1 ? '' : 's'} added`)
  }

  const saveManual = (event) => {
    event.preventDefault()
    if (!allowsManual(workflowCategory)) return
    if (!manual.name.trim()) return
    if (manualKind === 'liability') {
      const outstanding = Number(manual.outstanding || 0)
      if (!outstanding) return
      setLiabilities((current) => [...current, { id: `liability-${Date.now()}`, category: workflowCategory, label: manual.name, value: outstanding * Number(manual.share || 100) / 100 / 10000000, date: manual.date, source: `Partner-entered · ${manual.lender || 'client statement'}`, tone: 'rose', icon: CreditCard, emi: Number(manual.emi || 0), rate: Number(manual.rate || 0), endDate: manual.endDate }])
      recordActivity('Liability added manually', manual.name)
      finishAddition()
      notify('Liability added · unconfirmed')
      return
    }
    const custom = isCustomAsset(workflowCategory)
    if (custom && (![manual.investmentPrice, manual.investmentUnits, manual.currentPrice].every((value) => value !== '' && Number.isFinite(Number(value))) || Number(manual.investmentPrice) < 0 || Number(manual.currentPrice) < 0 || Number(manual.investmentUnits) <= 0 || !manual.investmentDate)) return
    if (workflowCategory === 'Gold' && (goldPriceStatus !== 'ready' || !isUsableGoldQuote(goldQuote) || !Number.isFinite(Number(manual.grams)) || Number(manual.grams) <= 0 || !manual.purchaseDate || manual.purchasePricePerGram === '' || !Number.isFinite(Number(manual.purchasePricePerGram)) || Number(manual.purchasePricePerGram) < 0)) {
      notify('Enter the gold purchase details and refresh the current price before saving.')
      return
    }
    const fullValue = workflowCategory === 'Insurance' ? 0 : workflowCategory === 'Gold' ? goldValue(manual.grams, manual.carat, goldQuote.pricePerGram24k) : custom ? Number(manual.investmentUnits) * Number(manual.currentPrice) : Number(manual.amount || 0)
    if (!Number.isFinite(fullValue)) return
    const includedValue = fullValue * Number(manual.share || 100) / 100
    const crores = includedValue / 10000000
    const newRecordId = crypto.randomUUID()
    const insuranceProviderId = institutions.find((item) => item.categories.includes('Insurance') && item.name.toLowerCase() === manual.insurer.trim().toLowerCase())?.id || documentSources[0].id
    updateCategoryValue(workflowCategory, crores)
    if (workflowCategory === 'Mutual funds') setFunds((current) => [...current, { id: newRecordId, providerId: selectedFip.id, name: manual.name, folio: manual.folio || 'Manual record', current: includedValue, invested: Number(manual.invested || manual.amount) * Number(manual.share || 100) / 100, day: 0, xirr: 0, source: 'Partner-entered', heldWith: 'External', verdict: 'Not rated', category: 'Manual', fundHouse: manual.fundHouse, units: Number(manual.units || 0), nav: Number(manual.nav || 0), plan: manual.plan, option: manual.option, transactions: [] }])
    if (workflowCategory === 'Stocks') setStocks((current) => [...current, { id: newRecordId, providerId: selectedFip.id, name: manual.name, quantity: Number(manual.quantity || 1), average: Number(manual.average || 0) * Number(manual.share || 100) / 100, price: includedValue / Number(manual.quantity || 1), day: 0, source: 'Partner-entered', type: 'Stock' }])
    if (workflowCategory === 'Insurance') setPolicies((current) => [...current, { id: newRecordId, providerId: insuranceProviderId, name: manual.name, insurer: manual.insurer, type: manual.policyType, policy: manual.policy, insuredPerson: manual.insuredPerson, brokerCode: manual.brokerCode, policyStart: manual.policyStart, healthCoverType: manual.policyType === 'Health' ? manual.healthCoverType : undefined, vehicleNumber: manual.policyType === 'Motor' ? manual.vehicleNumber : undefined, destination: manual.policyType === 'Travel' ? manual.destination : undefined, value: 0, cover: Number(manual.cover || 0), premium: Number(manual.premium || 0), frequency: manual.frequency, renewal: manual.policyType === 'Health' ? manual.renewal : undefined, maturity: manual.policyType !== 'Health' ? manual.maturity : undefined, premiumPayingDate: manual.policyType !== 'Health' ? manual.premiumPayingDate : undefined, source: 'Partner-entered · unconfirmed', claim: 'No claim' }])
    if (workflowCategory === 'Real estate') setExtraRecords((current) => ({ ...current, 'Real estate': [...(current['Real estate'] || []), { name: manual.name, value: crores, date: manual.date, source: 'Partner-entered · unconfirmed', detail: `${manualMeta.propertyType} · ${manual.address || `${manual.share}% ownership`}` }] }))
    if (workflowCategory === 'Gold') setExtraRecords((current) => ({ ...current, Gold: [...(current.Gold || []), { id: newRecordId, name: manual.name, value: crores, date: goldQuote.updatedAt.slice(0, 10), source: 'Gold API · partner-entered details', detail: `${manual.goldCategory} · ${manual.carat}K · ${manual.grams} g`, goldCategory: manual.goldCategory, carat: Number(manual.carat), grams: Number(manual.grams), purchaseDate: manual.purchaseDate, purchasePricePerGram: Number(manual.purchasePricePerGram), quoteUpdatedAt: goldQuote.updatedAt, pricePerGram: goldValue(1, manual.carat, goldQuote.pricePerGram24k) }] }))
    if (!['Mutual funds', 'Stocks', 'Insurance', 'Real estate', 'Gold'].includes(workflowCategory)) setExtraRecords((current) => ({ ...current, [workflowCategory]: [...(current[workflowCategory] || []), { id: newRecordId, name: manual.name, value: crores, date: custom ? manual.investmentDate : manual.date, source: 'Partner-entered · unconfirmed', detail: custom ? `${manual.investmentUnits} units` : manual.source, ...(custom ? { investmentPrice: Number(manual.investmentPrice), investmentUnits: Number(manual.investmentUnits), investmentDate: manual.investmentDate, currentPrice: Number(manual.currentPrice) } : {}) }] }))
    recordActivity('Record added manually', manual.name, workflowCategory, workflowCategory === 'Insurance' ? insuranceProviderId : selectedFip.id)
    finishAddition()
    notify('Manual record added · unconfirmed')
  }

  const openRequests = () => { setSelectedRequestIds([]); setModal('requests') }
  const selectRequest = (id) => setSelectedRequestIds((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id])
  const displayValue = (value) => hidden ? '₹ ••••••' : formatCr(value)
  const categoryIcon = (name) => assets.find((item) => item.category === name)?.icon || Home

  const renderAssetRows = (items, isLiability = false) => items.map((item) => {
    const Icon = item.icon || categoryIcon(item.category)
    return (
      <button className="asset-row" key={item.id} onClick={() => setSelectedCategory(item.category)}>
        <span className={`asset-row-icon ${item.tone || 'plum'}`}><Icon size={18} /></span>
        <span className="asset-row-copy"><strong>{item.category}<em>{formatPercent(item.value, isLiability ? totalLiabilities : totalAssets)}</em></strong><small>{item.label} · {item.date}</small></span>
        <span className="asset-row-value"><small>{isLiability ? 'Outstanding' : 'Current value'}</small><strong>{hidden ? '••••••' : displayValue(item.value)}</strong><em className={isLiability ? 'loss' : 'gain'}>{isLiability ? '−' : '+'} {hidden ? '••••' : '₹1,137'}</em></span>
        <ChevronRight size={17} />
      </button>
    )
  })

  const renderMutualFunds = () => {
    const shown = funds.filter((fund) => fundFilter === 'All' || fund.heldWith === fundFilter)
    const currentTotal = shown.reduce((sum, fund) => sum + fund.current, 0)
    const investedTotal = shown.reduce((sum, fund) => sum + fund.invested, 0)
    const dayTotal = shown.reduce((sum, fund) => sum + fund.day, 0)
    const returnTotal = currentTotal - investedTotal
    const weightedXirr = investedTotal ? shown.reduce((sum, fund) => sum + fund.invested * fund.xirr, 0) / investedTotal : 0
    const performance = ['Outperforming', 'On par', 'Underperforming'].map((name) => ({ name, value: shown.filter((fund) => fund.verdict === name).length }))
    return (
      <>
        <div className="detail-heading"><button className="back-button" onClick={() => setSelectedCategory(null)}><ArrowLeft size={20} /></button><h1>Mutual funds</h1><button className="circle-control" onClick={() => setHidden((value) => !value)} aria-label="Toggle balances"><EyeIcon hidden={hidden} /></button><button className="circle-control" onClick={() => notify('Fund analytics refreshed')} aria-label="View fund analytics"><Activity size={18} /></button></div>
        <section className="fund-summary"><div className="fund-summary-head"><div><span>HOLDINGS ({shown.length})</span><strong>{hidden ? '₹ ••••••' : formatRupees(fundValueMode === 'Current' ? currentTotal : investedTotal)}</strong></div><button className="summary-visibility" onClick={() => setHidden((value) => !value)}><EyeIcon hidden={hidden} /></button><button className="summary-analytics" onClick={() => notify('Fund analytics refreshed')}><Activity size={19} /></button></div><div className="fund-stats"><div><span>1D returns</span><strong className={dayTotal >= 0 ? 'positive' : 'negative'}>{dayTotal >= 0 ? '+' : '−'}{hidden ? '₹••••' : formatRupees(Math.abs(dayTotal))} ({dayTotal >= 0 ? '+' : ''}{currentTotal ? ((dayTotal / currentTotal) * 100).toFixed(2) : '0.00'}%)</strong></div><div><span>Total returns</span><strong className={returnTotal >= 0 ? 'positive' : 'negative'}>{returnTotal >= 0 ? '+' : '−'}{hidden ? '₹••••' : formatRupees(Math.abs(returnTotal))} ({investedTotal ? ((returnTotal / investedTotal) * 100).toFixed(2) : '0.00'}%)</strong></div><div><span>Invested</span><strong>{hidden ? '₹ ••••••' : formatRupees(investedTotal)}</strong></div><div><span>XIRR</span><strong>{weightedXirr.toFixed(2)}%</strong></div></div></section>
        <section className="performance-panel"><div className="panel-title"><h2>Fund performance</h2><span>3-yr vs category</span></div><div className="performance-stats">{performance.map((item) => <div key={item.name}><strong className={item.name === 'Outperforming' ? 'perf-up' : item.name === 'Underperforming' ? 'perf-down' : ''}>{item.value}</strong><span>{item.name}</span></div>)}</div><p>Rule: above 2% a year is outperforming; below −2% is underperforming. Partner confirms before any switch.</p></section>
        <div className="fund-list-controls"><div className="filter-pills">{['All', 'Internal', 'External'].map((value) => <button key={value} className={fundFilter === value ? 'pill-active' : ''} onClick={() => setFundFilter(value)}>{value}</button>)}</div><button className="value-mode" onClick={() => setFundValueMode(fundValueMode === 'Current' ? 'Invested' : 'Current')}><ArrowLeftRight size={14} /> {fundValueMode} ({fundValueMode === 'Current' ? 'Invested' : 'Current'})</button></div>
        <div className="fund-list">{shown.map((fund) => { const open = expanded === fund.id; const value = fundValueMode === 'Current' ? fund.current : fund.invested; return <article className="fund-item" key={fund.id}><button className="fund-item-main" onClick={() => setExpanded(open ? null : fund.id)}><span className="fund-item-copy"><strong>{fund.name}</strong><small>Folio {fund.folio}</small><span className="fund-tags"><i className={fund.heldWith === 'Internal' ? 'tag-internal' : 'tag-external'}>{fund.heldWith}</i><i className={`tag-${fund.verdict.toLowerCase().replace(' ', '-')}`}>{fund.verdict}</i><i>{fund.source}</i></span>{fund.verdict !== 'Not rated' && <span className="fund-comment">{fund.verdict === 'Outperforming' ? `Beat ${fund.category} average over 3 years.` : fund.verdict === 'Underperforming' ? `Behind ${fund.category} average over 3 years.` : `Tracking the ${fund.category} average.`}</span>}</span><span className="fund-item-value"><strong>{hidden ? '••••' : formatRupees(value)}</strong><small>({hidden ? '••••' : formatRupees(fundValueMode === 'Current' ? fund.invested : fund.current)})</small><em className={fund.day >= 0 ? 'positive' : 'negative'}>{fund.day >= 0 ? '+' : '−'}{hidden ? '••' : formatRupees(Math.abs(fund.day))}</em></span></button>{open && <div className="fund-transactions"><div className="fund-meta-grid"><div><span>Category</span><strong>{fund.category}</strong></div><div><span>Source</span><strong>{fund.source} · {fund.heldWith}</strong></div><div><span>Annualised return</span><strong>{fund.xirr.toFixed(2)}% XIRR</strong></div></div><h3>Recent transactions</h3>{fund.transactions?.map((transaction) => <div className="transaction-row" key={`${transaction.date}-${transaction.type}`}><span>{transaction.date} · {transaction.type}</span><strong>{formatRupees(transaction.amount)}</strong></div>)}<div className="transaction-row"><span>Statement / transaction history</span><button onClick={() => startUpload('Mutual funds')}>Upload statement</button></div></div>}</article>})}</div>
        
      </>
    )
  }

  const renderStocks = () => {
    const current = stocks.reduce((sum, item) => sum + item.quantity * item.price, 0)
    const invested = stocks.reduce((sum, item) => sum + item.quantity * item.average, 0)
    return <><div className="detail-heading"><button className="back-button" onClick={() => setSelectedCategory(null)}><ArrowLeft size={20} /></button><h1>Stocks</h1><button className="circle-control" onClick={() => startSync('Stocks')} aria-label="Sync stocks"><RefreshCw size={17} /></button></div><section className="stock-summary"><div><span>Invested</span><strong>{hidden ? '₹••••••' : formatRupees(invested)}</strong></div><div><span>Current</span><strong>{hidden ? '₹••••••' : formatRupees(current)}</strong></div><div><span>Unrealised gain/loss</span><strong className={current >= invested ? 'positive' : 'negative'}>{current >= invested ? '+' : '−'}{hidden ? '••••' : formatRupees(Math.abs(current - invested))}</strong></div></section><div className="detail-section-heading"><h2>Holdings ({stocks.length})</h2><span>Quantity · average · last traded price</span></div><div className="stock-list">{stocks.map((stock) => { const now = stock.quantity * stock.price; const cost = stock.quantity * stock.average; return <article className="stock-item" key={stock.id}><div className="stock-item-top"><div><strong>{stock.name}</strong><span>{stock.type} · {stock.source}</span></div><strong className={now >= cost ? 'positive' : 'negative'}>{hidden ? '••••' : formatRupees(now)}</strong></div><div className="stock-item-data"><span>Qty <b>{stock.quantity}</b></span><span>Avg <b>{formatRupees(stock.average)}</b></span><span>LTP <b>{formatRupees(stock.price)}</b></span><span className={stock.day >= 0 ? 'positive' : 'negative'}>{stock.day >= 0 ? '+' : ''}{stock.day.toFixed(2)}%</span></div><div className="stock-item-source">Added via {stock.source}</div></article>})}</div></>
  }

  const renderInsurance = () => {
    const typeSummary = [...new Set([...insuranceTypes, ...policies.map((policy) => policy.type)])].map((type) => {
      const matching = policies.filter((policy) => policy.type === type)
      return { type, count: matching.length, cover: matching.reduce((sum, policy) => sum + Number(policy.cover || 0), 0) }
    }).filter((item) => item.count > 0)
    const coverValue = policies.reduce((sum, item) => sum + item.cover, 0)
    return <><div className="detail-heading"><button className="back-button" onClick={() => setSelectedCategory(null)}><ArrowLeft size={20} /></button><h1>Insurance</h1><button className="circle-control" onClick={() => startManual('Insurance')} aria-label="Add insurance policy"><Plus size={18} /></button></div><section className="insurance-summary" aria-label="Insurance summary"><div className="insurance-summary-totals"><div><span>Total policies</span><strong>{policies.length}</strong></div><div><span>Insurance types</span><strong>{typeSummary.length}</strong></div><div><span>Total sum assured</span><strong>{hidden ? '••••' : formatRupees(coverValue)}</strong></div></div><table className="insurance-type-table"><caption>Coverage by insurance type</caption><thead><tr><th scope="col">Insurance type</th><th scope="col">No. of policies</th><th scope="col">Total sum assured</th></tr></thead><tbody>{typeSummary.map((item) => <tr key={item.type}><th scope="row"><span className={`policy-kind kind-${item.type.toLowerCase().replaceAll(' ', '-')}`}>{item.type}</span></th><td>{item.count}</td><td>{hidden ? '••••' : formatRupees(item.cover)}</td></tr>)}</tbody></table>{!policies.length && <p className="rail-empty">Add a policy to see your coverage by insurance type.</p>}<p className="insurance-summary-note">Coverage is shown separately from net worth. Motor policies show insured declared value.</p></section><div className="detail-section-heading"><h2>Policies ({policies.length})</h2><button onClick={() => startUpload('Insurance')}>Upload policy</button></div><div className="policy-list">{policies.map((policy) => <article className="policy-card" key={policy.id}><div className="policy-main"><div><span className={`policy-kind kind-${policy.type.toLowerCase()}`}>{policy.type}</span><h3>{policy.name}</h3><p>{policy.insurer} · Policy {policy.policy}</p></div><strong>{hidden ? '••••' : formatRupees(policy.cover)}<small>{policy.type === 'Motor' ? 'Insured declared value' : 'Sum assured'}</small></strong></div><div className="policy-details"><div><span>Premium</span><strong>{hidden ? '••••' : formatRupees(policy.premium)} / {policy.frequency.toLowerCase()}</strong></div><div><span>Insurance type</span><strong>{policy.type}</strong></div><div><span>Broker code</span><strong>{policy.brokerCode || 'Not provided'}</strong></div>{policy.insuredPerson && <div><span>Insured person</span><strong>{policy.insuredPerson}</strong></div>}{policy.policyStart && <div><span>Policy start date</span><strong>{policy.policyStart}</strong></div>}{policy.type === 'Health' ? <><div><span>Renewal date</span><strong>{policy.renewal || 'Not provided'}</strong></div>{policy.healthCoverType && <div><span>Health policy type</span><strong>{policy.healthCoverType}</strong></div>}</> : <><div><span>Maturity date</span><strong>{policy.maturity || 'Not provided'}</strong></div><div><span>Premium paying date</span><strong>{policy.premiumPayingDate || 'Not provided'}</strong></div></>}{policy.vehicleNumber && <div><span>Vehicle registration</span><strong>{policy.vehicleNumber}</strong></div>}{policy.destination && <div><span>Travel destination</span><strong>{policy.destination}</strong></div>}<div><span>Claim status</span><strong>{policy.claim}</strong></div><div><span>Added via</span><strong>{policy.source}</strong></div></div><button className="follow-up-button" onClick={() => notify(`Policy follow-up saved for ${policy.name}`)}><Bell size={14} /> {policy.type === 'Health' ? 'Add renewal follow-up' : 'Add premium / maturity follow-up'} <ChevronRight size={15} /></button></article>)}</div></>
  }

  const renderGenericDetail = () => {
    const item = assets.find((value) => value.category === selectedCategory)
    const debt = liabilities.find((value) => value.category === selectedCategory)
    const amount = item?.value || debt?.value || 0
    const records = [...(populated ? genericRecords[selectedCategory] || [] : []), ...(extraRecords[selectedCategory] || [])].map((record) => selectedCategory === 'Gold' && record.grams !== undefined && goldQuote ? { ...record, value: goldValue(record.grams, record.carat, goldQuote.pricePerGram24k) / 10000000, pricePerGram: goldValue(1, record.carat, goldQuote.pricePerGram24k), quoteUpdatedAt: goldQuote.updatedAt } : record)
    if (!records.length && (item || debt)) records.push({ name: item?.category || debt?.category || selectedCategory, value: amount, date: item?.date || debt?.date || 'Not provided', source: item?.source || debt?.source || 'Partner-entered', detail: item?.label || debt?.label || '1 record' })
    return <><div className="detail-heading"><button className="back-button" onClick={() => setSelectedCategory(null)}><ArrowLeft size={20} /></button><h1>{selectedCategory}</h1><button className="circle-control" onClick={() => startManual(selectedCategory)} aria-label="Add record"><Plus size={18} /></button></div><section className="generic-total"><span>Current value</span><strong>{hidden ? '₹••••••' : formatInr(amount)}</strong><small>{debt ? 'Outstanding liability' : `${formatPercent(amount, totalAssets)} of assets`}</small></section><div className="detail-section-heading"><h2>Records ({records.length})</h2>{selectedCategory === 'Gold' && <button disabled={goldPriceStatus === 'loading'} onClick={loadGoldPrice}>{goldPriceStatus === 'loading' ? 'Updating price…' : goldPriceStatus === 'error' ? 'Price unavailable · Retry' : 'Refresh gold price'}</button>}{!isCustomAsset(selectedCategory) && <button onClick={() => startUpload(selectedCategory)}>Upload supporting file</button>}</div><div className="generic-record-list">{records.map((record) => <article className="generic-record" key={record.id || record.name}><div><strong>{record.name}</strong><span>{record.detail}</span><small>{record.date} · {record.source}</small>{record.grams !== undefined && <dl className="investment-details"><div><dt>Category</dt><dd>{record.goldCategory}</dd></div><div><dt>Carat / Weight</dt><dd>{record.carat}K · {record.grams} g</dd></div><div><dt>Date of purchase</dt><dd>{record.purchaseDate}</dd></div><div><dt>Purchase price / gram</dt><dd>{hidden ? '••••' : formatRupees(record.purchasePricePerGram)}</dd></div><div><dt>Current price / gram</dt><dd>{hidden ? '••••' : formatRupees(record.pricePerGram)}</dd></div><div><dt>Price updated</dt><dd>{new Date(record.quoteUpdatedAt).toLocaleString('en-IN')}</dd></div></dl>}{record.investmentUnits !== undefined && <dl className="investment-details"><div><dt>Investment value per unit</dt><dd>{hidden ? '••••' : formatRupees(record.investmentPrice)}</dd></div><div><dt>No. of units</dt><dd>{record.investmentUnits}</dd></div><div><dt>Date of investment</dt><dd>{record.investmentDate}</dd></div><div><dt>Current value per unit</dt><dd>{hidden ? '••••' : formatRupees(record.currentPrice)}</dd></div></dl>}</div><strong>{hidden ? '••••' : formatCr(record.value)}</strong></article>)}</div></>
  }

  const renderRecentActivity = (name, fipId = null) => {
    const entries = activity.filter((item) => item.category === name && (!fipId || item.providerId === fipId))
    return <section className="rail-panel"><div className="rail-heading"><div><span className="rail-kicker">ACTIVITY</span><h2>Recent activity</h2></div></div><div className="asset-activity-list">{entries.slice(0, 5).map((item) => <article key={item.id}><span className="rail-status-icon status-purple"><Clock3 size={15} /></span><div><strong>{item.title}</strong><p>{item.detail}</p><time dateTime={item.date}>{new Date(item.date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</time></div></article>)}{!entries.length && <p className="rail-empty">No recent activity yet. Uploads, manual additions and sync updates will appear here.</p>}</div></section>
  }

  const renderAssetFollowUp = (name) => {
    const pending = syncRequests.filter((request) => request.category === name && request.status === 'pending').length
    const messages = {
      'Mutual funds': ['Review fund performance', 'Check underperforming funds and recent statements.'],
      Stocks: ['Keep holdings up to date', 'Review quantities and your latest broker statement.'],
      Insurance: ['Review policy dates and cover', 'Check health renewals, maturity dates and premium payments.'],
      'Real estate': ['Refresh property valuations', 'Review ownership shares and current market values.'],
      Gold: ['Review gold valuation', 'Check weight, purity and the latest valuation.'],
    }
    const [title, description] = messages[name] || ['Review values and documents', `Keep your ${name.toLowerCase()} records up to date.`]
    return <section className="rail-panel asset-follow-up"><div className="rail-heading"><div><span className="rail-kicker">{name.toUpperCase()} · DATA HEALTH</span><h2>Worth a follow-up</h2></div></div><div className="rail-follow-up"><span className="rail-status-icon status-warn"><Clock3 size={15} /></span><span><strong>{title}</strong><small>{description}</small></span></div>{pending > 0 && <button className="rail-follow-up" onClick={openRequests}><span className="rail-status-icon status-purple"><Link2 size={15} /></span><span><strong>{pending} requests awaiting client</strong><small>{name} · view request tracker</small></span><ChevronRight size={15} /></button>}</section>
  }

  const renderAssetRail = () => {
    const name = selectedCategory
    const canSync = institutions.some((fip) => fip.categories.includes(name))
    return <aside className="asset-action-rail"><section className="rail-panel"><div className="rail-heading"><div><span className="rail-kicker">{name.toUpperCase()}</span><h2>Add to this asset</h2><p>Choose how to add your records.</p></div></div><div className="asset-action-list">{!isCustomAsset(name) && <><button className="fip-action-button" onClick={() => startUpload(name)}><CloudUpload size={18} /><span><strong>Upload</strong><small>Review a PDF or Excel statement</small></span><ChevronRight size={15} /></button>{allowsSync(name) && <button className="fip-action-button" disabled={!canSync} onClick={() => startSync(name)}><Link2 size={18} /><span><strong>Sync</strong><small>{canSync ? 'Connect a provider with client consent' : 'Sync is not available for this asset'}</small></span><ChevronRight size={15} /></button>}</>}{allowsManual(name) && <button className="fip-action-button" onClick={() => startManual(name)}><Plus size={18} /><span><strong>Add manually</strong><small>{isCustomAsset(name) ? 'Enter investment prices, units and date' : name === 'Insurance' ? 'Enter policy and premium details' : 'Enter details and ownership share'}</small></span><ChevronRight size={15} /></button>}</div></section>{renderAssetFollowUp(name)}{renderRecentActivity(name)}</aside>
  }

  const renderCategoryDetail = () => selectedCategory === 'Mutual funds' ? renderMutualFunds() : selectedCategory === 'Stocks' ? renderStocks() : selectedCategory === 'Insurance' ? renderInsurance() : renderGenericDetail()

  const renderFipDetail = () => {
    const fip = selectedFipDetail
    const categoryName = fip.categories[0]
    const records = categoryName === 'Mutual funds'
      ? funds.filter((fund) => fund.providerId === fip.id || fip.id === 'mfcentral' || (fip.id === 'cams' && fund.source.includes('CAMS')) || (fip.id === 'kfin' && fund.source.includes('KFintech')))
      : categoryName === 'Stocks'
        ? stocks.filter((stock) => stock.providerId === fip.id || (fip.id === 'nsdl' && stock.source === 'NSDL') || stock.source === fip.name)
        : policies.filter((policy) => policy.providerId === fip.id || policy.insurer.toLowerCase().includes(fip.name.toLowerCase().split(' ')[0]))
    const recordValue = categoryName === 'Mutual funds'
      ? records.reduce((sum, item) => sum + item.current, 0)
      : categoryName === 'Stocks'
        ? records.reduce((sum, item) => sum + item.quantity * item.price, 0)
        : records.reduce((sum, item) => sum + Number(item.cover || 0), 0)
    const formattedFipValue = ['Mutual funds', 'Stocks', 'Insurance'].includes(categoryName) ? formatRupees(recordValue) : formatCr(recordValue)
    const status = connectedFips.includes(fip.id) ? 'Connected' : pendingFips.includes(fip.id) ? 'Request pending' : 'Not connected'
    return (
      <div className="fip-layout">
        <section className="fip-main">
          <div className="fip-page-heading"><button className="back-button" onClick={() => setSelectedFipDetail(null)}><ArrowLeft size={19} /> Net Worth</button><span className="fip-status">{status}</span></div>
          <div className="fip-title-block"><span className="rail-kicker">FINANCIAL INFORMATION PROVIDER</span><h1>{fip.name}</h1><p>{fip.detail}</p></div>
          <div className="fip-metric"><span>{categoryName === 'Insurance' ? 'Total sum assured' : `${categoryName} holdings`}</span><strong>{formattedFipValue}</strong><small>{records.length} records · source tagged per record</small></div>
          <div className="fip-record-heading"><h2>Records from {fip.name}</h2><span>{records.length} {records.length === 1 ? 'record' : 'records'}</span></div>
          <div className="fip-record-list">{records.map((record) => <article className="fip-record" key={record.id || record.name}><div><strong>{record.name}</strong><small>{categoryName === 'Mutual funds' ? `Folio ${record.folio} · ${record.category}` : categoryName === 'Stocks' ? `${record.quantity} shares · ${record.source}` : `${record.type} · Policy ${record.policy}`}</small></div><strong>{formatRupees(categoryName === 'Mutual funds' ? record.current : categoryName === 'Stocks' ? record.quantity * record.price : record.cover)}</strong><span className="source-pill">{record.source || fip.name}</span></article>)}{!records.length && <div className="fip-empty">No records from this FIP yet. Choose an action to add its data.</div>}</div>
        </section>
        <aside className="asset-action-rail"><section className="fip-action-rail"><span className="rail-kicker">{categoryName.toUpperCase()}</span><h2>Manage this FIP</h2><p>Actions apply only to {fip.name}.</p><button className="fip-action-button" onClick={() => openFipFlow(fip, 'upload')}><CloudUpload size={17} /><span><strong>Upload PDF / Excel</strong><small>Review extracted records before adding</small></span><ChevronRight size={15} /></button>{allowsSync(categoryName) && <button className="fip-action-button" onClick={() => openFipFlow(fip, 'sync')}><Link2 size={17} /><span><strong>Sync automatically</strong><small>Request client consent for this FIP</small></span><ChevronRight size={15} /></button>}{allowsManual(categoryName) && <button className="fip-action-button" onClick={() => openFipFlow(fip, 'manual')}><Plus size={17} /><span><strong>Add holding</strong><small>{categoryName === 'Insurance' ? 'Enter policy details' : `Enter a ${categoryName.toLowerCase()} record`}</small></span><ChevronRight size={15} /></button>}<div className="fip-action-note"><ShieldCheck size={15} /> Partner-entered records are marked unconfirmed.</div></section>{renderAssetFollowUp(categoryName)}{renderRecentActivity(categoryName, fip.id)}</aside>
      </div>
    )
  }

  const renderFirstAssetEntry = () => {
    const primaryAssets = [
      { name: 'Mutual funds', icon: Activity, description: 'Connect CAMS / KFintech or upload a CAS statement.', sync: true },
      { name: 'Stocks', icon: ArrowUpRight, description: 'Connect a broker or upload a holdings statement.', sync: true },
      { name: 'Insurance', icon: ShieldCheck, description: 'Upload a policy document or enter policy details.', sync: false },
    ]
    const otherAssets = [
      { name: 'Real estate', icon: Home }, { name: 'Gold', icon: Coins },
      { name: 'Silver', icon: Coins }, { name: 'AIF / PMS', icon: BriefcaseBusiness },
      { name: 'Bank accounts', icon: Landmark }, { name: 'Fixed & recurring deposits', icon: Landmark },
    ]
    const renderEntryRow = (name, Icon = Landmark) => <article className="entry-asset-row" key={name}><span className="entry-small-icon"><Icon size={17} /></span><strong>{name}</strong><div><button onClick={() => startUpload(name)} aria-label={`Upload ${name}`}><Upload size={13} /> Upload</button><button onClick={() => startManual(name)} aria-label={`Add ${name} manually`}><Plus size={13} /> Add manually</button></div></article>
    return <section className="first-asset-entry" aria-labelledby="first-asset-title">
      <div className="entry-heading"><div><span className="rail-kicker">{client.name.toUpperCase()} · NET WORTH</span><h1 id="first-asset-title">Add your client’s assets</h1><p>Choose an asset and how you want to add it.</p></div><span className="entry-security"><ShieldCheck size={15} /> Sync requires client consent</span></div>
      <div className="entry-primary-grid">{primaryAssets.map(({ name, icon: Icon, description, sync }) => <article className="entry-primary-card" key={name}><span className="entry-large-icon"><Icon size={23} /></span><h2>{name}</h2><p>{description}</p><div className="entry-primary-actions">{sync ? <><button className="primary-action" onClick={() => startSync(name)} aria-label={`Sync ${name}`}><Link2 size={15} /> Sync</button><button className="secondary-button" onClick={() => startUpload(name)} aria-label={`Upload ${name}`}><Upload size={15} /> Upload</button></> : <><button className="primary-action" onClick={() => startUpload(name)} aria-label={`Upload ${name}`}><Upload size={15} /> Upload</button><button className="secondary-button" onClick={() => startManual(name)} aria-label={`Add ${name} manually`}><Plus size={15} /> Add manually</button></>}</div></article>)}</div>
      {syncRequests.length > 0 && <div className="entry-pending"><span className="rail-status-icon status-purple"><Clock3 size={17} /></span><div><strong>{syncRequests.filter((request) => request.status === 'pending').length} requests awaiting client</strong><span>{syncRequests.slice(0, 3).map((request) => `${request.fip} · ${request.status === 'pending' ? 'Consent requested' : 'Connected'}`).join(' / ')}</span></div><button className="rail-link" onClick={openRequests}>View requests <ArrowRight size={14} /></button></div>}
      <div className="entry-section-heading"><h2>Other assets</h2><span>Enter details or upload a supporting document</span></div>
      <div className="entry-other-grid">{otherAssets.map(({ name, icon }) => renderEntryRow(name, icon))}{customCategories.map((name) => <article className="entry-asset-row" key={name}><span className="entry-small-icon"><BriefcaseBusiness size={17} /></span><strong>{name}</strong><div><button onClick={() => startManual(name)}><Plus size={13} /> Add manually</button></div></article>)}</div>
      <div className="entry-additional"><details><summary>More asset types <ChevronDown size={14} /></summary><div className="entry-other-grid">{['PPF', 'EPF', 'NPS', 'Vehicles'].map((name) => renderEntryRow(name))}</div></details><button className="entry-custom-button" onClick={() => openFlow('Other asset')}><Plus size={15} /><span>Add an unlisted asset<small>Artifacts, collectibles and other investments</small></span><ChevronRight size={15} /></button></div>
      <div className="entry-liabilities"><div><h2>Have a liability to add?</h2><p>Include loans and outstanding balances in the client’s net worth.</p></div><details><summary><Plus size={14} /> Add liability</summary><div className="entry-liability-options">{['Home loan', 'Car loan', 'Personal loan', 'Credit card', 'Loan against securities', 'Other liability'].map((name) => <button key={name} onClick={() => startManual(name)}>{name}<ChevronRight size={13} /></button>)}</div></details></div>
    </section>
  }

  const renderOverview = () => (
    <div className="overview-grid">
      <div className="overview-main">
        <div className="category-pills">{['All', 'Mutual funds', 'Stocks', 'Insurance'].map((name) => <button key={name} className={category === name ? 'category-pill-active' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div>
        <section className="overview-card"><div className="overview-head"><strong>Overview <span title="Net worth is assets minus liabilities">i</span></strong><span>{populated ? 'As of 30 Sep' : hasBalances ? 'Current records' : 'Not connected yet'}</span><button className="visibility-button" aria-label="Hide or show amounts" onClick={() => setHidden((value) => !value)}><EyeIcon hidden={hidden} /></button></div><div className="overview-content"><div className="overview-balance"><div className="overview-net-label">Net Worth</div><div className="overview-total">{hidden ? '₹ ••••••' : hasBalances ? formatInr(netWorth) : '—'}</div>{!populated ? <p className="empty-overview-note">{hasBalances ? 'Based on the records you have added.' : 'Add your first asset to see your net worth.'}</p> : <div className="overview-change"><span>Change as of</span><label className="period-choice"><select aria-label="Change period" value={period} onChange={(event) => setPeriod(event.target.value)}>{periods.map((name) => <option key={name}>{name}</option>)}</select><ArrowLeftRight size={12} /></label><span className={periodChanges[period].startsWith('−') ? 'negative' : 'positive'}>{hidden ? '••••' : periodChanges[period]}</span></div>}</div><NetWorthTrend netWorth={netWorth} hidden={hidden} hasHistory={populated} compact onDetails={() => setModal('trend')} /></div><div className="own-owe"><div><span>You own</span><strong>{hidden ? '₹ ••••••' : hasBalances ? formatInr(totalAssets) : '—'}</strong></div><div><span>You owe</span><strong>{hidden ? '••••••' : hasBalances ? `− ${formatInr(totalLiabilities)}` : '—'}</strong></div></div></section>
        <div className="sync-status-line"><span><Clock3 size={14} /> {populated ? 'Synced 9:00 am today' : connectedFips.length ? `${connectedFips.length} providers connected` : 'No accounts synced yet'}</span><button onClick={() => populated ? openRequests() : startSync('Mutual funds')}><RefreshCw size={14} /> {populated ? 'Resync' : 'Connect an account'}</button></div>
        <section className="allocation-section"><div className="section-header"><div><h2>Asset allocation</h2><p>Share of all owned assets by category</p></div><button className="text-only" onClick={() => setCategory('All')}>All assets <ChevronDown size={14} /></button></div>{!totalAssets && <p className="empty-allocation">Your asset allocation will appear once you add investments.</p>}<div className="allocation-bar">{assets.map((item) => <i key={item.id} className={`allocation-${item.tone}`} style={{ width: `${totalAssets ? item.value / totalAssets * 100 : 0}%` }} />)}</div><div className="allocation-legend">{assets.slice(0, 5).map((item) => <span key={item.id}><i className={`legend-${item.tone}`} />{item.category}<strong>{formatPercent(item.value, totalAssets)}</strong></span>)}</div></section>
        <section className="asset-list-section"><div className="section-header"><div><h2>What you own</h2><p>{filteredAssets.length} asset categories</p></div><strong>{hidden ? '••••' : formatInr(totalAssets)}</strong></div><div className="asset-list">{renderAssetRows(filteredAssets)}{['Mutual funds', 'Stocks', 'Insurance'].filter((name) => (category === 'All' || category === name) && !assets.some((item) => item.category === name)).map((name) => <div className="empty-asset-row" key={name}><span className="rail-fip-icon">{name === 'Insurance' ? <ShieldCheck size={18} /> : <Activity size={18} />}</span><div><strong>{name}</strong><small>{name === 'Insurance' ? 'No policies added' : 'No holdings connected'}</small></div><button className="secondary-button" onClick={() => openFlow(name)}>{name === 'Insurance' ? 'Add policy' : 'Add holdings'}<Plus size={13} /></button></div>)}</div></section>
        <section className="asset-list-section liability-section"><div className="section-header"><div><h2>What you owe</h2><p>{liabilities.length} liabilities</p></div><button className="text-only" onClick={() => startManual('Home loan')}><Plus size={14} /> Add liability</button><strong>{hidden ? '••••' : `− ${formatInr(totalLiabilities)}`}</strong></div><div className="asset-list">{renderAssetRows(liabilities, true)}{!liabilities.length && <p className="empty-section-note">No liabilities added. Add a loan or outstanding balance to complete the picture.</p>}</div></section>
      </div>
      <aside className="overview-rail">
        <section className="rail-panel add-rail"><div className="rail-heading"><div><span className="rail-kicker">AVAILABLE SOURCES</span><h2>Add to your net worth</h2><p>Choose an asset or explore more providers.</p></div></div><div className="manual-category-grid">{['Real estate', 'Gold', 'Silver'].map((name) => <button key={name} onClick={() => openFlow(name)}>{name}<ChevronRight size={14} /></button>)}<button className="sync-more" onClick={() => setModal('more-fips')}>Sync more<ArrowRight size={14} /></button></div></section>
        {!populated ? <section className="rail-panel"><div className="rail-heading"><div><span className="rail-kicker">GETTING STARTED</span><h2>Build your net worth</h2></div></div><ol className="onboarding-steps"><li><strong>Add investments</strong><span>Connect mutual funds or stocks, or upload a statement.</span></li><li><strong>Add your other assets</strong><span>Include insurance, property, gold and more.</span></li><li><strong>Complete the picture</strong><span>Add outstanding loans and liabilities.</span></li></ol>{syncRequests.some((item) => item.status === 'pending') && <button className="rail-link" onClick={openRequests}>View pending requests <ArrowRight size={14} /></button>}</section> : <section className="rail-panel"><div className="rail-heading"><div><span className="rail-kicker">DATA HEALTH</span><h2>Worth a follow-up</h2></div><span className="rail-count">3</span></div><button className="rail-follow-up" onClick={() => setSelectedCategory('Real estate')}><span className="rail-status-icon status-warn"><Clock3 size={15} /></span><span><strong>2 values need a refresh</strong><small>Property · Gold · oldest 3 months</small></span><ChevronRight size={15} /></button><button className="rail-follow-up" onClick={openRequests}><span className="rail-status-icon status-purple"><Link2 size={15} /></span><span><strong>{syncRequests.filter((item) => item.status === 'pending').length} requests awaiting client</strong><small>Open the request tracker</small></span><ChevronRight size={15} /></button><button className="rail-follow-up" onClick={() => setSelectedCategory('Insurance')}><span className="rail-status-icon status-blue"><ShieldCheck size={15} /></span><span><strong>Policy renewals and cover</strong><small>Review policy dates and claims</small></span><ChevronRight size={15} /></button></section>}
        <section className="rail-panel"><div className="rail-heading"><div><span className="rail-kicker">CONNECTED DATA</span><h2>FIP sync status</h2></div><button className="rail-refresh" onClick={() => notify('FIP status refreshed')} aria-label="Refresh FIP status"><RefreshCw size={14} /></button></div><div className="connected-fip-list">{!connectedFips.length && <p className="rail-empty">No providers connected. Request client consent to get started.</p>}{connectedFips.map((id) => institutions.find((item) => item.id === id)).filter(Boolean).map((fip) => <button key={fip.id} onClick={() => openFipDetail(fip)}><span className="connected-dot" /><strong>{fip.name}</strong><small>Connected</small><ChevronRight size={13} /></button>)}</div><button className="rail-link" onClick={openRequests}>View request tracker <ArrowRight size={14} /></button></section>
        <section className="rail-panel"><div className="rail-heading"><div><span className="rail-kicker">REQUEST ACTIVITY</span><h2>Recent requests</h2></div><button className="rail-link" onClick={openRequests}>All</button></div><div className="rail-request-list">{!syncRequests.length && <p className="rail-empty">No requests yet. New requests will appear here.</p>}{syncRequests.slice(0, 3).map((request) => <button key={request.id} onClick={openRequests}><span className={request.status === 'synced' ? 'request-dot request-dot-done' : 'request-dot'} /><span><strong>{request.fip}</strong><small>{request.category} · {request.channel || 'WhatsApp'} · {request.displayDate}</small></span><em>{request.status === 'synced' ? 'Synced' : 'Sent'}</em></button>)}</div></section>
      </aside>
    </div>
  )

  const manualField = (key, label, placeholder, type = 'text', required = false) => <label>{label}<input required={required} type={type} value={manual[key] ?? ''} step={type === 'number' ? 'any' : undefined} min={type === 'number' ? (key === 'investmentUnits' ? '0.00000001' : '0') : undefined} onChange={(event) => setManual({ ...manual, [key]: event.target.value })} placeholder={placeholder} /></label>

  const renderManualFields = () => {
    if (isCustomAsset(workflowCategory)) return <>{manualField('name', 'Investment name', 'e.g. Bronze sculpture', 'text', true)}<div className="form-grid-two">{manualField('investmentPrice', 'Investment value per unit (INR)', 'Purchase price per unit', 'number', true)}{manualField('investmentUnits', 'No. of units', 'Number of units', 'number', true)}{manualField('investmentDate', 'Date of investment', '', 'date', true)}{manualField('currentPrice', 'Current value per unit (INR)', 'Current price per unit', 'number', true)}</div><div className="investment-total"><span>Current investment value</span><strong>{formatRupees(Number(manual.investmentUnits || 0) * Number(manual.currentPrice || 0))}</strong><small>No. of units × current value per unit</small></div></>

    if (manualKind === 'liability') return <>
      {manualField('name', 'Loan / liability name', 'e.g. HDFC home loan', 'text', true)}
      <div className="form-grid-two">{manualField('lender', 'Lender', 'Bank or lender', 'text', true)}{manualField('outstanding', 'Outstanding amount (INR)', '₹', 'number', true)}{manualField('emi', 'Monthly EMI (INR)', '₹', 'number')}{manualField('rate', 'Interest rate (%)', 'e.g. 8.5', 'number')}{manualField('endDate', 'Loan end date', '', 'date')}{manualField('date', 'Statement date', '', 'date', true)}</div>
    </>
    if (workflowCategory === 'Mutual funds') return <>{manualField('name', 'Fund / scheme name', 'e.g. Parag Parikh Flexi Cap', 'text', true)}<div className="form-grid-two">{manualField('fundHouse', 'Fund house / AMC', 'e.g. PPFAS')}{manualField('folio', 'Folio number', 'Folio')}{manualField('units', 'Units', '0', 'number')}{manualField('nav', 'Current NAV', '₹', 'number')}{manualField('invested', 'Invested amount (INR)', '₹', 'number')}<label>Plan<select value={manual.plan} onChange={(event) => setManual({ ...manual, plan: event.target.value })}><option>Direct</option><option>Regular</option></select></label><label>Option<select value={manual.option} onChange={(event) => setManual({ ...manual, option: event.target.value })}><option>Growth</option><option>IDCW</option></select></label></div></>
    if (workflowCategory === 'Stocks') return <>{manualField('name', 'Company / ETF', 'e.g. HDFC Bank', 'text', true)}<div className="form-grid-two">{manualField('ticker', 'Ticker / ISIN', 'e.g. HDFCBANK')}{manualField('quantity', 'Quantity', '0', 'number', true)}{manualField('average', 'Average price (INR)', '₹', 'number')}</div></>
    if (workflowCategory === 'Real estate') return <>{manualField('name', 'Property name', 'e.g. 2BHK, Baner, Pune', 'text', true)}<div className="form-grid-two"><label>Property type<select value={manualMeta.propertyType} onChange={(event) => setManualMeta({ ...manualMeta, propertyType: event.target.value })}>{['Residential', 'Commercial', 'Land', 'Agricultural'].map((value) => <option key={value}>{value}</option>)}</select></label>{manualField('address', 'Location', 'Area, city')}{manualField('purchaseDate', 'Purchase date', '', 'date')}</div></>
    if (workflowCategory === 'Gold') return <>{manualField('name', 'Asset name', 'e.g. Gold necklace', 'text', true)}<div className="form-grid-two"><label>Category<select value={manual.goldCategory} onChange={(event) => setManual({ ...manual, goldCategory: event.target.value })}>{['Jewellery', 'Coins', 'Bars', 'Other'].map((value) => <option key={value}>{value}</option>)}</select></label><label>Carat<select value={manual.carat} onChange={(event) => setManual({ ...manual, carat: event.target.value })}>{[24, 22, 20, 18, 14, 9].map((value) => <option key={value} value={value}>{value}K</option>)}</select></label>{manualField('grams', 'Weight (grams)', 'Net gold weight', 'number', true)}{manualField('purchaseDate', 'Date of purchase', '', 'date', true)}{manualField('purchasePricePerGram', 'Purchase price per gram (INR)', '₹ per gram', 'number', true)}</div><div className="gold-valuation" aria-live="polite"><div className="gold-valuation-heading"><strong>Current gold valuation</strong><button type="button" disabled={goldPriceStatus === 'loading'} onClick={loadGoldPrice}><RefreshCw size={13} /> {goldPriceStatus === 'loading' ? 'Loading…' : 'Refresh price'}</button></div>{goldPriceStatus === 'ready' && goldQuote ? <><div><span>Latest {manual.carat}K price / gram</span><strong>{formatRupees(goldValue(1, manual.carat, goldQuote.pricePerGram24k))}</strong></div><div><span>Purchase value</span><strong>{formatRupees(Number(manual.grams || 0) * Number(manual.purchasePricePerGram || 0))}</strong></div><div><span>Estimated current value</span><strong>{formatRupees(goldValue(manual.grams, manual.carat, goldQuote.pricePerGram24k))}</strong></div><small>Rate updated {new Date(goldQuote.updatedAt).toLocaleString('en-IN')} · <a href="https://gold-api.com" target="_blank" rel="noreferrer">Gold API</a></small><small>Weight × carat-adjusted spot price. Excludes stones, taxes and making charges.</small></> : <p>{goldPriceStatus === 'error' ? 'The live price is unavailable. Retry to calculate and save the current value.' : 'Fetching the latest INR gold price…'}</p>}</div></>
    if (workflowCategory === 'AIF / PMS') return <>{manualField('name', 'Fund / manager', 'e.g. ASK PMS', 'text', true)}<div className="form-grid-two">{manualField('date', 'Statement date', '', 'date', true)}{manualField('invested', 'Invested amount (INR)', '₹', 'number')}</div></>
    if (workflowCategory === 'Insurance') return <><label>Insurance type<select value={manual.policyType} onChange={(event) => setManual({ ...manual, policyType: event.target.value, renewal: '', maturity: '', premiumPayingDate: '', vehicleNumber: '', destination: '' })}>{insuranceTypes.map((value) => <option key={value}>{value}</option>)}</select></label>{manualField('name', 'Policy name', 'Policy / plan name', 'text', true)}<div className="form-grid-two">{manualField('insurer', 'Insurer', 'Insurer name', 'text', true)}{manualField('policy', 'Policy number', 'Policy number')}{manualField('brokerCode', 'Broker code', 'Broker code')}{manualField('insuredPerson', manual.policyType === 'Health' ? 'Insured member(s)' : 'Insured person', 'Name of insured')}{manualField('policyStart', 'Policy start date', '', 'date')}
      {manual.policyType === 'Health' && <label>Health policy type<select value={manual.healthCoverType} onChange={(event) => setManual({ ...manual, healthCoverType: event.target.value })}><option>Individual</option><option>Family</option></select></label>}
      {manual.policyType === 'Motor' && manualField('vehicleNumber', 'Vehicle registration number', 'e.g. MH12 AB1234')}
      {manual.policyType === 'Travel' && manualField('destination', 'Travel destination', 'Country / region')}
      {manualField('cover', manual.policyType === 'Motor' ? 'Insured declared value (INR)' : 'Sum assured / cover (INR)', '₹', 'number')}{manualField('premium', 'Premium amount (INR)', '₹', 'number')}
      <label>Premium frequency<select value={manual.frequency} onChange={(event) => setManual({ ...manual, frequency: event.target.value })}>{['Monthly', 'Quarterly', 'Half-yearly', 'Annual', 'Single premium'].map((value) => <option key={value}>{value}</option>)}</select></label>
      {manual.policyType === 'Health' ? manualField('renewal', 'Renewal date', '', 'date') : <>{manualField('maturity', 'Maturity date', '', 'date')}{manualField('premiumPayingDate', 'Premium paying date', '', 'date')}</>}
      </div></>
    return <>{manualField('name', 'Asset name', `e.g. ${workflowCategory}`, 'text', true)}{manualField('source', 'Value / document source', 'e.g. client estimate, statement')}</>
  }

  return (
    <div className="app-shell">
      <main className="workspace-shell">
        <header className="workspace-topbar"><div className="brand-lockup"><span className="brand-mark">w</span><strong>wealthy</strong></div><div className="workspace-search"><Search size={16} /><span>Search clients, folios, transactions</span></div><button className="icon-button" aria-label="Notifications" onClick={() => notify('You are all caught up')}><Bell size={18} /></button><div className="partner-profile"><span>NS</span><strong>Nisha Sharma</strong><ChevronDown size={14} /></div></header>
        <div className="client-context"><div><span>Clients</span><ChevronRight size={13} /><span>{client.name}</span></div><button className="client-switch"><span className="client-avatar">AS</span><span><strong>{client.name}</strong><small>CRN {client.crn} · Relationship owner: {client.relationshipOwner}</small></span><ChevronDown size={15} /></button>{(populated || hasBalances || selectedCategory) && <button className="primary-action context-add" onClick={() => openFlow()}><Plus size={15} /> Add data</button>}</div>
        <nav className="client-tabs" role="tablist" aria-label="Client profile sections">{['Holdings', 'Net Worth', 'Transactions', 'Systematic plans', 'Reports', 'Documents'].map((tab) => <button key={tab} role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'selected-tab' : ''} onClick={() => { setActiveTab(tab); setSelectedCategory(null); setSelectedFipDetail(null) }}>{tab}</button>)}</nav>
        {activeTab === 'Net Worth' && selectedFipDetail ? <section className="fip-detail-view">{renderFipDetail()}</section> : activeTab === 'Net Worth' && selectedCategory ? <section className="detail-view"><div className="asset-detail-layout"><div className="asset-detail-main">{renderCategoryDetail()}</div>{renderAssetRail()}</div></section> : activeTab === 'Net Worth' ? <section className="net-worth-view">{!populated && !hasBalances ? renderFirstAssetEntry() : renderOverview()}</section> : <section className="other-tab"><h1>{activeTab}</h1><p>{activeTab} stays in the client profile. Select Net Worth to review the consolidated balance sheet.</p><button className="primary-action" onClick={() => setActiveTab('Net Worth')}>Open Net Worth</button></section>}
        <footer className="workspace-footer"><span>{populated ? 'Values in INR · Last consolidated 30 Sep 2026, 9:00 am' : 'Values in INR · Add records to build the client balance sheet'}</span><span><LockKeyhole size={12} /> Private client data</span></footer>
        <nav className="mobile-bottom-nav" aria-label="Main navigation"><button><Home size={18} /><span>Home</span></button><button><Sparkles size={18} /><span>Explore</span></button><button className="nav-selected"><Activity size={18} /><span>Portfolio</span></button><button onClick={openRequests}><FileText size={18} /><span>Orderbook</span></button><button onClick={() => notify('More options')}><MoreHorizontal size={18} /><span>More</span></button></nav>
      </main>

      {toast && <div className="toast-message"><CheckCircle2 size={16} />{toast}</div>}

      {modal === 'trend' && <NetWorthTrendDialog netWorth={netWorth} hidden={hidden} hasHistory={populated} onClose={() => setModal(null)} />}
      {modal && modal !== 'trend' && <div className="modal-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null) }}>
        {modal === 'add-data' && <section className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="add-title"><div className="dialog-top"><div><span className="dialog-kicker">{client.name.toUpperCase()}</span><h2 id="add-title">Add {workflowCategory}</h2><p>{activeFips.length ? selectedFip.name : workflowCategory} · choose how to add your records.</p></div><button className="close-button" aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></div><label className="modal-field">ASSET CLASS<select value={workflowCategory} onChange={(event) => openFlow(event.target.value)}>{availableCategories.map((value) => <option key={value}>{value}</option>)}</select></label><div className="action-options">{allowsSync(workflowCategory) && <button disabled={!institutions.some((item) => item.categories.includes(workflowCategory))} onClick={() => startSync(workflowCategory)}><span className="option-icon option-sync"><Link2 size={18} /></span><span><strong>Sync automatically</strong><small>{institutions.some((item) => item.categories.includes(workflowCategory)) ? 'Request consent for one selected FIP' : 'No sync provider available for this category'}</small></span><ChevronRight size={16} /></button>}<button onClick={() => startUpload(workflowCategory)}><span className="option-icon option-upload"><CloudUpload size={18} /></span><span><strong>Upload PDF or Excel</strong><small>Select a source and verify extracted data</small></span><ChevronRight size={16} /></button>{allowsManual(workflowCategory) && <button onClick={() => startManual(workflowCategory)}><span className="option-icon option-manual"><Plus size={18} /></span><span><strong>Add manually</strong><small>Enter fields specific to {workflowCategory.toLowerCase()}</small></span><ChevronRight size={16} /></button>}</div></section>}

        {modal === 'custom-asset' && <section className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="custom-title"><div className="dialog-top"><div><span className="dialog-kicker">NEW ASSET</span><h2 id="custom-title">Add an unlisted asset</h2><p>Create a separate category with its own records and detail page.</p></div><button className="close-button" aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></div><form className="manual-form" onSubmit={createCustomAsset}><label>Asset category name<input autoFocus required maxLength={80} value={customAssetName} onChange={(event) => setCustomAssetName(event.target.value)} placeholder="e.g. Artifacts" /></label><div className="dialog-actions"><button type="button" className="secondary-button" onClick={() => setModal('more-fips')}>Back</button><button className="primary-action" disabled={!customAssetName.trim() || customAssetName.trim().toLowerCase() === 'other asset'}>Continue to manual entry</button></div></form></section>}

        {modal === 'more-fips' && <section className="action-dialog more-dialog" role="dialog" aria-modal="true" aria-labelledby="more-title"><div className="dialog-top"><div><span className="dialog-kicker">AVAILABLE SOURCES</span><h2 id="more-title">All assets</h2><p>Select a source, then choose upload, sync or manual entry.</p></div><button className="close-button" aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></div><div className="more-dialog-section"><h3>Assets</h3><div className="manual-category-grid">{availableCategories.map((name) => <button key={name} onClick={() => openFlow(name)}>{name === 'Other asset' ? 'Other · add a new asset' : name}<ChevronRight size={14} /></button>)}</div></div><div className="more-dialog-section"><h3>Liabilities</h3><div className="manual-category-grid">{['Home loan', 'Car loan', 'Personal loan', 'Loan against securities', 'Overdraft', 'Credit card', 'Business loan', 'Tax payable'].map((name) => <button key={name} onClick={() => startManual(name)}>{name}<ChevronRight size={14} /></button>)}</div></div></section>}

        {modal === 'tracked' && <section className="action-dialog tracked-dialog" role="dialog" aria-modal="true" aria-labelledby="tracked-title"><div className="dialog-top"><div><span className="dialog-kicker">CLIENT BALANCE SHEET</span><h2 id="tracked-title">All assets & liabilities</h2><p>Select a category to see the underlying records.</p></div><button className="close-button" aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></div><div className="tracked-list"><h3>Assets</h3>{assets.map((item) => <button key={item.id} onClick={() => { setSelectedCategory(item.category); setModal(null) }}><span>{item.category}</span><strong>{hidden ? '••••' : formatCr(item.value)}</strong><ChevronRight size={14} /></button>)}<h3>Liabilities</h3>{liabilities.map((item) => <button key={item.id} onClick={() => { setSelectedCategory(item.category); setModal(null) }}><span>{item.category}</span><strong>{hidden ? '••••' : `− ${formatCr(item.value)}`}</strong><ChevronRight size={14} /></button>)}</div></section>}

        {modal === 'sync' && <section className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="sync-title"><div className="dialog-top"><div><span className="dialog-kicker">CLIENT CONSENT REQUIRED</span><h2 id="sync-title">Sync {workflowCategory}</h2><p>Choose one FIP. A separate request is sent for each provider.</p></div><button className="close-button" aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></div><div className="institution-list">{activeFips.map((fip) => { const Icon = fip.icon; return <button key={fip.id} className={`institution-choice ${providerId === fip.id ? 'institution-active' : ''}`} onClick={() => setProviderId(fip.id)}><span><Icon size={17} /></span><div><strong>{fip.name}</strong><small>{fip.detail}</small></div><i>{providerId === fip.id && <Check size={12} />}</i></button> })}</div><div className="delivery-choice"><strong>Send request via</strong>{['WhatsApp', 'Email'].map((channel) => <button key={channel} className={syncChannel === channel ? 'delivery-active' : ''} onClick={() => setSyncChannel(channel)}>{channel}</button>)}</div><div className="consent-note"><LockKeyhole size={14} /> The client receives this FIP-specific request. Data is fetched only after client approval.</div><div className="dialog-actions"><button className="secondary-button" onClick={() => setModal('add-data')}>Back</button><button className="primary-action" onClick={sendSyncRequest}>Send request <ArrowRight size={15} /></button></div></section>}

        {modal === 'upload' && <section className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="upload-title"><div className="dialog-top"><div><span className="dialog-kicker">UPLOAD FOR {client.name.toUpperCase()}</span><h2 id="upload-title">Upload {workflowCategory} file</h2><p>Select the FIP or document source, then add one statement.</p></div><button className="close-button" aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></div><label className="modal-field">FIP / DOCUMENT SOURCE<select value={activeFips.some((fip) => fip.id === providerId) ? providerId : documentSources[0].id} onChange={(event) => setProviderId(event.target.value)}>{(activeFips.length ? activeFips : documentSources).map((fip) => <option value={fip.id} key={fip.id}>{fip.name}</option>)}</select></label><div className="upload-format"><FileText size={15} /><span>{uploadTypes[workflowCategory] || `${workflowCategory} supporting document · PDF / Excel (.xlsx)`}</span><span>Up to 20 MB</span></div><button className="upload-zone" onClick={() => fileRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (event.dataTransfer.files[0]) stageUpload(event.dataTransfer.files[0]) }}><span><Upload size={21} /></span><strong>{uploadFile ? uploadFile.name : 'Choose a file or drag it here'}</strong><small>{uploadFile ? 'Ready for extraction review' : 'Only PDF and Excel (.xlsx) files are accepted'}</small><em>Browse files</em></button><input ref={fileRef} className="visually-hidden" type="file" accept=".pdf,.xlsx" onChange={(event) => { if (event.target.files?.[0]) stageUpload(event.target.files[0]) }} /><div className="consent-note"><LockKeyhole size={14} /> Extracted records are staged for review. They will not update net worth until applied.</div><div className="dialog-actions"><button className="secondary-button" onClick={() => setModal('add-data')}>Back</button><button className="primary-action" disabled={!uploadFile} onClick={() => setModal('review')}>Review extracted data <ArrowRight size={15} /></button></div></section>}

        {modal === 'manual' && <section className="action-dialog" role="dialog" aria-modal="true" aria-labelledby="manual-title"><div className="dialog-top"><div><span className="dialog-kicker">PARTNER-ENTERED · UNCONFIRMED</span><h2 id="manual-title">Add {workflowCategory.toLowerCase()}</h2><p>Fields are tailored to this {manualKind === 'liability' ? 'liability' : 'asset'}.</p></div><button className="close-button" aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></div><form className="manual-form" onSubmit={saveManual}>{manualKind === 'asset' && workflowCategory !== 'Insurance' && activeFips.length > 0 && <label className="modal-field">FIP / PROVIDER<select value={providerId} onChange={(event) => setProviderId(event.target.value)}>{activeFips.map((fip) => <option value={fip.id} key={fip.id}>{fip.name}</option>)}</select></label>}{renderManualFields()}{manualKind === 'asset' && !isCustomAsset(workflowCategory) && !['Insurance', 'Gold'].includes(workflowCategory) && manualField('amount', 'Current value (INR)', '₹', 'number', true)}{manualKind === 'asset' && !['Insurance', 'Gold'].includes(workflowCategory) && !isCustomAsset(workflowCategory) && <div className="form-grid-two">{manualField('date', 'As-of date', '', 'date', true)}<label>Owner<select value={manual.owner} onChange={(event) => setManual({ ...manual, owner: event.target.value })}><option>Amol Surve</option><option>Joint ownership</option><option>HUF / family entity</option></select></label>{manualField('share', 'Client ownership share (%)', '100', 'number', true)}</div>}{manualKind === 'liability' && <div className="form-grid-two"><label>Borrower / owner<select value={manual.owner} onChange={(event) => setManual({ ...manual, owner: event.target.value })}><option>Amol Surve</option><option>Joint ownership</option><option>HUF / family entity</option></select></label>{manualField('share', 'Client share (%)', '100', 'number', true)}</div>}<div className="consent-note"><ShieldCheck size={14} /> {workflowCategory === 'Gold' ? 'Gold weight and purchase details are partner-entered. Current value uses the latest available market rate.' : workflowCategory === 'Insurance' ? 'Policy details are saved for tracking. Cover and premiums are not added to net worth.' : manualKind === 'liability' ? 'Outstanding balance is recorded as a liability for the client share.' : isCustomAsset(workflowCategory) ? 'Current value is calculated from units and current price. Partner-entered values are marked unconfirmed.' : 'Only the client’s ownership share is included. Partner-entered values are marked unconfirmed.'}</div><div className="dialog-actions"><button type="button" className="secondary-button" onClick={() => setModal(isCustomAsset(workflowCategory) ? 'more-fips' : 'add-data')}>Back</button><button type="submit" className="primary-action" disabled={workflowCategory === 'Gold' && goldPriceStatus !== 'ready'}>Save unconfirmed record</button></div></form></section>}

        {modal === 'review' && <section className="action-dialog review-dialog" role="dialog" aria-modal="true" aria-labelledby="review-title"><div className="dialog-top"><div><span className="dialog-kicker">{selectedFip.name} · {workflowCategory}</span><h2 id="review-title">Verify extracted records</h2><p><FileCheck2 size={14} /> {uploadFile?.name} · not added until applied</p></div><button className="close-button" aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></div><div className="consent-note review-note"><ShieldCheck size={15} /> Records from other or unidentified clients are kept out of this client’s net worth.</div><div className="review-controls"><label><Search size={15} /><input value={reviewSearch} onChange={(event) => setReviewSearch(event.target.value)} placeholder="Search this file" /></label><button onClick={() => setReviewSearch('')}>Clear search</button></div><div className="review-tabs"><button className={reviewTab === 'Client' ? 'review-tab-active' : ''} onClick={() => setReviewTab('Client')}>For Amol <span>{reviewRows.filter((row) => row.owner === client.name && !row.excluded).length}</span></button><button className={reviewTab === 'Other clients' ? 'review-tab-active' : ''} onClick={() => setReviewTab('Other clients')}>Other / unidentified <span>{reviewRows.filter((row) => row.owner !== client.name && !row.excluded).length}</span></button></div><div className="review-bulk"><label><input type="checkbox" checked={visibleReviewRows.some((row) => row.owner === client.name) && visibleReviewRows.filter((row) => row.owner === client.name).every((row) => row.selected)} onChange={toggleAllVisible} /> Select visible</label><span>{selectedRows.length} selected · {hidden ? '••••' : formatCr(selectedValue)}</span><button disabled={!selectedRows.length} onClick={excludeSelected}>Exclude selected</button></div><div className="review-row-list">{visibleReviewRows.map((row) => <div className="review-row" key={row.id}><input type="checkbox" checked={row.selected} disabled={row.owner !== client.name} onChange={() => toggleReviewRow(row.id)} /><div><strong>{row.name}</strong><small>{row.category} · {row.owner} · {row.source}</small></div><strong>{hidden ? '••••' : formatCr(row.value)}</strong></div>)}{!visibleReviewRows.length && <p className="empty-review">No records in this view.</p>}</div><div className="excluded-note"><span>{reviewRows.filter((row) => row.excluded).length} excluded from this upload</span><span>Existing records are not deleted.</span></div><div className="dialog-actions"><button className="secondary-button" onClick={() => setModal('upload')}>Back</button><button className="primary-action" disabled={!selectedRows.length} onClick={applyUpload}>Apply {selectedRows.length} selected</button></div></section>}

        {modal === 'requests' && <section className="action-dialog request-dialog" role="dialog" aria-modal="true" aria-labelledby="requests-title"><div className="dialog-top"><div><span className="dialog-kicker">CLIENT DATA TRACKER</span><h2 id="requests-title">Sync requests</h2><p>Each row is one provider FIP request.</p></div><button className="close-button" aria-label="Close" onClick={() => setModal(null)}><X size={18} /></button></div><div className="request-tabs"><button className={requestsTab === 'Sent' ? 'active' : ''} onClick={() => setRequestsTab('Sent')}>Request sent <span>{syncRequests.filter((item) => item.status === 'pending').length}</span></button><button className={requestsTab === 'Synced' ? 'active' : ''} onClick={() => setRequestsTab('Synced')}>Synced successfully <span>{syncRequests.filter((item) => item.status === 'synced').length}</span></button></div><div className="request-filter"><Filter size={14} /><select value={requestFilter} onChange={(event) => setRequestFilter(event.target.value)}><option>All time</option><option>Today</option><option>This week</option><option>This month</option></select>{requestsTab === 'Sent' && <button disabled={!selectedRequestIds.length} onClick={deletePendingRequests}><X size={13} /> Delete selected</button>}</div><label className="request-select-all"><input type="checkbox" checked={visibleRequests.length > 0 && visibleRequests.every((item) => selectedRequestIds.includes(item.id))} onChange={() => setSelectedRequestIds(visibleRequests.every((item) => selectedRequestIds.includes(item.id)) ? [] : visibleRequests.map((item) => item.id))} /> Select all</label><div className="request-list">{visibleRequests.map((request) => <article className="request-record" key={request.id}><input type="checkbox" checked={selectedRequestIds.includes(request.id)} onChange={() => selectRequest(request.id)} /><span className="request-provider-icon"><Landmark size={16} /></span><div><strong>{request.fip}</strong><span>{request.category} · {request.channel || 'WhatsApp'}</span><small>{request.displayDate}</small></div><span className={request.status === 'synced' ? 'request-success' : 'request-pending'}>{request.status === 'synced' ? 'Synced' : 'Awaiting client'}</span>{request.status === 'pending' && <button className="mock-complete" onClick={() => markSynced(request.id)} title="Demo: mark as synced"><Check size={14} /></button>}</article>)}{!visibleRequests.length && <p className="empty-review">No requests in this tab.</p>}</div><div className="dialog-actions"><button className="secondary-button" onClick={() => setModal(null)}>Close</button><button className="primary-action" onClick={() => setModal('add-data')}><Plus size={14} /> New request</button></div></section>}
      </div>}
    </div>
  )
}

function EyeIcon({ hidden }) {
  return hidden ? <LockKeyhole size={16} /> : <span className="eye-glyph">◉</span>
}

export default function MockPreview() {
  const [mock, setMock] = useState('empty')
  return <><header className="mock-switcher"><strong>Wealthy · Net Worth</strong><div role="tablist" aria-label="Client mock scenarios">{[{ id: 'empty', label: 'Mock 1 · New sign-in, nothing synced' }, { id: 'populated', label: 'Mock 2 · Populated client' }].map((item) => <button key={item.id} id={`mock-tab-${item.id}`} role="tab" aria-selected={mock === item.id} tabIndex={mock === item.id ? 0 : -1} aria-controls="mock-panel" onKeyDown={(event) => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 'empty' : event.key === 'End' ? 'populated' : mock === 'empty' ? 'populated' : 'empty'; setMock(next); document.getElementById(`mock-tab-${next}`)?.focus() } }} onClick={() => setMock(item.id)}>{item.label}</button>)}</div></header><div id="mock-panel" role="tabpanel" aria-labelledby={`mock-tab-${mock}`}><NetWorthWorkspace key={mock} populated={mock === 'populated'} /></div></>
}