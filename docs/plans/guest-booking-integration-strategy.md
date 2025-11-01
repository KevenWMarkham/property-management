# Guest-Property Booking Integration Strategy

## Executive Summary

This document outlines the comprehensive strategy for integrating the Guest Card Profile System with the Property Booking system, creating a seamless experience that links guest preferences, history, and personalization with property reservations.

**Vision**: Transform booking from a transactional process into a personalized journey where guest preferences automatically enhance every stay, property features align with guest needs, and the system learns and improves with each interaction.

---

## Table of Contents

1. [Current System Architecture](#current-system-architecture)
2. [Integration Model](#integration-model)
3. [Guest Journey & Booking Flow](#guest-journey-booking-flow)
4. [Database Architecture](#database-architecture)
5. [API Design](#api-design)
6. [UI/UX Integration](#ui-ux-integration)
7. [Personalization Engine](#personalization-engine)
8. [Implementation Phases](#implementation-phases)

---

## Current System Architecture

### Existing Tables

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│ properties  │         │   bookings   │         │   guests   │
│             │◄────────│              │────────►│            │
│ - id        │  1:N    │ - id         │  N:1    │ - id       │
│ - name      │         │ - propertyId │         │ - firstName│
│ - address   │         │ - guestId    │         │ - lastName │
│ - type      │         │ - checkInDate│         │ - email    │
│ - nightlyRate│        │ - status     │         │ - phone    │
│ - amenities │         │ - totalAmount│         │            │
└─────────────┘         └──────────────┘         └────────────┘
```

**Current Relationships:**
- Properties have many Bookings (1:N)
- Guests have many Bookings (1:N)
- Bookings belong to one Property and one Guest (N:1)

### Gap Analysis

**What's Missing:**
1. ❌ Guest profile completeness tracking
2. ❌ Guest preferences storage (dietary, activities, temperature)
3. ❌ Personality traits and persona data
4. ❌ Guest loyalty/rewards integration
5. ❌ Booking-specific guest preferences
6. ❌ Guest booking history analytics
7. ❌ Property-guest matching algorithm
8. ❌ Progressive profiling workflow

---

## Integration Model

### Three-Tier Integration Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │   Booking    │  │Guest Profile │  │  Haven AI       │  │
│  │     Flow     │  │  Dashboard   │  │  Assistant      │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘  │
└─────────┼──────────────────┼───────────────────┼───────────┘
          │                  │                   │
┌─────────┼──────────────────┼───────────────────┼───────────┐
│         ▼                  ▼                   ▼           │
│                     API LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Bookings    │  │   Guests     │  │  Preferences    │  │
│  │     API      │◄─┤     API      │─►│      API        │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘  │
│         │                  │                   │           │
│  ┌──────┴──────────────────┴───────────────────┴────────┐  │
│  │          Personalization Engine (AI/ML)              │  │
│  │  - Property matching   - Preference learning         │  │
│  │  - Experience curation - Behavioral analysis         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────┬──────────────────┬───────────────────┬───────────┘
          │                  │                   │
┌─────────┼──────────────────┼───────────────────┼───────────┐
│         ▼                  ▼                   ▼           │
│                    DATA LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  bookings    │  │    guests    │  │ guest_personas  │  │
│  │              │  │              │  │                 │  │
│  ├──────────────┤  ├──────────────┤  ├─────────────────┤  │
│  │booking_guests│  │guest_prefs   │  │guest_points     │  │
│  │              │  │              │  │                 │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

### Core Integration Principles

1. **Guest-Centric Design**: Guest profile is the source of truth for preferences
2. **Booking Enhancement**: Each booking inherits and refines guest preferences
3. **Bidirectional Learning**: Booking behavior updates guest profile
4. **Property Matching**: Properties recommended based on guest preferences
5. **Progressive Enhancement**: System gets smarter with each booking

---

## Guest Journey & Booking Flow

### Phase 1: Pre-Booking (Property Discovery)

```
┌─────────────────────────────────────────────────────────────┐
│  GUEST EXPLORES PROPERTIES                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                             │
│  IF guest is logged in AND has profile:                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🎯 PERSONALIZED PROPERTY RECOMMENDATIONS           │   │
│  │                                                      │   │
│  │  "Based on your profile, Sarah, we recommend:"      │   │
│  │                                                      │   │
│  │  🧘 Beachfront Wellness Retreat ⭐⭐⭐⭐⭐           │   │
│  │  Why: Hot tub, yoga deck, near Italian restaurants │   │
│  │  Match: 95%                                          │   │
│  │                                                      │   │
│  │  🍷 Downtown Loft near Wine District ⭐⭐⭐⭐        │   │
│  │  Why: Walking distance to wine bars, art galleries │   │
│  │  Match: 88%                                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  IF guest is NOT logged in OR no profile:                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Standard property listings (no personalization)    │   │
│  │  [Sign in to get personalized recommendations]     │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Matching Algorithm:**
```typescript
interface PropertyMatch {
  propertyId: number;
  matchScore: number; // 0-100
  reasons: string[];
  expectedPreferences: {
    temperature: number;
    dietaryOptions: string[];
    nearbyActivities: string[];
  };
}

function calculatePropertyMatch(guest: GuestProfile, property: Property): PropertyMatch {
  let score = 0;
  const reasons: string[] = [];

  // Amenities matching (30 points max)
  if (guest.preferences.amenities) {
    const amenityMatch = countMatchingAmenities(guest.preferences.amenities, property.amenities);
    score += amenityMatch * 3;
    if (amenityMatch > 5) reasons.push(`Has ${amenityMatch} of your preferred amenities`);
  }

  // Location matching (25 points max)
  if (guest.preferences.activities) {
    const activityMatch = countNearbyActivities(guest.preferences.activities, property.location);
    score += activityMatch * 5;
    if (activityMatch > 3) reasons.push(`Near ${activityMatch} activities you enjoy`);
  }

  // Restaurant matching (20 points max)
  if (guest.preferences.favoriteCuisines) {
    const restaurantMatch = countNearbyCuisines(guest.preferences.favoriteCuisines, property.location);
    score += restaurantMatch * 4;
    if (restaurantMatch > 2) reasons.push(`${restaurantMatch} ${guest.preferences.favoriteCuisines[0]} restaurants nearby`);
  }

  // Property type matching (15 points max)
  if (guest.persona?.travelerType) {
    const typeMatch = matchTravelerTypeToProperty(guest.persona.travelerType, property);
    score += typeMatch;
    if (typeMatch > 10) reasons.push(`Perfect for ${guest.persona.travelerType}s`);
  }

  // Previous stay similarity (10 points max)
  if (guest.stayHistory) {
    const historyMatch = matchHistoricalPreferences(guest.stayHistory, property);
    score += historyMatch;
    if (historyMatch > 5) reasons.push('Similar to properties you loved');
  }

  return {
    propertyId: property.id,
    matchScore: Math.min(score, 100),
    reasons,
    expectedPreferences: {
      temperature: guest.preferences.idealTemperature || 70,
      dietaryOptions: guest.preferences.dietaryRestrictions || [],
      nearbyActivities: guest.preferences.activities || [],
    },
  };
}
```

---

### Phase 2: Booking Creation

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: SELECT PROPERTY & DATES                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                             │
│  Property: Beachfront Wellness Retreat                      │
│  Check-in: Feb 15, 2025                                     │
│  Check-out: Feb 22, 2025 (7 nights)                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💡 SMART SUGGESTIONS                               │   │
│  │  Based on your profile:                             │   │
│  │  • Pre-heat to 70°F before arrival                  │   │
│  │  • We've reserved the yoga deck for mornings        │   │
│  │  • 5 vegetarian Italian restaurants nearby          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  STEP 2: GUEST SELECTION (Admin creates booking)            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                             │
│  Select Guest: [Sarah Mitchell ▼]                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  👤 GUEST PROFILE PREVIEW                           │   │
│  │                                                      │   │
│  │  Sarah Mitchell (Gold Member)                       │   │
│  │  📊 Profile: 85% complete | 4,200 points            │   │
│  │  🏠 3 previous stays | ⭐ 4.8 avg rating            │   │
│  │                                                      │   │
│  │  Key Preferences:                                    │   │
│  │  🌱 Vegetarian (no shellfish, tree nuts)           │   │
│  │  🌡️ Prefers 70-72°F                                │   │
│  │  🧘 Wellness activities                             │   │
│  │  🍷 Wine tasting                                    │   │
│  │                                                      │   │
│  │  [View Full Profile] [Edit Guest Info]             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  OR: [+ Create New Guest]                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  STEP 3: PERSONALIZATION OPTIONS                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                             │
│  ☑️ Apply guest preferences to this booking                │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ✓ Pre-set temperature to 70°F                      │   │
│  │  ✓ Queue welcome playlist (Indie folk)             │   │
│  │  ✓ Reserve yoga equipment                           │   │
│  │  ✓ Send vegetarian restaurant recommendations      │   │
│  │  ✓ Send pre-arrival survey (+200 points)           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Special Requests (specific to this booking):               │
│  [Celebrating anniversary - surprise wine & chocolates]    │
│                                                             │
│  Booking-Specific Preferences:                              │
│  [ ] Override temperature: _____°F                          │
│  [ ] Disable certain automations                            │
│  [ ] Custom check-in time: _____                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  STEP 4: BOOKING CONFIRMATION                               │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                             │
│  Booking Summary:                                           │
│  7 nights × $250/night = $1,750.00                         │
│  Cleaning fee: $150.00                                      │
│  ─────────────────────────                                  │
│  Subtotal: $1,900.00                                        │
│                                                             │
│  Gold Member Discount (10%): -$190.00                      │
│  Redeem 1,000 points: -$25.00                              │
│  ─────────────────────────                                  │
│  TOTAL: $1,685.00                                           │
│                                                             │
│  Points earned: +350 (7 nights × 50)                       │
│                                                             │
│  [Confirm Booking]                                          │
└─────────────────────────────────────────────────────────────┘
```

---

### Phase 3: Pre-Arrival (7 days before check-in)

**Automated Workflow:**

```typescript
async function triggerPreArrivalWorkflow(booking: Booking) {
  const guest = await getGuestProfile(booking.guestId);
  const property = await getProperty(booking.propertyId);

  // 1. Send personalized pre-arrival email
  await sendEmail({
    to: guest.email,
    template: 'pre-arrival-personalized',
    data: {
      guestName: guest.preferredName || guest.firstName,
      propertyName: property.name,
      checkInDate: booking.checkInDate,
      personalizedRecommendations: await generateRecommendations(guest, property),
      profileCompletionIncentive: guest.profileCompleteness < 100 ? {
        pointsAvailable: 200,
        timeEstimate: '5 minutes',
        benefits: ['Custom itinerary', 'Better recommendations'],
      } : null,
    },
  });

  // 2. If profile incomplete, send survey
  if (guest.profileCompleteness < 50) {
    await createSurvey({
      guestId: guest.id,
      bookingId: booking.id,
      type: 'pre-arrival',
      pointsReward: 200,
    });
  }

  // 3. Generate personalized itinerary
  const itinerary = await generateItinerary({
    guest,
    property,
    duration: calculateNights(booking.checkInDate, booking.checkOutDate),
  });

  await saveItinerary(booking.id, itinerary);

  // 4. Configure property for guest arrival
  await configureProperty({
    propertyId: property.id,
    bookingId: booking.id,
    preferences: {
      temperature: guest.preferences.idealTemperature || 70,
      lighting: guest.preferences.lightingPreference || 'auto',
      music: guest.preferences.musicGenres?.[0] || null,
    },
  });

  // 5. Grant IoT permissions
  await grantGuestIoTAccess(booking.id, guest.id, property.id);
}
```

---

### Phase 4: During Stay (Active Booking)

**Real-time Personalization:**

```
┌─────────────────────────────────────────────────────────────┐
│  HAVEN AI ASSISTANT - ACTIVE LEARNING                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                             │
│  Day 1, 8:45 AM:                                            │
│  🔔 Sarah used coffee maker → Log behavior                 │
│     (Confirmed: Late breakfast person)                      │
│                                                             │
│  Day 1, 10:30 PM:                                           │
│  🌡️ Sarah adjusted thermostat to 70°F → Update preference │
│     (Confirmed: Prefers 70°F for sleeping)                 │
│                                                             │
│  Day 2, 3:00 PM:                                            │
│  🧘 Sarah checked out yoga mat → Log activity              │
│     (Confidence: Wellness Seeker +10%)                      │
│                                                             │
│  Day 2, 7:30 PM:                                            │
│  🍝 Sarah booked Italian restaurant via Haven              │
│     (Confirmed: Italian cuisine preference)                 │
│                                                             │
│  Day 3, 9:00 AM:                                            │
│  💬 Haven: "I noticed you love Italian food! There's a new │
│     place, 'Osteria del Mare,' with incredible seafood     │
│     pasta. Want to hear more?"                             │
│                                                             │
│  [Guest engages] → Update profile with interaction data    │
└─────────────────────────────────────────────────────────────┘
```

**Behavioral Data Capture:**

```sql
-- Automatic logging during stay
INSERT INTO guest_behavioral_data (guest_id, booking_id, behavior_type, behavior_value, frequency, time_of_day)
VALUES
  (123, 456, 'thermostat_adjustment', '{"temp": 70, "mode": "cool"}', 7, '22:30:00'),
  (123, 456, 'lighting_scene', '{"scene": "Movie", "brightness": 30}', 3, '20:15:00'),
  (123, 456, 'music_choice', '{"genre": "Indie Folk", "artist": "Bon Iver"}', 5, '18:00:00'),
  (123, 456, 'restaurant_booking', '{"cuisine": "Italian", "name": "Bella Vista"}', 3, '19:30:00'),
  (123, 456, 'equipment_checkout', '{"item": "Yoga mat", "duration": "60 min"}', 4, '08:00:00');

-- AI processes these to update guest_preferences
UPDATE guest_preferences
SET
  preference_value = '70',
  confidence_score = 0.95,
  source = 'behavioral'
WHERE
  guest_id = 123
  AND category = 'accommodation'
  AND preference_key = 'ideal_temperature';
```

---

### Phase 5: Post-Stay (Checkout + 24 hours)

**Feedback Loop:**

```
┌─────────────────────────────────────────────────────────────┐
│  POST-STAY SURVEY (Earn +300 points!)                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                             │
│  Sarah, thanks for staying at Beachfront Wellness Retreat! │
│                                                             │
│  1. What was your favorite moment? ⭐⭐⭐⭐⭐               │
│     [Morning yoga on the deck overlooking the ocean]       │
│                                                             │
│  2. Which activities did you enjoy most?                    │
│     ☑️ Yoga classes                                        │
│     ☑️ Wine tasting                                        │
│     ☑️ Beach walks                                         │
│     ☐ Paddleboarding                                       │
│                                                             │
│  3. How well did we match your preferences? (1-10)          │
│     ━━━━━━━━━●─ 9                                          │
│                                                             │
│  4. OPTIONAL: Update your profile for even better stays!   │
│     What's your dream vacation destination?                │
│     [Greek Islands - Santorini]                            │
│                                                             │
│  [Submit & Earn 300 Points] → Profile: 90% complete!       │
└─────────────────────────────────────────────────────────────┘
```

**Profile Update:**

```typescript
async function processPostStayFeedback(bookingId: number, feedback: SurveyResponse) {
  const booking = await getBooking(bookingId);
  const guest = await getGuestProfile(booking.guestId);

  // 1. Award points
  await awardPoints(guest.id, 300, 'post_stay_survey', bookingId);

  // 2. Update preferences based on feedback
  for (const activity of feedback.enjoyedActivities) {
    await upsertPreference({
      guestId: guest.id,
      category: 'activity',
      key: activity,
      value: 'loved',
      confidenceScore: 0.9,
      source: 'survey',
    });
  }

  // 3. Update bucket list
  if (feedback.dreamDestination) {
    await upsertPreference({
      guestId: guest.id,
      category: 'personal',
      key: 'bucket_list_destination',
      value: feedback.dreamDestination,
      source: 'survey',
    });
  }

  // 4. Recalculate profile completeness
  const newCompleteness = await calculateProfileCompleteness(guest.id);
  await updateGuest(guest.id, { profileCompleteness: newCompleteness });

  // 5. Update guest tier if applicable
  await checkAndUpdateTier(guest.id);

  // 6. Send thank you + next steps
  await sendEmail({
    to: guest.email,
    template: 'post-stay-thank-you',
    data: {
      pointsEarned: 300,
      newTotalPoints: guest.totalPoints + 300,
      profileCompleteness: newCompleteness,
      nextMilestone: calculateNextMilestone(guest),
    },
  });
}
```

---

## Database Architecture

### Extended Schema

```sql
-- ============================================
-- CORE GUEST PROFILE TABLES
-- ============================================

-- Extended guests table
ALTER TABLE guests ADD COLUMN preferred_name VARCHAR(100);
ALTER TABLE guests ADD COLUMN birthday DATE;
ALTER TABLE guests ADD COLUMN location VARCHAR(255);
ALTER TABLE guests ADD COLUMN languages TEXT; -- JSON array
ALTER TABLE guests ADD COLUMN pronouns VARCHAR(20);
ALTER TABLE guests ADD COLUMN total_points INTEGER DEFAULT 0;
ALTER TABLE guests ADD COLUMN tier VARCHAR(20) DEFAULT 'Silver';
ALTER TABLE guests ADD COLUMN member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE guests ADD COLUMN total_stays INTEGER DEFAULT 0;
ALTER TABLE guests ADD COLUMN total_nights INTEGER DEFAULT 0;
ALTER TABLE guests ADD COLUMN total_spent INTEGER DEFAULT 0; -- cents
ALTER TABLE guests ADD COLUMN average_rating_given DECIMAL(2,1);
ALTER TABLE guests ADD COLUMN average_rating_received DECIMAL(2,1);
ALTER TABLE guests ADD COLUMN profile_completeness INTEGER DEFAULT 20;
ALTER TABLE guests ADD COLUMN share_with_properties BOOLEAN DEFAULT TRUE;
ALTER TABLE guests ADD COLUMN share_with_local_businesses BOOLEAN DEFAULT TRUE;
ALTER TABLE guests ADD COLUMN allow_ai_personalization BOOLEAN DEFAULT TRUE;

-- Guest personas
CREATE TABLE guest_personas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  traveler_type VARCHAR(50),
  openness INTEGER, -- 0-100
  conscientiousness INTEGER,
  extraversion INTEGER,
  agreeableness INTEGER,
  neuroticism INTEGER,
  pace VARCHAR(20),
  planning_style VARCHAR(20),
  social_preference VARCHAR(20),
  risk_tolerance VARCHAR(20),
  interests TEXT, -- JSON array
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guest preferences
CREATE TABLE guest_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guest_id INTEGER NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL,
  preference_key VARCHAR(100) NOT NULL,
  preference_value TEXT,
  confidence_score DECIMAL(3,2) DEFAULT 0.5,
  source VARCHAR(50), -- 'survey' | 'behavioral' | 'ai_inferred' | 'explicit'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guest points transactions
CREATE TABLE guest_points_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guest_id INTEGER NOT NULL REFERENCES guests(id),
  points INTEGER NOT NULL,
  transaction_type VARCHAR(50),
  description TEXT,
  reference_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guest behavioral data
CREATE TABLE guest_behavioral_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guest_id INTEGER NOT NULL REFERENCES guests(id),
  booking_id INTEGER NOT NULL REFERENCES bookings(id),
  behavior_type VARCHAR(50),
  behavior_value TEXT, -- JSON
  frequency INTEGER DEFAULT 1,
  time_of_day TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- BOOKING-GUEST INTEGRATION TABLES
-- ============================================

-- Extended bookings table
ALTER TABLE bookings ADD COLUMN apply_guest_preferences BOOLEAN DEFAULT TRUE;
ALTER TABLE bookings ADD COLUMN booking_preferences TEXT; -- JSON - booking-specific overrides
ALTER TABLE bookings ADD COLUMN personalized_itinerary TEXT; -- JSON
ALTER TABLE bookings ADD COLUMN points_earned INTEGER DEFAULT 0;
ALTER TABLE bookings ADD COLUMN points_redeemed INTEGER DEFAULT 0;

-- Booking guest participants (for multi-guest bookings)
CREATE TABLE booking_guests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  guest_id INTEGER NOT NULL REFERENCES guests(id),
  is_primary BOOLEAN DEFAULT FALSE,
  relationship VARCHAR(50), -- 'primary' | 'spouse' | 'child' | 'friend' | 'family'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guest surveys
CREATE TABLE guest_surveys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  guest_id INTEGER NOT NULL REFERENCES guests(id),
  booking_id INTEGER REFERENCES bookings(id),
  survey_type VARCHAR(50), -- 'pre_arrival' | 'check_in' | 'post_stay'
  status VARCHAR(20) DEFAULT 'sent', -- 'sent' | 'completed' | 'expired'
  points_reward INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guest survey responses
CREATE TABLE guest_survey_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  survey_id INTEGER NOT NULL REFERENCES guest_surveys(id),
  question TEXT NOT NULL,
  answer TEXT, -- JSON for complex answers
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- PROPERTY PERSONALIZATION
-- ============================================

-- Property configurations per booking
CREATE TABLE booking_property_configs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  config_type VARCHAR(50), -- 'temperature' | 'lighting' | 'music' | 'welcome'
  config_value TEXT, -- JSON
  applied_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## API Design

### New Endpoints

```typescript
// ============================================
// GUEST PROFILE API
// ============================================

// GET /api/admin/guests/:id/profile
// Returns complete guest profile including preferences, persona, stats
interface GuestProfileResponse {
  guest: Guest;
  persona: GuestPersona | null;
  preferences: GuestPreference[];
  stats: {
    totalStays: number;
    totalNights: number;
    totalSpent: number;
    averageRating: number;
    profileCompleteness: number;
  };
  loyalty: {
    tier: 'Silver' | 'Gold' | 'Platinum';
    points: number;
    nextTierAt: number;
  };
}

// PATCH /api/admin/guests/:id/profile
// Update guest profile fields
interface UpdateGuestProfileRequest {
  preferredName?: string;
  birthday?: string;
  location?: string;
  languages?: string[];
  pronouns?: string;
  preferences?: Array<{
    category: string;
    key: string;
    value: string;
  }>;
}

// GET /api/admin/guests/:id/preferences
// Get all preferences for a guest
interface GuestPreferencesResponse {
  dining: {
    dietaryRestrictions: string[];
    allergies: string[];
    favoriteCuisines: string[];
    spiceTolerance: string;
  };
  accommodation: {
    idealTemperature: number;
    beddingPreference: string;
    noisePreference: string;
    amenities: string[];
  };
  activities: string[];
  transportation: string;
}

// POST /api/admin/guests/:id/preferences
// Add or update guest preference
interface CreatePreferenceRequest {
  category: string;
  key: string;
  value: string;
  source: 'survey' | 'behavioral' | 'explicit';
}

// ============================================
// BOOKING-GUEST INTEGRATION API
// ============================================

// POST /api/admin/bookings
// Enhanced booking creation with guest integration
interface CreateBookingRequest {
  propertyId: number;
  guestId: number;
  additionalGuestIds?: number[]; // For multi-guest bookings
  checkInDate: Date;
  checkOutDate: Date;
  status: string;
  nightlyRate: number;
  cleaningFee?: number;
  specialRequests?: string;
  applyGuestPreferences: boolean; // NEW
  bookingPreferences?: { // NEW - Booking-specific overrides
    temperature?: number;
    disableAutomations?: string[];
    customCheckInTime?: string;
  };
  redeemPoints?: number; // NEW
}

// GET /api/admin/bookings/:id/personalization
// Get personalization data for a booking
interface BookingPersonalizationResponse {
  guestProfile: GuestProfileResponse;
  appliedPreferences: {
    temperature: number;
    lighting: string;
    music: string | null;
    amenities: string[];
  };
  itinerary: {
    day: number;
    activities: Array<{
      time: string;
      title: string;
      description: string;
      bookingUrl?: string;
    }>;
  }[];
  recommendations: {
    restaurants: Array<{
      name: string;
      cuisine: string;
      matchReason: string;
      distance: string;
    }>;
    activities: Array<{
      name: string;
      category: string;
      matchReason: string;
    }>;
  };
}

// POST /api/admin/bookings/:id/apply-preferences
// Apply guest preferences to property for this booking
interface ApplyPreferencesRequest {
  preferences: {
    temperature?: number;
    lighting?: string;
    music?: string;
  };
}

// ============================================
// PROPERTY MATCHING API
// ============================================

// GET /api/admin/properties/match/:guestId
// Get property recommendations for a guest
interface PropertyMatchResponse {
  matches: Array<{
    property: Property;
    matchScore: number; // 0-100
    reasons: string[];
    expectedPreferences: {
      temperature: number;
      dietaryOptions: string[];
      nearbyActivities: string[];
    };
  }>;
}

// ============================================
// SURVEYS & FEEDBACK API
// ============================================

// POST /api/admin/surveys
// Create a survey for a guest
interface CreateSurveyRequest {
  guestId: number;
  bookingId?: number;
  surveyType: 'pre_arrival' | 'check_in' | 'post_stay';
  pointsReward: number;
}

// POST /api/admin/surveys/:id/responses
// Submit survey responses
interface SubmitSurveyRequest {
  responses: Array<{
    question: string;
    answer: string | string[];
  }>;
}

// ============================================
// ANALYTICS API
// ============================================

// GET /api/admin/analytics/guest-satisfaction
// Guest satisfaction metrics
interface GuestSatisfactionResponse {
  overallSatisfaction: number;
  personalizationEffectiveness: number;
  profileCompletionRate: number;
  repeatBookingRate: number;
  averagePointsEarned: number;
}
```

---

## UI/UX Integration

### Booking Creation Flow Enhancement

**Current Flow:**
```
Select Property → Select Guest → Enter Dates → Enter Rates → Create
```

**Enhanced Flow:**
```
Select Property → Select Guest →
  ↓
[Guest Profile Preview Card appears]
  ↓
Review Preferences → Apply to Booking (toggle) →
  ↓
Enter Dates → Auto-calculate with Member Discount →
  ↓
Configure Personalization → Redeem Points (optional) →
  ↓
Create Booking with Full Integration
```

### New UI Components

#### 1. Guest Profile Preview Card (in booking form)

```typescript
// components/booking/GuestProfilePreview.tsx
interface GuestProfilePreviewProps {
  guestId: number;
  onApplyPreferences: (apply: boolean) => void;
}

export function GuestProfilePreview({ guestId, onApplyPreferences }: GuestProfilePreviewProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
            SM
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Sarah Mitchell</h3>
            <p className="text-sm text-gray-600">Gold Member • 4,200 points</p>
          </div>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
          85% Complete
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500">Previous Stays</p>
          <p className="font-semibold text-gray-900">3 stays • 14 nights</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Average Rating</p>
          <p className="font-semibold text-gray-900">⭐ 4.8</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-gray-700 mb-2">Key Preferences:</p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
            🌱 Vegetarian
          </span>
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
            🌡️ 70-72°F
          </span>
          <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
            🧘 Wellness
          </span>
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800">
            🍷 Wine
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          id="apply-preferences"
          defaultChecked
          onChange={(e) => onApplyPreferences(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="apply-preferences" className="text-sm text-gray-700">
          Apply guest preferences to this booking
        </label>
      </div>

      <div className="mt-3 flex gap-2">
        <button className="text-sm text-blue-600 hover:text-blue-700">
          View Full Profile →
        </button>
        <button className="text-sm text-gray-600 hover:text-gray-700">
          Edit Guest Info
        </button>
      </div>
    </div>
  );
}
```

#### 2. Personalization Options Panel

```typescript
// components/booking/PersonalizationOptions.tsx
export function PersonalizationOptions({ guest, property, onChange }: Props) {
  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-900 mb-3">Personalization</h3>

      <div className="space-y-3">
        <label className="flex items-start gap-2">
          <input type="checkbox" defaultChecked className="mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Pre-set temperature</p>
            <p className="text-xs text-gray-500">Set to {guest.preferences.temperature}°F before arrival</p>
          </div>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" defaultChecked className="mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Welcome playlist</p>
            <p className="text-xs text-gray-500">Queue {guest.preferences.musicGenre} music</p>
          </div>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" defaultChecked className="mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Send recommendations</p>
            <p className="text-xs text-gray-500">Vegetarian restaurants & yoga classes nearby</p>
          </div>
        </label>

        <label className="flex items-start gap-2">
          <input type="checkbox" defaultChecked className="mt-1" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Pre-arrival survey</p>
            <p className="text-xs text-gray-500">+200 points reward for completion</p>
          </div>
        </label>
      </div>
    </div>
  );
}
```

#### 3. Points Redemption Section

```typescript
// components/booking/PointsRedemption.tsx
export function PointsRedemption({ guest, totalAmount, onRedeem }: Props) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-amber-600">🎁</span>
        <h3 className="font-semibold text-amber-900">Redeem Points</h3>
      </div>

      <p className="text-sm text-amber-800 mb-3">
        Available: <span className="font-semibold">{guest.totalPoints} points</span>
      </p>

      <div className="space-y-2">
        <label className="flex items-center justify-between p-2 rounded border border-amber-300 bg-white cursor-pointer hover:bg-amber-50">
          <div>
            <p className="text-sm font-medium text-gray-900">$10 off</p>
            <p className="text-xs text-gray-500">500 points</p>
          </div>
          <input type="radio" name="points" value="500" />
        </label>

        <label className="flex items-center justify-between p-2 rounded border border-amber-300 bg-white cursor-pointer hover:bg-amber-50">
          <div>
            <p className="text-sm font-medium text-gray-900">$25 off</p>
            <p className="text-xs text-gray-500">1,000 points</p>
          </div>
          <input type="radio" name="points" value="1000" />
        </label>
      </div>

      <p className="mt-3 text-xs text-amber-700">
        After this booking, you'll earn +350 points (7 nights × 50)
      </p>
    </div>
  );
}
```

---

## Personalization Engine

### AI/ML Components

```typescript
// lib/personalization/PropertyMatcher.ts
export class PropertyMatcher {
  /**
   * Match properties to guest profile using weighted scoring
   */
  async matchProperties(guestId: number): Promise<PropertyMatch[]> {
    const guest = await this.getGuestWithPreferences(guestId);
    const properties = await this.getAllAvailableProperties();

    const matches = properties.map(property => ({
      property,
      ...this.calculateMatch(guest, property),
    }));

    return matches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);
  }

  private calculateMatch(guest: GuestProfile, property: Property) {
    const weights = {
      amenities: 0.30,
      location: 0.25,
      dining: 0.20,
      propertyType: 0.15,
      history: 0.10,
    };

    const scores = {
      amenities: this.scoreAmenities(guest, property),
      location: this.scoreLocation(guest, property),
      dining: this.scoreDining(guest, property),
      propertyType: this.scorePropertyType(guest, property),
      history: this.scoreHistory(guest, property),
    };

    const matchScore = Object.keys(weights).reduce((total, key) => {
      return total + (scores[key] * weights[key]);
    }, 0);

    const reasons = this.generateReasons(guest, property, scores);

    return { matchScore, reasons };
  }
}

// lib/personalization/ItineraryGenerator.ts
export class ItineraryGenerator {
  /**
   * Generate personalized multi-day itinerary
   */
  async generate(guest: GuestProfile, property: Property, nights: number) {
    const activities = await this.getNearbyActivities(property.location);
    const restaurants = await this.getNearbyRestaurants(property.location);

    const itinerary = [];

    for (let day = 1; day <= nights; day++) {
      const dayPlan = {
        day,
        activities: this.selectActivitiesForDay(guest, activities, day),
        meals: this.selectMealsForDay(guest, restaurants, day),
      };
      itinerary.push(dayPlan);
    }

    return this.optimizeItinerary(itinerary, guest);
  }

  private selectActivitiesForDay(guest: GuestProfile, activities: Activity[], day: number) {
    // Match based on guest preferences and personality
    const preferred = activities.filter(activity => {
      return guest.preferences.activities?.includes(activity.category);
    });

    // Balance across days
    const morning = this.selectForTimeSlot(preferred, 'morning', guest.persona?.pace);
    const afternoon = this.selectForTimeSlot(preferred, 'afternoon', guest.persona?.pace);
    const evening = this.selectForTimeSlot(preferred, 'evening', guest.persona?.socialPreference);

    return { morning, afternoon, evening };
  }
}

// lib/personalization/PreferenceLearner.ts
export class PreferenceLearner {
  /**
   * Learn from guest behavior during stay
   */
  async learnFromBehavior(bookingId: number) {
    const behaviors = await this.getBehavioralData(bookingId);
    const guest = await this.getGuestFromBooking(bookingId);

    for (const behavior of behaviors) {
      const inference = await this.inferPreference(behavior);

      if (inference.confidence > 0.7) {
        await this.upsertPreference({
          guestId: guest.id,
          category: inference.category,
          key: inference.key,
          value: inference.value,
          confidenceScore: inference.confidence,
          source: 'behavioral',
        });
      }
    }

    // Recalculate profile completeness
    await this.updateProfileCompleteness(guest.id);
  }

  private async inferPreference(behavior: BehavioralData): Promise<Inference> {
    // Use ML model or rule-based system
    switch (behavior.behavior_type) {
      case 'thermostat_adjustment':
        if (behavior.frequency >= 3) {
          return {
            category: 'accommodation',
            key: 'ideal_temperature',
            value: behavior.behavior_value.temp,
            confidence: Math.min(0.5 + (behavior.frequency * 0.1), 0.95),
          };
        }
        break;

      case 'restaurant_booking':
        const cuisinePattern = this.detectCuisinePattern(behavior);
        if (cuisinePattern) {
          return {
            category: 'dining',
            key: 'favorite_cuisine',
            value: cuisinePattern.cuisine,
            confidence: cuisinePattern.confidence,
          };
        }
        break;
    }

    return { confidence: 0 };
  }
}
```

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-3)

**Goals:**
- Extend database schema with guest profile tables
- Create basic guest profile API endpoints
- Build guest profile UI components

**Tasks:**
- [ ] Create migration for new tables
- [ ] Extend `guests` table with profile fields
- [ ] Create `guest_personas`, `guest_preferences`, `guest_points_transactions` tables
- [ ] Build GET/PATCH `/api/admin/guests/:id/profile` endpoints
- [ ] Build guest profile dashboard page
- [ ] Create profile edit form components

**Success Metrics:**
- ✓ All new tables created and tested
- ✓ Guest profiles can be viewed and edited
- ✓ Profile completeness calculation working

---

### Phase 2: Booking Integration (Weeks 4-6)

**Goals:**
- Integrate guest profiles into booking flow
- Apply preferences to bookings automatically
- Build personalization options UI

**Tasks:**
- [ ] Extend `bookings` table with personalization fields
- [ ] Create `booking_guests`, `booking_property_configs` tables
- [ ] Enhance POST `/api/admin/bookings` with guest integration
- [ ] Build GuestProfilePreview component
- [ ] Build PersonalizationOptions component
- [ ] Implement preference application logic

**Success Metrics:**
- ✓ Bookings show guest profile preview
- ✓ Preferences automatically applied to bookings
- ✓ Personalization options configurable per booking

---

### Phase 3: Progressive Profiling (Weeks 7-9)

**Goals:**
- Implement survey system
- Build pre-arrival workflow
- Create post-stay feedback loop

**Tasks:**
- [ ] Create `guest_surveys`, `guest_survey_responses` tables
- [ ] Build survey creation and response APIs
- [ ] Create email templates for pre-arrival surveys
- [ ] Implement automated pre-arrival workflow (7 days before)
- [ ] Build post-stay survey forms
- [ ] Implement points rewards for survey completion

**Success Metrics:**
- ✓ Pre-arrival surveys sent automatically
- ✓ 50%+ survey completion rate
- ✓ Guest profiles enriched from survey data

---

### Phase 4: Behavioral Learning (Weeks 10-12)

**Goals:**
- Capture behavioral data during stays
- Learn preferences from actions
- Update profiles automatically

**Tasks:**
- [ ] Create `guest_behavioral_data` table
- [ ] Implement behavioral data capture from IoT events
- [ ] Build PreferenceLearner service
- [ ] Create ML inference rules for common behaviors
- [ ] Implement automatic preference updates
- [ ] Build behavioral insights dashboard

**Success Metrics:**
- ✓ Behavioral data captured for all active bookings
- ✓ Preferences auto-updated with 70%+ confidence
- ✓ Profile completeness increases during stays

---

### Phase 5: Advanced Personalization (Weeks 13-16)

**Goals:**
- Build property matching engine
- Generate personalized itineraries
- Implement Haven AI integration

**Tasks:**
- [ ] Build PropertyMatcher service
- [ ] Implement weighted scoring algorithm
- [ ] Create ItineraryGenerator service
- [ ] Build property recommendation UI
- [ ] Integrate with Haven AI for check-in questions
- [ ] Implement real-time personalization during stays

**Success Metrics:**
- ✓ Property recommendations 85%+ accuracy
- ✓ Personalized itineraries generated for all bookings
- ✓ Haven AI captures preferences during stays

---

### Phase 6: Analytics & Optimization (Weeks 17-20)

**Goals:**
- Build analytics dashboards
- Measure personalization effectiveness
- Optimize matching algorithms

**Tasks:**
- [ ] Create analytics endpoints
- [ ] Build guest satisfaction dashboard
- [ ] Implement A/B testing for recommendations
- [ ] Optimize ML models based on feedback
- [ ] Build ROI tracking for personalization features
- [ ] Create property owner insights reports

**Success Metrics:**
- ✓ Guest satisfaction measurable and improving
- ✓ Repeat booking rate increases 25%+
- ✓ Property owners see clear ROI from personalization

---

## Success Metrics

### Key Performance Indicators (KPIs)

| Metric | Baseline | Target (6 months) | Target (12 months) |
|--------|----------|-------------------|-------------------|
| Profile Completion Rate | 20% | 60% | 85% |
| Repeat Booking Rate | 25% | 40% | 55% |
| Guest Satisfaction Score | 4.2/5 | 4.5/5 | 4.8/5 |
| Personalization Accuracy | N/A | 75% | 90% |
| Survey Completion Rate | N/A | 50% | 70% |
| Points Redemption Rate | N/A | 30% | 45% |
| Revenue per Guest | $800 | $1,000 | $1,250 |
| Profile Enrichment Rate | N/A | 5 prefs/stay | 10 prefs/stay |

### ROI Calculations

**Investment:**
- Development: 20 weeks × $150/hr × 40 hrs = $120,000
- Ongoing maintenance: $2,000/month

**Revenue Impact:**
- Repeat bookings increase: 25% → 55% = +30% bookings
- Average booking value: $800
- If 100 guests/year: 30 additional bookings = $24,000/year
- Premium pricing from personalization: +10% = $8,000/year
- **Total additional revenue: $32,000/year**

**ROI: 26% in Year 1, 100%+ in Year 2**

---

## Conclusion

This integration strategy creates a comprehensive system where:

1. **Guests benefit** from personalized experiences, rewards, and effortless stays
2. **Property owners benefit** from higher satisfaction, repeat bookings, and premium pricing
3. **The system benefits** from continuous learning and improving recommendations

By linking guest profiles deeply with property bookings, we transform the rental experience from transactional to relational, building long-term loyalty and creating a competitive advantage in the market.

**Next Steps:**
1. Review and approve this strategy
2. Prioritize Phase 1 implementation
3. Allocate development resources
4. Begin database migration and API development
5. Design UI/UX mockups for approval
6. Launch pilot program with 20 beta guests
7. Iterate based on feedback and scale
