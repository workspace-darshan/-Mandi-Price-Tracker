'use client'
import { useState, useEffect } from 'react'
import PriceCard from '@/components/PriceCard'
import PriceChart from '@/components/PriceChart'
import PredictionBadge from '@/components/PredictionBadge'
import { MandiRecord, Prediction } from '@/lib/types'
import { FiTrendingUp, FiFilter, FiList } from 'react-icons/fi'
import { HiOutlineShoppingCart } from 'react-icons/hi'
import { CiGrid42 } from "react-icons/ci";
import { BsTable } from 'react-icons/bs'

export default function Home() {
  const [records, setRecords] = useState<MandiRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [predLoading, setPredLoading] = useState(false)
  const [selectedCommodity, setSelectedCommodity] = useState<string>('')
  const [selectedState, setSelectedState] = useState<string>('All')
  const [filterCommodity, setFilterCommodity] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'compact' | 'table'>('compact')

  useEffect(() => {
    fetchAllPrices()
  }, [])

  async function fetchAllPrices() {
    setLoading(true)
    setPrediction(null)
    try {
      const res = await fetch('/api/mandi?limit=100')
      const data = await res.json()
      console.log("=================>", data)
      setRecords(data.records || [])
    } finally {
      setLoading(false)
    }
  }

  async function getPrediction(record: MandiRecord) {
    setPredLoading(true)
    setSelectedCommodity(record.commodity)
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commodity: record.commodity,
          currentPrice: record.modal_price,
          state: record.state,
        }),
      })
      const data = await res.json()
      setPrediction(data)
    } finally {
      setPredLoading(false)
    }
  }

  const avgPrice = records.length
    ? Math.round(records.reduce((s, r) => s + r.modal_price, 0) / records.length)
    : 0
  const maxPrice = records.length ? Math.max(...records.map(r => r.modal_price)) : 0
  const minPrice = records.length ? Math.min(...records.map(r => r.modal_price)) : 0

  // Get unique states and commodities
  const uniqueStates = ['All', ...new Set(records.map(r => r.state))].sort()
  const uniqueCommodities = ['All', ...new Set(records.map(r => r.commodity))].sort()

  // Filter records based on selected filters
  const filteredRecords = records.filter(r => {
    const matchState = selectedState === 'All' || r.state === selectedState
    const matchCommodity = filterCommodity === 'All' || r.commodity === filterCommodity
    return matchState && matchCommodity
  })

  // Calculate stats for filtered records
  const filteredAvgPrice = filteredRecords.length
    ? Math.round(filteredRecords.reduce((s, r) => s + r.modal_price, 0) / filteredRecords.length)
    : 0
  const filteredMaxPrice = filteredRecords.length ? Math.max(...filteredRecords.map(r => r.modal_price)) : 0
  const filteredMinPrice = filteredRecords.length ? Math.min(...filteredRecords.map(r => r.modal_price)) : 0

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Glassmorphism Header */}
      <div className="border-b border-white/20 shadow-sm bg-white/75 backdrop-blur-md">
        <div className="px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
              <HiOutlineShoppingCart className="text-white" size={18} />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base">Mandi Bhav</h1>
              <p className="text-xs text-gray-500 leading-none">Live Market Prices</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 flex flex-col gap-3">
        {loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-gray-200/50 text-center">
            <p className="text-sm text-gray-600">🌾 Loading market data...</p>
          </div>
        )}

        {/* Filter Box */}
        {records.length > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-2">
              <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                <FiFilter size={14} /> Filter Markets
              </p>
              <div className="flex gap-1 bg-gray-100 rounded-md p-0.5">
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-1.5 rounded transition-all duration-200 cursor-pointer ${viewMode === 'compact'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  title="Compact View"
                >
                  <CiGrid42 size={14} />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-1.5 rounded transition-all duration-200 cursor-pointer ${viewMode === 'table'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                  title="Table View"
                >
                  <BsTable size={14} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="col-span-1">
                <label className="text-xs font-semibold text-gray-700 mb-0.5 block cursor-pointer">State</label>
                <select
                  value={selectedState}
                  onChange={e => setSelectedState(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white cursor-pointer"
                >
                  {uniqueStates.map(s => <option key={s} className="text-gray-900">{s}</option>)}
                </select>
              </div>
              <div className="col-span-1">
                <label className="text-xs font-semibold text-gray-700 mb-0.5 block cursor-pointer">Commodity</label>
                <select
                  value={filterCommodity}
                  onChange={e => setFilterCommodity(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white cursor-pointer"
                >
                  {uniqueCommodities.map(c => <option key={c} className="text-gray-900">{c}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {filteredRecords.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { label: 'Avg', value: filteredAvgPrice, color: 'bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 border-blue-200' },
              { label: 'Min', value: filteredMinPrice, color: 'bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-700 border-cyan-200' },
              { label: 'Max', value: filteredMaxPrice, color: 'bg-gradient-to-br from-orange-50 to-orange-100 text-orange-700 border-orange-200' },
            ].map(stat => (
              <div key={stat.label} className={`${stat.color} rounded-lg p-2 text-center border shadow-xs`}>
                <p className="text-lg font-bold">₹{stat.value.toLocaleString()}</p>
                <p className="text-xs mt-0.5 font-semibold opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Chart */}
        {filteredRecords.length > 0 && <PriceChart records={filteredRecords} />}

        {/* Prediction */}
        {predLoading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 text-center text-sm text-gray-600 border border-gray-200/50 shadow-xs\">\n            🤖 Generating prediction...\n          </div>)}
        {prediction && !predLoading && (
          <PredictionBadge prediction={prediction} commodity={selectedCommodity} />
        )}

        {/* Price Cards */}
        {filteredRecords.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-2.5 flex items-center gap-2">
              <FiTrendingUp size={16} /> {filteredRecords.length} Markets
              {(selectedState !== 'All' || filterCommodity !== 'All') && (
                <span className="text-xs font-normal text-gray-500">({selectedState !== 'All' && selectedState} {filterCommodity !== 'All' && filterCommodity})</span>
              )}
            </h2>
            {viewMode === 'compact' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
                {filteredRecords.map((r, i) => (
                  <PriceCard key={i} record={r} onPredict={getPrediction} />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-xs">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-2 sm:px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Commodity</th>
                      <th className="px-2 sm:px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Market</th>
                      <th className="px-2 sm:px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">District</th>
                      <th className="px-2 sm:px-3 py-2 text-right font-semibold text-gray-700 whitespace-nowrap">Modal</th>
                      {/* <th className="px-2 sm:px-3 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Unit</th> */}
                      <th className="px-2 sm:px-3 py-2 text-right font-semibold text-gray-700 whitespace-nowrap">Min</th>
                      <th className="px-2 sm:px-3 py-2 text-right font-semibold text-gray-700 whitespace-nowrap">Max</th>
                      <th className="px-2 sm:px-3 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRecords.map((r, i) => (
                      <tr key={i} className="hover:bg-blue-50 transition-colors">
                        <td className="px-2 sm:px-3 py-2 font-semibold text-gray-900 whitespace-nowrap">{r.commodity}</td>
                        <td className="px-2 sm:px-3 py-2 text-gray-700 whitespace-nowrap">{r.market}</td>
                        <td className="px-2 sm:px-3 py-2 text-gray-700 whitespace-nowrap">{r.district}</td>
                        <td className="px-2 sm:px-3 py-2 text-right font-bold text-blue-600 whitespace-nowrap">₹{r.modal_price.toLocaleString()}</td>
                        {/* <td className="px-2 sm:px-3 py-2 text-left text-gray-600 text-xs whitespace-nowrap">{r.unit}</td> */}
                        <td className="px-2 sm:px-3 py-2 text-right text-red-600 font-semibold whitespace-nowrap">₹{r.min_price.toLocaleString()}</td>
                        <td className="px-2 sm:px-3 py-2 text-right text-green-600 font-semibold whitespace-nowrap">₹{r.max_price.toLocaleString()}</td>
                        <td className="px-2 sm:px-3 py-2 text-center whitespace-nowrap">
                          <button
                            onClick={() => getPrediction(r)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold rounded transition-colors cursor-pointer"
                          >
                            Predict
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {!loading && filteredRecords.length === 0 && records.length > 0 && (
          <div className="text-center py-6 text-gray-500">
            <p className="text-2xl mb-1">🔍</p>
            <p className="text-sm font-medium">No data found</p>
          </div>
        )}
      </div>
    </main>
  )
}
