# 📊 OpenCode Stats Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Bun](https://img.shields.io/badge/Bun-Runtime-orange?logo=bun)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A beautiful, real-time dashboard for visualizing your [OpenCode](https://opencode.ai) CLI usage statistics with intelligent cost comparisons across 24+ AI models.

![Dashboard Preview](https://via.placeholder.com/800x400?text=OpenCode+Stats+Dashboard)

## 🎥 Demo Video

[Watch Demo](https://via.placeholder.com/800x450?text=Demo+Video+Placeholder) *(Coming Soon)*

---

## ✨ What This Does

This dashboard connects to your local OpenCode CLI installation, fetches your usage statistics, and presents them in a beautiful, easy-to-understand interface. You can:

- 📈 **See your usage patterns** - Sessions, messages, tokens consumed
- 💰 **Compare costs** across 24+ AI models with real pricing from OpenCode Zen
- 🔧 **Analyze tool usage** - Which tools you use most, how often, and when
- 🚀 **Track spending** - Total cost, daily averages, and projections

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Prerequisites

Make sure you have:
- [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`)
- [OpenCode CLI](https://opencode.ai) installed and working (`opencode --version`)

### Step 2: Clone & Run

```bash
# Clone the repository
git clone https://github.com/TUNA-NOPE/opencode-stats.git
cd opencode-stats

# Install dependencies (30 seconds)
bun install

# Start the dashboard (5 seconds)
bun run dev

# Open http://localhost:3000 in your browser
```

**That's it!** The dashboard will automatically connect to your OpenCode installation and display your stats.

---

## 🎯 How to Use

### 1️⃣ Dashboard Page (`/`)

Your main analytics hub showing:

**Overview Cards**
- **Total Sessions**: How many OpenCode sessions you've had
- **Total Messages**: Messages sent/received across all sessions  
- **Days Active**: Number of days you've used OpenCode
- **Total Cost**: Your total spending with daily average

**Token Analytics**
- **Pie Chart**: Visual breakdown of token types (Input, Output, Cache Read, Cache Write)
- **Bar Chart**: Compare token usage across categories
- **Summary Cards**: Exact numbers with percentages and total

**Tool Usage**
- **Top 10 Tools**: Horizontal bar chart showing most-used tools
- **All Tools Badge Cloud**: Every tool with call counts

**Cache Status**
- Shows "Cached 5 min ago" or "Live data"
- Use the **"Force Refresh"** button to get fresh data instantly

### 2️⃣ Cost Compare Page (`/compare`)

Compare what your usage would cost on different models:

**Current Usage Summary**
- Shows your current total cost
- Displays sessions and token count

**Comparison Table**
| Column | What It Shows |
|--------|---------------|
| Model | The AI model name |
| Provider | Who provides it (OpenCode Zen, etc.) |
| Input/1M | Cost per 1 million input tokens |
| Output/1M | Cost per 1 million output tokens |
| Est. Cost | What YOUR usage would cost on this model |
| vs Current | Savings % or extra cost indicator |

**How to Read It**
- 🟢 **Green badge**: "Save 45%" - This model is cheaper than your current usage
- 🔴 **Red badge**: "+120%" - This model costs more
- ⚪ **Gray badge**: "Similar" - Roughly the same cost

**Cost Breakdown Cards**
Shows top 3 cheapest models with detailed breakdown:
- Input cost: Tokens you send to the model
- Output cost: Tokens the model generates
- Cache cost: Prompt caching (read/write)
- Total: Sum of all costs

### 3️⃣ Tools Page (`/tools`)

Deep dive into your OpenCode tool usage:

**Summary Cards**
- **Total Tool Calls**: Sum of all tool executions
- **Avg Calls/Session**: Average tools used per session
- **Most Used Tool**: Your #1 tool with count and percentage

**Visual Charts**
- **Horizontal Bar Chart**: Top 10 tools ranked by usage
- **Badge Cloud**: All tools with call counts and percentages

**Complete Tool Breakdown**
- Ranked list (#1, #2, #3...)
- Tool names in code blocks
- Call counts (e.g., "21,249 calls")
- Percentage badges
- Separated by visual dividers

---

## 🛠️ How It Works

### Data Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Your Browser   │────▶│  Next.js Server  │────▶│  opencode CLI   │
│  (localhost)    │     │  (API Route)     │     │  (stats cmd)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌──────────────────┐            │
         │              │  Parser Module   │            │
         │              │  (lib/parsers.ts)│            │
         │              └──────────────────┘            │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      30-Minute Cache                             │
│  ┌─────────────┐    ┌─────────────┐    ┌────────────────────┐ │
│  │ Cached Data │ or │ Fresh Data  │───▶│ Dashboard Display  │ │
│  │ (if <30min) │    │ (if expired)│    │ (React Components) │ │
│  └─────────────┘    └─────────────┘    └────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Technical Architecture

**Backend (Next.js API Routes)**
- `app/api/stats/route.ts`: Executes `opencode stats` command
- Parses terminal output using regex patterns
- Implements 30-minute in-memory cache
- Returns structured JSON with cache metadata

**Frontend (React + TypeScript)**
- **Dashboard Page**: OverviewCards, TokenBreakdown, ToolUsageChart
- **Compare Page**: CostComparison table with real pricing
- **Tools Page**: Tool rankings and detailed breakdowns
- **Navigation**: Client-side routing with Next.js Link

**Data Parsing**
The parser (`lib/parsers.ts`) handles the `opencode stats` terminal output:
- Extracts sections (Overview, Cost & Tokens, Tool Usage)
- Handles number formats (e.g., "148.3M" → 148300000)
- Parses currency (e.g., "$0.38" → 0.38)
- Extracts tool usage with regex patterns

**Pricing Data**
- Stored in `lib/pricing.ts`
- 24 models with real prices from [opencode.ai/docs/zen/](https://opencode.ai/docs/zen/)
- Includes prompt caching prices (read/write)
- Updated manually when OpenCode changes pricing

---

## 📊 Understanding Your Stats

### Tokens Explained

**Input Tokens**: Text you send TO the AI
- Your prompts, messages, code snippets
- File contents when using `read` tool
- Context from previous messages

**Output Tokens**: Text the AI sends BACK
- Generated code, explanations, answers
- Usually more expensive than input

**Cache Read**: Reusing previous context
- When OpenCode reuses cached prompts
- Much cheaper than fresh input (often 10x cheaper!)
- Shown in your stats as "Cache Read"

**Cache Write**: Storing context for reuse
- One-time cost to cache a prompt
- Subsequent reads are cheap
- Usually 10-20% of input cost

### Cost Calculation

The dashboard calculates:
```
Total Cost = Input Cost + Output Cost + Cache Read Cost + Cache Write Cost

Where:
- Input Cost = (input_tokens / 1,000,000) × input_price
- Output Cost = (output_tokens / 1,000,000) × output_price  
- Cache Read Cost = (cache_read_tokens / 1,000,000) × cached_read_price
- Cache Write Cost = (cache_write_tokens / 1,000,000) × cached_write_price
```

### Tools Explained

OpenCode uses various tools to help you:

| Tool | What It Does | Example |
|------|--------------|---------|
| `read` | Reads files from your project | Opening a code file |
| `write` | Creates or overwrites files | Creating a new component |
| `edit` | Modifies existing files | Changing a function |
| `bash` | Runs shell commands | `git status`, `npm install` |
| `grep` | Searches file contents | Finding all `console.log` |
| `glob` | Lists files matching pattern | All `*.tsx` files |
| `task` | Delegates work to subagents | Parallel code reviews |

---

## 🏗️ Project Structure

```
AiUsege/
├── 📁 app/                          # Next.js App Router
│   ├── 📄 api/stats/route.ts       # API: Executes opencode stats + caching
│   ├── 📄 compare/page.tsx          # Cost comparison page
│   ├── 📄 tools/page.tsx            # Tool analysis page
│   ├── 📄 page.tsx                  # Main dashboard
│   └── 📄 layout.tsx                # Root layout with navigation
│
├── 📁 components/
│   ├── 📁 stats/                    # Stats visualization components
│   │   ├── 📄 OverviewCards.tsx     # 4 stat cards (sessions, messages, etc.)
│   │   ├── 📄 TokenBreakdown.tsx    # Pie/bar charts for tokens
│   │   ├── 📄 ToolUsageChart.tsx    # Tool usage visualizations
│   │   └── 📄 CostComparison.tsx    # Model comparison table
│   ├── 📁 ui/                       # shadcn/ui components (Button, Card, etc.)
│   └── 📁 layout/
│       └── 📄 Navigation.tsx        # Top navigation bar
│
├── 📁 lib/                          # Utilities
│   ├── 📄 parsers.ts                # Parse opencode stats terminal output
│   ├── 📄 pricing.ts                # 24 models with real pricing
│   └── 📄 utils.ts                  # Utility functions (cn helper)
│
├── 📁 types/
│   └── 📄 index.ts                  # TypeScript interfaces
│
├── 📁 docs/
│   └── 📁 plans/                    # Design & implementation docs
│
├── 📄 README.md                     # This file
├── 📄 package.json                  # Dependencies
├── 📄 next.config.ts                # Next.js config (standalone output)
└── 📄 .gitignore                    # Git ignore rules
```

---

## 📡 API Reference

### `GET /api/stats`

Fetches OpenCode statistics with intelligent caching.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `refresh` | boolean | Force fresh data fetch (bypasses cache) |

Example: `GET /api/stats?refresh=true`

#### Response Format

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
      { "name": "bash", "calls": 13108, "percentage": 23.0 },
      { "name": "edit", "calls": 9730, "percentage": 17.1 }
    ]
  },
  "cachedAt": "2025-04-25T12:00:00.000Z",
  "isCached": true,
  "cacheAge": "5 minutes"
}
```

#### Cache Behavior

- **Cache Duration**: 30 minutes
- **Cache Storage**: In-memory (resets on server restart)
- **Force Refresh**: Add `?refresh=true` to bypass cache
- **Cache Status**: Returned in `isCached` and `cacheAge` fields

---

## 💵 Pricing Data

All model pricing is sourced directly from **[opencode.ai/docs/zen/](https://opencode.ai/docs/zen/)**.

### Current Models (24 Total)

**Claude Models**
| Model | Input | Output | Cache Read | Cache Write |
|-------|-------|--------|------------|-------------|
| Claude Opus 4.6 | $5.00 | $25.00 | $0.50 | $6.25 |
| Claude Opus 4.1 | $15.00 | $75.00 | $1.50 | $18.75 |
| Claude Sonnet 4.6 | $3.00 | $15.00 | $0.30 | $3.75 |
| Claude Sonnet 4.5 | $3.00 | $15.00 | $0.30 | $3.75 |
| Claude Haiku 4.5 | $1.00 | $5.00 | $0.10 | $1.25 |
| Claude Haiku 3.5 | $0.80 | $4.00 | $0.08 | $1.00 |

**GPT Models**
| Model | Input | Output | Cache Read |
|-------|-------|--------|------------|
| GPT 5.5 | $5.00 | $30.00 | $0.50 |
| GPT 5.4 | $2.50 | $15.00 | $0.25 |
| GPT 5.4 Mini | $0.75 | $4.50 | $0.075 |
| GPT 5.4 Nano | $0.20 | $1.25 | $0.02 |
| GPT 5.3 Codex | $1.75 | $14.00 | $0.175 |

**More Models**: Gemini, Kimi, MiniMax, Qwen, GLM, Big Pickle

*Prices are per 1 million tokens. Last updated from OpenCode Zen docs.*

---

## 🧪 Development

### Available Scripts

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Start production server
bun start

# Type check
bunx tsc --noEmit

# Lint
bun run lint
```

### Adding New Models

To add a new model to the cost comparison:

1. Edit `lib/pricing.ts`
2. Add to `DEFAULT_MODELS` array:

```typescript
{
  id: 'your-model-id',
  name: 'Your Model Name',
  provider: 'Provider Name',
  inputPrice: 2.50,        // per 1M tokens
  outputPrice: 10.00,       // per 1M tokens
  cachedReadPrice: 0.25,   // per 1M tokens
  cachedWritePrice: 0.50,  // per 1M tokens
  contextWindow: 128000
}
```

3. The model will automatically appear in the cost comparison table

---

## 🐛 Troubleshooting

### "Failed to fetch stats" Error

**Cause**: OpenCode CLI is not in PATH or not installed

**Solution**:
```bash
# Check if opencode is installed
opencode --version

# If not installed, install it
curl -fsSL https://opencode.ai/install | bash

# Make sure it's in your PATH
which opencode
```

### Dashboard Shows Old Data

**Cause**: Data is cached for 30 minutes

**Solution**: Click the **"Force Refresh"** button on any page to fetch fresh data

### Port 3000 Already in Use

**Solution**:
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
bun run dev --port 3001
```

### Build Errors

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules bun.lock
bun install

# Rebuild
bun run build
```

---

## ❓ FAQ

**Q: Is my data sent anywhere?**  
A: No. The dashboard runs entirely on your local machine. It only executes `opencode stats` locally and displays the results in your browser.

**Q: Can I use this without OpenCode CLI?**  
A: No, this dashboard requires the OpenCode CLI to be installed and configured.

**Q: How often should I refresh?**  
A: The data is cached for 30 minutes. You only need to force refresh if you want to see the absolute latest stats after a heavy coding session.

**Q: Why are some models missing from the comparison?**  
A: We only include models from OpenCode Zen that have published pricing. If a model isn't listed, we don't have pricing data for it yet.

**Q: Can I add my own models?**  
A: Yes! Edit `lib/pricing.ts` and add your model with pricing. It will automatically appear in the comparison table.

**Q: How accurate is the cost comparison?**  
A: Very accurate! We use real pricing data from OpenCode Zen docs. The only estimation is cache write costs, which are small anyway.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/AmazingFeature`
3. **Commit** your changes: `git commit -m 'Add some AmazingFeature'`
4. **Push** to the branch: `git push origin feature/AmazingFeature`
5. **Open** a Pull Request

### Ideas for Contributions

- [ ] Add export to CSV/JSON
- [ ] Add historical trends over time
- [ ] Add dark mode toggle
- [ ] Add more visualization options
- [ ] Add model filtering/search
- [ ] Add cost projections/forecasts
- [ ] Add session history timeline

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **[OpenCode](https://opencode.ai)** - The amazing CLI tool this dashboard visualizes
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible UI components
- **[Recharts](https://recharts.org/)** - React charting library
- **[Next.js](https://nextjs.org/)** - The React framework for production
- **[Bun](https://bun.sh/)** - Fast JavaScript runtime

---

## 📬 Contact & Support

- 🐛 **Bug Reports**: [Open an Issue](https://github.com/TUNA-NOPE/opencode-stats/issues)
- 💡 **Feature Requests**: [Open an Issue](https://github.com/TUNA-NOPE/opencode-stats/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/TUNA-NOPE/opencode-stats/discussions)

---

**Made with ❤️ for the OpenCode community**

If this dashboard helped you understand your OpenCode usage better, please ⭐ star the repo!
