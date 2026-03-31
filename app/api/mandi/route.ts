import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state') || ''
    const commodity = searchParams.get('commodity') || ''
    const limit = searchParams.get('limit') || '20'

    // ✅ KEY FIX: filter bracket encode na ho isliye manually string banao
    const parts = [
        `api-key=${process.env.DATAGOV_API_KEY}`,
        `format=json`,
        `limit=${limit}`,
    ]

    // Commodity filter sirf tab add karo jab value ho (agar default 'All' select hai to fetch sab)
    if (commodity) {
        parts.push(`filters[commodity]=${commodity}`)
    }

    // State filter sirf tab add karo jab value ho
    if (state) {
        parts.push(`filters[state]=${state}`)
    }

    const apiUrl = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?${parts.join('&')}`

    try {
        const res = await fetch(apiUrl, { cache: 'no-store' })
        const data = await res.json()

        if (!data.records || data.records.length === 0) {
            return NextResponse.json({ records: [], total: 0 })
        }

        const records = data.records.map((r: any) => ({
            market: r.market,
            district: r.district,
            state: r.state,
            commodity: r.commodity,
            variety: r.variety,
            min_price: Number(r.min_price),
            max_price: Number(r.max_price),
            modal_price: Number(r.modal_price),
            unit: r.unit || 'per quintal',
            date: r.arrival_date,
        }))

        return NextResponse.json({ records, total: data.total })
    } catch (error) {
        console.error('❌ Error:', error)
        return NextResponse.json({ error: 'API fetch failed' }, { status: 500 })
    }
}