'use client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { MandiRecord } from '@/lib/types'
import { BiBarChart } from 'react-icons/bi'

export default function PriceChart({ records }: { records: MandiRecord[] }) {
    const data = records.slice(0, 8).map(r => ({
        name: r.market,
        'Price': r.modal_price,
    }))

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50 shadow-xs">
            <h3 className="font-semibold text-gray-800 mb-2 text-xs flex items-center gap-2">
                <BiBarChart size={14} /> Market Comparison
            </h3>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 60 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-45} textAnchor="end" height={100} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val) => `₹${Number(val).toLocaleString()}`} contentStyle={{fontSize: '12px'}} />
                    <Bar dataKey="Price" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
