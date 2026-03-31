'use client'
import { MandiRecord } from '@/lib/types'
import { BiTrendingUp } from 'react-icons/bi'

export default function PriceCard({ record, onPredict }: {
  record: MandiRecord
  onPredict: (record: MandiRecord) => void
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer h-full flex flex-col">
      <div className="mb-2">
        <h3 className="font-bold text-gray-900 text-xs leading-tight mb-0.5">{record.commodity}</h3>
        <p className="text-xs text-blue-600 font-bold">
          ₹{record.modal_price.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 leading-tight">{record.unit}</p>
        <p className="text-xs text-gray-500 leading-tight mt-0.5">{record.market}</p>
      </div>

      <div className="grid grid-cols-2 gap-1 mb-2 flex-1">
        <div className="bg-red-50 border border-red-200 px-1.5 py-1 rounded">
          <p className="text-xs text-red-600 font-bold">₹{record.min_price.toLocaleString()}</p>
        </div>
        <div className="bg-green-50 border border-green-200 px-1.5 py-1 rounded">
          <p className="text-xs text-green-600 font-bold">₹{record.max_price.toLocaleString()}</p>
        </div>
      </div>

      <button
        onClick={() => onPredict(record)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-2 rounded text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
      >
        <BiTrendingUp size={12} /> Predict
      </button>
    </div>
  )
}
