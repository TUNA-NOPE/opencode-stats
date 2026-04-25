# 📊 OpenCode Stats Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-orange?logo=bun)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A beautiful, real-time dashboard for visualizing your [OpenCode](https://opencode.ai) CLI usage statistics with intelligent cost comparisons across 20+ AI models.

![Dashboard Preview](https://via.placeholder.com/800x400?text=OpenCode+Stats+Dashboard)

## ✨ Features

### 📈 Analytics Dashboard
- **Session Overview**: Track total sessions, messages, and active days
- **Token Analytics**: Visual breakdown of input, output, and cache tokens with pie/bar charts
- **Cost Tracking**: Real-time cost monitoring with daily averages

### 💰 Cost Comparison
- Compare your usage costs across **20+ AI models** including:
  - Claude (Opus, Sonnet, Haiku)
  - Gemini (Pro, Flash)
  - GPT (5.5, 5.4, 5.3 Codex)
  - Kimi (K2.5, K2.6)
  - MiniMax (M2.7, M2.5)
  - Qwen, GLM, and more
- **Real pricing** from [opencode.ai/docs/zen/](https://opencode.ai/docs/zen/)
- Includes prompt caching prices (read/write)
- Savings calculations with visual indicators

### 🔧 Tool Usage Analysis
- Detailed breakdown of which tools you use most
- Interactive charts showing tool call patterns
- Complete ranked list of all 17+ tools
- Average calls per session metrics

### 🚀 Smart Caching
- **30-minute intelligent cache** - no slow reloads
- **Force refresh** button for instant updates
- Cache status indicator (shows "Cached 5 min ago" or "Live data")
- Automatic background refresh

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Runtime | [Bun](https://bun.sh/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |

## 📦 Installation

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- [OpenCode CLI](https://opencode.ai) installed and in your PATH

### Quick Start

```bash
# Clone the repository
git clone https://github.com/TUNA-NOPE/opencode-stats.git
cd opencode-stats

# Install dependencies
bun install

# Run the development server
bun run dev

# Open http://localhost:3000 in your browser
```

## 🎯 Usage

### Dashboard (`/`)
Your main analytics hub showing:
- Overview cards with key metrics
- Token distribution charts
- Tool usage visualizations
- Last updated timestamp with cache status

### Cost Compare (`/compare`)
Compare costs across models:
- Select your current usage
- See estimated costs for all 20+ models
- View savings percentages
- Detailed cost breakdown by category

### Tools (`/tools`)
Deep dive into tool usage:
- Interactive bar charts
- Complete tool rankings
- Call counts and percentages
- Session averages

## 🏗️ Architecture

```
opencode-stats/
├── app/
│   ├── api/stats/route.ts    # API: Executes opencode stats + caching
│   ├── compare/page.tsx       # Cost comparison page
│   ├── tools/page.tsx         # Tool analysis page
│   ├── page.tsx               # Main dashboard
│   └── layout.tsx             # Root layout with navigation
├── components/
│   ├── stats/                 # Stats visualization components
│   │   ├── OverviewCards.tsx
│   │   ├── TokenBreakdown.tsx
│   │   ├── ToolUsageChart.tsx
│   │   └── CostComparison.tsx
│   ├── ui/                    # shadcn/ui components
│   └── layout/Navigation.tsx  # Top navigation bar
├── lib/
│   ├── parsers.ts             # Parse opencode stats output
│   ├── pricing.ts             # Real pricing data from Zen
│   └── utils.ts               # Utility functions
├── types/index.ts             # TypeScript interfaces
└── README.md
```

## 📊 API

### `GET /api/stats`

Executes `opencode stats` command and returns parsed statistics.

**Query Parameters:**
- `refresh=true` - Force fresh data fetch (bypass cache)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "sessions": 1915,
      "messages": 41277,
      "days": 23
    },
    "cost": {
      "totalCost": 0.38,
      "avgCostPerDay": 0.02,
      "avgTokensPerSession": 1200000,
      "medianTokensPerSession": 353900
    },
    "tokens": {
      "input": 148300000,
      "output": 13600000,
      "cacheRead": 2216600000,
      "cacheWrite": 346100
    },
    "tools": [
      { "name": "read", "calls": 21249, "percentage": 37.3 },
      ...
    ]
  },
  "cachedAt": "2025-04-25T12:00:00.000Z",
  "isCached": true,
  "cacheAge": "5 minutes"
}
```

## 💵 Pricing Data Sources

All model pricing is sourced directly from [opencode.ai/docs/zen/](https://opencode.ai/docs/zen/) and includes:

- **Input/Output prices** per 1M tokens
- **Cached Read prices** (prompt caching)
- **Cached Write prices** (where applicable)
- **Context windows** for each model

Pricing is updated regularly to match OpenCode Zen's official rates.

## 🧪 Development

```bash
# Start development server
bun run dev

# Type check
bunx tsc --noEmit

# Build for production
bun run build

# Start production server
bun start

# Lint
bun run lint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenCode](https://opencode.ai) - The amazing CLI tool this dashboard visualizes
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Recharts](https://recharts.org/) - React charting library

---

Made with ❤️ for the OpenCode community
