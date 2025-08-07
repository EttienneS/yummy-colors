# Curated Color System

## Overview

The color game now uses a curated set of 50 carefully selected, named colors instead of randomly generated ones. This change provides several benefits:

- **Better Data Analysis**: Named colors make results more meaningful and interpretable
- **More Appetizing Choices**: Colors are specifically chosen for their food-related and appealing qualities
- **Consistent Experience**: Users see the same color palette, making comparisons more valid
- **Enhanced Analytics**: Color names and categories are now tracked and displayed

## Color Categories

The 50 colors are organized into 5 categories:

### 🔥 Warm Colors (16 colors)

Food-related reds, oranges, and pinks that are typically associated with appetizing foods:

- **Reds**: Tomato Red, Coral, Salmon, Crimson, Fire Brick
- **Oranges**: Orange, Dark Orange, Papaya, Peach, Carrot
- **Pinks**: Rose, Pink, Berry, Strawberry, Blush, Apricot

### ❄️ Cool Colors (10 colors)

Fresh and refreshing blues, greens, and light purples:

- **Blues**: Sky Blue, Ocean Blue, Turquoise, Teal, Navy
- **Greens**: Lime, Forest Green, Mint
- **Purples**: Lavender, Plum

### 🌍 Earth Colors (10 colors)

Natural, grounding colors often associated with food ingredients:

- **Browns**: Chocolate, Coffee, Caramel, Cinnamon, Tan
- **Natural**: Olive, Avocado, Eggplant, Wine, Burgundy

### ✨ Bright Colors (9 colors)

Vibrant, energetic colors that catch attention:

- **Yellows**: Gold, Lemon, Banana, Corn, Mustard, Honey, Amber, Mango, Saffron

### 🤍 Neutral Colors (5 colors)

Versatile, subtle colors that work well with others:

- Cream, Beige, Ivory, Pearl, Sand

## Technical Implementation

### New Functions

- `generateRandomColor()`: Now selects from curated set instead of generating HSL values
- `generateColorSet(count)`: Returns shuffled selection from curated colors
- `generateBalancedColorSet(count)`: Returns colors balanced across categories
- `getColorByName(name)`: Find color by name
- `getColorsByCategory(category)`: Get all colors in a category

### Enhanced Analytics

The admin dashboard now shows:

- **Color names** alongside hex values
- **Color categories** for each selection
- **Popular color names** ranking
- **Category preferences** with visual charts

### Database Integration

- Color names are automatically resolved from hex values
- Categories are tracked for analysis
- Analytics include both technical (HSL) and semantic (name/category) data

## Benefits for Research

1. **Meaningful Results**: Instead of random hex codes, we get insights like "Chocolate is the most appetizing color"
2. **Category Analysis**: Understand if users prefer warm, cool, or earth tones
3. **Food Association**: Colors chosen specifically for their relationship to appetizing foods
4. **Reproducible**: Same color set ensures consistent testing conditions
5. **Cultural Relevance**: Named colors that people can relate to and remember

## Usage Examples

```typescript
// Get a random curated color
const color = generateRandomColor();

// Get 6 colors for a round (no duplicates)
const roundColors = generateColorSet(6);

// Get balanced selection across categories
const balancedColors = generateBalancedColorSet(6);

// Find specific colors
const chocolate = getColorByName("Chocolate");
const warmColors = getColorsByCategory("warm");
```

## Analytics Insights

With the curated system, the analytics now provide insights like:

- "Chocolate and Coffee are the most selected earth tones"
- "Warm colors are preferred 60% more than cool colors"
- "Red-orange hues (0-30°) dominate final selections"
- "Users gravitate toward mid-saturation colors (40-60%)"

This system transforms the color selection game from a technical experiment into a meaningful study of color preferences in the context of appetite and food appeal.
