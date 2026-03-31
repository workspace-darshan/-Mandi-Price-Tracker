# 🌾 मंडी भाव — Mandi Price Tracker

> Real-time agricultural commodity prices from 3,000+ Indian mandis — powered by Government of India's open data & AI-driven price predictions.

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?style=flat&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 📸 Preview

> Live App → **[mandi-tracker.vercel.app](https://mandi-price-track.vercel.app)** *(update after deploy)*

![App Screenshot](./public/preview.png) *(add screenshot after deploy)*

---

## 🚨 Problem Statement

India has **120 million+ small farmers**, yet most of them:
- Don't know **today's market price** of their crop before selling
- Rely on **middlemen** who exploit information asymmetry
- Have **no way to predict** if prices will rise or fall in the coming week

This leads to farmers selling at suboptimal prices — directly impacting their income.

---

## ✅ Solution

**मंडी भाव** is a bilingual (Hindi + English) web app that gives farmers:

| Feature | Description |
|---|---|
| 📊 **Live Mandi Prices** | Real-time data from India's official Agmarknet database via data.gov.in |
| 🔍 **Filter by State & Crop** | Search across Gujarat, Maharashtra, Punjab, UP, MP, Haryana, Rajasthan |
| 📈 **Price Chart** | Visual bar chart comparing modal prices across mandis |
| 🤖 **AI Price Prediction** | 7-day trend forecast (UP/DOWN/STABLE) with reason in Hindi — powered by HuggingFace |
| 📱 **Mobile-first UI** | Designed for low-end smartphones used in rural India |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS |
| **Data API** | [data.gov.in](https://data.gov.in) — Ministry of Agriculture, Govt. of India |
| **AI Prediction** | HuggingFace Inference API (Mistral-7B-Instruct) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Deployment** | Vercel (free tier) |

---

## 📂 Project Structure

```
mandi-tracker/
├── app/
│   ├── page.tsx                  # Main homepage
│   ├── layout.tsx                # Root layout
│   └── api/
│       ├── mandi/route.ts        # Proxy for data.gov.in API
│       └── predict/route.ts      # HuggingFace AI prediction
├── components/
│   ├── PriceCard.tsx             # Individual mandi price card
│   ├── PriceChart.tsx            # Bar chart comparison
│   └── PredictionBadge.tsx       # AI prediction result badge
└── lib/
    └── types.ts                  # TypeScript interfaces
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Free API keys (see below)

### 1. Clone the repo

```bash
git clone https://github.com/workspace-darshan/Mandi-Price-Tracker.git
cd Mandi-Price-Tracker
npm install
```

### 2. Get your FREE API Keys

**data.gov.in API Key:**
1. Go to [data.gov.in](https://data.gov.in) → Register (free)
2. Login → Click your profile → **My Account → API Keys**
3. Copy your key

**HuggingFace API Key:**
1. Go to [huggingface.co](https://huggingface.co) → Register (free)
2. Profile → Settings → **Access Tokens**
3. Create new token (Read permission) → Copy

### 3. Setup environment variables

Create a `.env.local` file in the project root:

```env
DATAGOV_API_KEY=your_datagov_api_key_here
HF_API_KEY=hf_your_huggingface_token_here
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deploy on Vercel (Free)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/workspace-darshan/Mandi-Price-Tracker)

1. Click the button above OR go to [vercel.com](https://vercel.com) → New Project → Import this repo
2. Add environment variables:
   - `DATAGOV_API_KEY`
   - `HF_API_KEY`
3. Click **Deploy** → Done in 2 minutes ✅

---

## 📡 API Reference

### `GET /api/mandi`

Fetches live mandi prices from data.gov.in.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `state` | string | Gujarat | Filter by Indian state |
| `commodity` | string | Wheat | Filter by crop name |
| `limit` | number | 20 | Max records to return |

**Example:**
```
GET /api/mandi?state=Punjab&commodity=Wheat&limit=10
```

**Response:**
```json
{
  "records": [
    {
      "market": "Amritsar APMC",
      "district": "Amritsar",
      "state": "Punjab",
      "commodity": "Wheat",
      "variety": "Dara",
      "min_price": 2400,
      "max_price": 2600,
      "modal_price": 2500,
      "date": "31/03/2026"
    }
  ],
  "total": 156
}
```

---

### `POST /api/predict`

Returns AI-generated 7-day price trend prediction.

**Request body:**
```json
{
  "commodity": "Wheat",
  "currentPrice": 2500,
  "state": "Punjab"
}
```

**Response:**
```json
{
  "trend": "UP",
  "predicted_price": 2650,
  "reason": "रबी सीजन के बाद आपूर्ति कम होगी",
  "confidence": "MEDIUM"
}
```

---

## 💡 Supported States & Crops

**States:** Gujarat, Maharashtra, Punjab, Haryana, Uttar Pradesh, Rajasthan, Madhya Pradesh, Chattisgarh

**Crops:** Wheat, Rice, Onion, Tomato, Potato, Cotton, Soyabean, Maize

---

## 🗺️ Roadmap

- [ ] Add more states and commodities
- [ ] SMS alerts when price crosses threshold (Twilio free tier)
- [ ] PWA support for offline use in rural areas
- [ ] Voice input in Hindi using Web Speech API
- [ ] Historical price trends (last 30 days)
- [ ] WhatsApp Bot integration

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Darshan** — [@workspace-darshan](https://github.com/workspace-darshan)

---

## 🙏 Acknowledgements

- [data.gov.in](https://data.gov.in) — Ministry of Agriculture & Farmers Welfare, Government of India
- [Agmarknet](https://agmarknet.gov.in) — Agricultural Marketing Information Network
- [HuggingFace](https://huggingface.co) — Open source AI models
- Built with ❤️ for Indian farmers

---

<p align="center">
  <strong>⭐ Star this repo if you found it useful!</strong><br/>
  <sub>Made for Smart India Hackathon 2025 & social impact</sub>
</p>
