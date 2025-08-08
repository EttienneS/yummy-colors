# Location Analytics Feature

This document describes the location analytics feature added to the Yummy Colors game.

## Overview

The location analytics feature automatically captures basic location information (city-level) from users to understand the geographic distribution of players. This helps improve the game experience and provides interesting analytics about our global player base.

## Privacy & Security

- **City-level only**: Only city, region, and country are collected
- **No consent required**: Since we only collect non-identifying, city-level data
- **No precise location**: GPS coordinates are rounded to approximately 1km accuracy
- **Automatic & transparent**: Location is captured automatically when available
- **Graceful degradation**: The game works fully if location is unavailable

## Data Collected

When users consent to location sharing, the following data is collected:

- **City**: The city name (e.g., "Seattle")
- **Region**: State/province (e.g., "Washington")
- **Country**: Country name (e.g., "United States")
- **Country Code**: ISO country code (e.g., "US")
- **Timezone**: User's timezone (always collected, less sensitive)
- **Approximate coordinates**: Rounded to ~1km accuracy for analytics

## Technical Implementation

### Frontend Components

1. **LocationConsent.tsx**: Modal dialog that requests user consent
2. **location.ts**: Utility functions for getting location data
3. **Admin page**: Displays location analytics

### Backend Changes

1. **Database schema**: Added location columns to `game_sessions` table
2. **API endpoints**: Updated game results API to capture location data
3. **Analytics**: New location analytics view and functions

### Database Schema Changes

```sql
-- New columns added to game_sessions table
ALTER TABLE game_sessions
ADD COLUMN city VARCHAR(100),
ADD COLUMN region VARCHAR(100),
ADD COLUMN country VARCHAR(100),
ADD COLUMN country_code VARCHAR(3),
ADD COLUMN timezone VARCHAR(50),
ADD COLUMN latitude DECIMAL(8,6),
ADD COLUMN longitude DECIMAL(9,6),
ADD COLUMN location_consent BOOLEAN DEFAULT FALSE,
ADD COLUMN location_consent_timestamp TIMESTAMP WITH TIME ZONE;
```

## Location Service

The feature uses BigDataCloud's free reverse geocoding API:

- No API key required
- City-level resolution only
- Privacy-focused (no precise addresses)
- Free tier suitable for our needs

## Analytics Available

The admin dashboard now shows:

1. **Location Summary**:

   - Total sessions with location data
   - Unique countries and cities
   - Location consent rate

2. **Top Locations**:
   - Most active cities
   - Sessions and completion rates per location
   - Geographic distribution

## Usage Flow

1. User starts playing the game
2. After 2 seconds, location consent dialog appears (non-blocking)
3. User can accept, decline, or dismiss
4. If accepted, location is fetched and stored with game results
5. Admin can view aggregated location analytics

## Data Retention

- Location consent preferences are stored in localStorage
- Consent expires after 30 days for privacy
- Server-side location data is stored indefinitely for analytics
- Users can't currently delete their data (could be added in future)

## Future Enhancements

- User data deletion requests
- More granular location preferences
- Location-based color preferences analysis
- Regional color preference insights
- Timezone-based analytics
