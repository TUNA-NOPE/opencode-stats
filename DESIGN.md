# DESIGN.md - Cal.com Inspired Design System

## Design Philosophy

Clean, neutral UI with developer-oriented simplicity. Open-source scheduling aesthetic that prioritizes clarity and functionality.

## Color Palette

### Neutral Scale (Monochrome)
- **Black**: `#111111` - Primary text, headings
- **Dark Gray**: `#2d2d2d` - Secondary backgrounds, cards
- **Medium Gray**: `#3e3e3e` - Borders, dividers
- **Gray**: `#6b6b6b` - Secondary text, muted content
- **Light Gray**: `#9ca3af` - Placeholder text, disabled states
- **Lighter Gray**: `#e5e5e5` - Subtle borders, separators
- **Off White**: `#f5f5f5` - Page backgrounds, alternate sections
- **White**: `#ffffff` - Card backgrounds, primary surfaces

### Semantic Colors
- **Primary**: `#111111` - Buttons, links, key actions
- **Primary Text on Dark**: `#ffffff` - Text on primary buttons
- **Destructive**: `#ef4444` - Error states, warnings
- **Success**: `#10b981` - Success states
- **Accent**: `#3b82f6` - Links, interactive highlights

## Typography

### Font Stack
- **Primary**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- **Monospace**: `JetBrains Mono, "SF Mono", Monaco, Consolas, monospace`

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 36px | 700 | 1.1 |
| H2 | 28px | 600 | 1.2 |
| H3 | 22px | 600 | 1.3 |
| H4 | 18px | 600 | 1.4 |
| Body | 16px | 400 | 1.6 |
| Small | 14px | 400 | 1.5 |
| XSmall | 12px | 500 | 1.4 |

### Typography Rules
- Headings use tight line-height for impact
- Body text uses generous line-height for readability
- Use font-mono for code, data, and technical content
- Maximum 75 characters per line for body text

## Spacing System

### Base Unit: 4px
| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon padding, tight gaps |
| sm | 8px | Component internal padding |
| md | 16px | Standard spacing, card padding |
| lg | 24px | Section spacing |
| xl | 32px | Large section gaps |
| 2xl | 48px | Page sections |
| 3xl | 64px | Major page sections |

## Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| none | 0px | Hard edges, technical elements |
| sm | 4px | Buttons, inputs |
| md | 8px | Cards, containers |
| lg | 12px | Large cards, modals |
| full | 9999px | Pills, badges |

## Shadows
| Token | Value | Usage |
|-------|-------|-------|
| none | none | Flat design preference |
| sm | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation |
| md | `0 4px 6px -1px rgba(0,0,0,0.1)` | Cards on hover |
| lg | `0 10px 15px -3px rgba(0,0,0,0.1)` | Modals, dropdowns |

## Component Patterns

### Buttons
- **Primary**: Black background (#111), white text, 4px radius
- **Secondary**: White background, black border, black text
- **Ghost**: Transparent, hover shows light gray background
- **Sizes**: sm (32px), md (40px), lg (48px) height
- **States**: Hover darkens, active press-down effect

### Cards
- White background, 1px border (#e5e5e5)
- 8px border radius
- No shadow by default, subtle shadow on hover
- 16px internal padding
- Clean, minimal header with optional action

### Inputs
- 40px height, 4px radius
- 1px border (#e5e5e5), darkens on focus
- No visible focus ring, border color change only
- Placeholder in medium gray

### Navigation
- Horizontal nav with clean underline or pill active states
- 14px font size, medium weight
- Subtle hover state with light background
- Minimal, no heavy borders or shadows

### Tables
- Clean horizontal lines only
- 16px cell padding
- Monospace for numeric data
- Subtle hover state

## Animation Guidelines

### Timing
- Micro-interactions: 150ms
- Standard transitions: 200ms
- Page transitions: 300ms

### Easing
- Standard: `ease-out` for enter, `ease-in` for exit
- Smooth: `cubic-bezier(0.4, 0, 0.2, 1)`

### Patterns
- Use transform and opacity only
- No layout-triggering animations
- Subtle scale (0.98) on button press
- Fade transitions for content changes

## Layout Principles

### Container
- Max-width: 1200px
- Padding: 16px (mobile), 24px (tablet), 32px (desktop)

### Grid
- Prefer CSS Grid for layouts
- Gap: 16px standard, 24px for larger sections

### Responsive
- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px

## Best Practices

1. **White Space**: Generous padding and margins create breathing room
2. **Hierarchy**: Clear visual hierarchy through size, weight, and color
3. **Consistency**: Use the spacing and sizing scales consistently
4. **Contrast**: Maintain WCAG AA contrast ratios
5. **Simplicity**: Remove unnecessary decoration and visual noise
6. **Data Display**: Use monospace fonts for numbers, code, and data
7. **Borders**: Prefer subtle borders over shadows for definition
8. **Interactivity**: Clear hover and active states on all interactive elements

## Dark Mode

### Colors (Dark)
- **Background**: `#0a0a0a`
- **Surface**: `#111111`
- **Elevated**: `#1a1a1a`
- **Border**: `#2d2d2d`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#9ca3af`
- **Text Muted**: `#6b6b6b`

### Inversion Rules
- Invert background/surface colors
- Keep semantic colors (success, error, accent) similar
- Adjust contrast for readability
- Subtle borders become more visible in dark mode
