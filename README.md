# Core Inventory - Stock Management System

High-density inventory management for warehouses. Track stock, receipts, deliveries, transfers, and adjustments in real-time.

## Quick Start

```sh
# Install dependencies (Bun recommended, or npm)
bun install

# Start development server
bun dev

# Open http://localhost:8080
```

## Scripts

- `bun dev` - Start dev server (port 8080)
- `bun build` - Build for production
- `bun preview` - Preview production build
- `bun lint` - Lint code
- `bun test` - Run tests

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query
- Lucide React icons

## Project Structure

```
src/
├── components/     # UI components & shadcn/ui
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── lib/            # Utilities
├── pages/          # Page components
└── integrations/   # External services
```

## Deployment

- **Frontend**: Netlify/Vercel (static hosting)
- **Backend**: Required for MySQL (see backend/ after migration)

## Testing

Uses Playwright + Vitest.

```sh
bun test
npx playwright test
```

Enjoy managing your inventory!

