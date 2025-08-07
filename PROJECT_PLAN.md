# Yummy Colors - Color Preference Game

## Project Overview
A mobile-first color selection game built with Next.js to determine the most appetizing colors through user preferences.

## Game Flow
1. **Round 1-5**: Present multiple random colors, user selects most appetizing
2. **Favorites Round**: Show most frequently selected colors, user picks favorites
3. **Top 3 Finale**: Final ranking of user's top color preferences
4. **Data Collection**: Store results for later analysis

## Technical Stack
- **Framework**: Next.js 15.4.6 with React 19.1.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Shadcn/UI
- **TypeScript**: Full type safety
- **Data Storage**: localStorage + API endpoints for persistence
- **Mobile-First**: Responsive design prioritizing mobile experience

## Project Structure
```
app/
├── layout.tsx (existing)
├── page.tsx (main game)
├── api/
│   └── game-results/
│       └── route.ts (data storage endpoint)
├── globals.css (existing)

components/
├── ui/ (shadcn components)
│   ├── button.tsx
│   ├── card.tsx
│   ├── progress.tsx
│   └── badge.tsx
├── game/
│   ├── ColorCard.tsx
│   ├── ColorSelection.tsx
│   ├── GameProgress.tsx
│   ├── FavoritesRound.tsx
│   └── ResultsDisplay.tsx

lib/
├── colors.ts (color generation utilities)
├── game-state.ts (state management)
├── storage.ts (data persistence)
└── utils.ts (shadcn utils)

types/
└── game.ts (TypeScript definitions)
```

## Game State Management
```typescript
interface GameState {
  currentRound: number;
  totalRounds: number;
  selectedColors: Color[];
  roundHistory: RoundResult[];
  favorites: Color[];
  finalTop3: Color[];
  gamePhase: 'selection' | 'favorites' | 'finale' | 'complete';
}
```

## Color System
- Generate random HSL colors for better control
- Ensure sufficient contrast and visibility
- Track selection frequency
- Store hex, HSL, and RGB values

## Mobile Design Considerations
- Touch-friendly color cards (min 44px tap targets)
- Swipe gestures for navigation
- Responsive grid layouts
- Large, clear typography
- Progress indicators for game flow

## Data Collection Points
- Color selection per round
- Time spent on each decision
- User device/screen info
- Final ranking results
- Session timestamp

## Development Phases
1. **Phase 1**: Core game mechanics and UI
2. **Phase 2**: Data persistence and API
3. **Phase 3**: Analytics and optimization
4. **Phase 4**: Enhanced features (animations, themes)

## Next Steps
1. Install and configure Shadcn/UI
2. Create TypeScript type definitions
3. Build core game components
4. Implement game state management
5. Add data storage capabilities
6. Test mobile responsiveness

## Dependencies to Add
- @radix-ui packages (via shadcn)
- class-variance-authority
- clsx
- tailwind-merge
- lucide-react (icons)