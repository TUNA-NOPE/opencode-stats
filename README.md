# OpenCode Stats Dashboard

A Next.js application that automatically fetches and visualizes your OpenCode usage statistics with cost comparisons across different AI models.

## Features

- **📊 Dashboard Overview**: Sessions, messages, tokens, and cost summaries
- **🪙 Token Analytics**: Visual breakdown of input, output, and cache tokens
- **🔧 Tool Usage**: Detailed analysis of which tools you use most
- **💰 Cost Comparison**: Calculate what your usage would cost on different models
- **🔄 Auto-Refresh**: Live data from `opencode stats` command

## Prerequisites

- [Bun](https://bun.sh/) installed
- [OpenCode CLI](https://opencode.ai/) installed and in your PATH

## Setup

1. Install dependencies:
```bash
bun install
```

2. Run the development server:
```bash
bun run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Dashboard** (`/`): View overview stats, token breakdown, and tool usage
- **Cost Compare** (`/compare`): Compare your costs across different LLM models
- **Tools** (`/tools`): Deep dive into your tool usage patterns

## Architecture

- **Framework**: Next.js 16 with App Router
- **Runtime**: Bun
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Data Source**: Local `opencode stats` command execution

## API

The app exposes one API endpoint:

- `GET /api/stats` - Executes `opencode stats` and returns parsed JSON

## Pricing Data

Model pricing is sourced from [opencode.ai/docs/zen/](https://opencode.ai/docs/zen/) and includes:
- OpenCode models (Claude, Gemini, Kimi, MiniMax)
- OpenAI models (GPT-4o, GPT-4o-mini, o3-mini)
- Anthropic models (Claude 3.5 Sonnet, Claude 3 Opus)
- Google models (Gemini 2.5 Pro, Gemini 2.5 Flash)

## Development

```bash
# Run dev server
bun run dev

# Build for production
bun run build

# Start production server
bun start
```

## License

MIT
