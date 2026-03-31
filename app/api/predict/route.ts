import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { commodity, currentPrice, state } = await request.json()

  // HuggingFace text generation — free tier
  const prompt = `You are an agricultural price analyst for India.
Current ${commodity} modal price in ${state}: ₹${currentPrice} per quintal.
Based on seasonal patterns and market trends, predict if price will go UP, DOWN, or STABLE in next 7 days.
Reply in JSON only: {"trend": "UP/DOWN/STABLE", "predicted_price": number, "reason": "short reason in Hindi", "confidence": "HIGH/MEDIUM/LOW"}`

  try {
    const res = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 200, temperature: 0.3 },
        }),
      }
    )

    const result = await res.json()
    const text = result[0]?.generated_text || ''

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]))
    }

    // Fallback if parsing fails
    return NextResponse.json({
      trend: 'STABLE',
      predicted_price: currentPrice,
      reason: 'डेटा अपर्याप्त है',
      confidence: 'LOW',
    })
  } catch {
    return NextResponse.json({
      trend: 'STABLE',
      predicted_price: currentPrice,
      reason: 'पूर्वानुमान उपलब्ध नहीं',
      confidence: 'LOW',
    })
  }
}
