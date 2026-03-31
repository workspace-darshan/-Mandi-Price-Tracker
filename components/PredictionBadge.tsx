import { Prediction } from '@/lib/types'
import { BiTrendingUp, BiTrendingDown } from 'react-icons/bi'

export default function PredictionBadge({ prediction, commodity }: {
    prediction: Prediction
    commodity: string
}) {
    const config = {
        UP: { bg: 'bg-gradient-to-br from-green-50 to-green-100', border: 'border-green-300', text: 'text-green-900', icon: BiTrendingUp, label: 'Bullish' },
        DOWN: { bg: 'bg-gradient-to-br from-red-50 to-red-100', border: 'border-red-300', text: 'text-red-900', icon: BiTrendingDown, label: 'Bearish' },
        STABLE: { bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100', border: 'border-yellow-300', text: 'text-yellow-900', icon: BiTrendingUp, label: 'Stable' },
    }
    const c = config[prediction.trend]
    const Icon = c.icon

    return (
        <div className={`${c.bg} border-2 ${c.border} rounded-lg p-3 ${c.text} shadow-xs`}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5">
                    <Icon size={18} />
                    <span className="font-bold text-sm">{commodity} {c.label}</span>
                </div>
                <span className="text-xs font-bold bg-white bg-opacity-70 px-2 py-0.5 rounded">{prediction.confidence}</span>
            </div>
            <p className="text-sm font-semibold mb-1">
                Predicted: <span className="text-base">₹{prediction.predicted_price.toLocaleString()}</span>
            </p>
            <p className="text-xs leading-relaxed opacity-90">{prediction.reason}</p>
        </div>
    )
}
