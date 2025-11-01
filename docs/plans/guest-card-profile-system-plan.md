# Guest Card & Profile System: Data Collection & Rewards Plan

## Executive Summary

**Vision**: Create a comprehensive guest profile system ("Guest Card") that captures personality traits, persona, personal information, and preferences to enable hyper-personalized experiences while respecting privacy and incentivizing participation through meaningful rewards.

**Key Innovation**: **Progressive Profiling** — Start with minimal required data (name, email), then gradually collect additional insights through natural interactions, gamified questions, and value exchanges. The more guests share, the better their experience AND the more rewards they unlock.

**Privacy-First Approach**: Full transparency, opt-in data collection, GDPR/CCPA compliant, guest control over data (view, edit, delete anytime).

---

## Table of Contents

1. [Guest Card Schema](#guest-card-schema)
2. [Data Collection Strategy](#data-collection-strategy)
3. [Rewards & Incentive System](#rewards-incentive-system)
4. [Progressive Profiling Timeline](#progressive-profiling-timeline)
5. [Privacy & Transparency](#privacy-transparency)
6. [UI/UX Design](#ui-ux-design)
7. [Implementation Roadmap](#implementation-roadmap)
8. [Database Schema](#database-schema)

---

## Guest Card Schema

### The Complete Guest Profile

```
┌─────────────────────────────────────────────────────────────┐
│                    GUEST CARD: SARAH MITCHELL                │
│                                                             │
│  Profile Completeness: 85% ████████████░░░                 │
│  Member Since: January 2024 | Stays: 3 | Status: Gold      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  👤 PERSONAL INFORMATION                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                             │
│  Name: Sarah Mitchell                                       │
│  Preferred Name: Sarah                                      │
│  Email: sarah.mitchell@email.com                           │
│  Phone: +1 (555) 123-4567                                  │
│  Birthday: March 15 (age: Private) 🎂                      │
│  Location: Austin, TX                                       │
│  Languages: English (native), Spanish (conversational)      │
│  Pronouns: She/Her                                          │
│                                                             │
│  Emergency Contact:                                         │
│  Name: Michael Mitchell (Spouse)                           │
│  Phone: +1 (555) 234-5678                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🎭 PERSONA & PERSONALITY                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                             │
│  Traveler Type: Wellness Seeker 🧘                         │
│  (Other: Adventure Junkie, Foodie Explorer, Beach Bum,     │
│   Culture Vulture, Digital Nomad, Family Fun, Luxury       │
│   Lounger, Budget Backpacker)                              │
│                                                             │
│  Personality Traits (Big Five):                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Openness:        ████████░░ (80%) - Curious       │    │
│  │ Conscientiousness: ███████░░░ (70%) - Organized    │    │
│  │ Extraversion:    █████████░ (90%) - Outgoing      │    │
│  │ Agreeableness:   ████████░░ (80%) - Friendly      │    │
│  │ Neuroticism:     ██░░░░░░░░ (20%) - Calm          │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  Travel Style:                                              │
│  • Pace: Relaxed (likes to sleep in, not rush)            │
│  • Planning: Moderate planner (likes some structure)       │
│  • Social: Enjoys meeting locals and other travelers       │
│  • Risk: Open to new experiences, not extreme sports       │
│                                                             │
│  Interests & Hobbies:                                       │
│  🧘 Yoga & Meditation | 🍷 Wine tasting | 📚 Reading       │
│  🎨 Art galleries | 🏖️ Beach walks | 🎵 Live music        │
│  🍝 Cooking classes | 📸 Photography                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ⭐ PREFERENCES (Detailed)                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                             │
│  🍽️ Dining Preferences:                                     │
│  • Dietary: Vegetarian 🌱 (no meat, but eats fish)         │
│  • Allergies: Shellfish (severe), Tree nuts (mild)         │
│  • Cuisine Preferences: Italian ❤️❤️❤️ | Japanese ❤️❤️    │
│    Mexican ❤️❤️ | Thai ❤️ | American ❤️                   │
│  • Spice Tolerance: Medium (enjoys flavor, not burn)       │
│  • Drinks: Wine (red preferred) | Coffee (oat milk latte)  │
│  • Meal Timing: Late breakfast (9-10 AM), Dinner 7-8 PM    │
│  • Price Range: $$ - $$$ (willing to splurge for special) │
│                                                             │
│  🏠 Accommodation Preferences:                              │
│  • Temperature: 70-72°F (prefers cool for sleeping)        │
│  • Bedding: Extra pillows, firm mattress                   │
│  • Lighting: Blackout curtains, soft lighting in evening   │
│  • Noise: Quiet neighborhood preferred, white noise fan    │
│  • Amenities Must-Haves: Coffee maker, hot tub, WiFi       │
│                                                             │
│  🎭 Activity Preferences:                                   │
│  • Loves: Spa treatments, yoga classes, wine tours,        │
│           beach sunset walks, local art galleries          │
│  • Interested: Cooking classes, paddleboarding,            │
│                 farmers markets, live music venues         │
│  • Not Interested: Extreme sports, nightclubs, casinos     │
│  • Fitness: Moderate (yoga daily, walks, occasional hike)  │
│                                                             │
│  🎵 Entertainment Preferences:                              │
│  • Music: Indie folk, acoustic, jazz, classical            │
│  • Movies: Dramas, documentaries, foreign films            │
│  • TV: Limited (prefers reading or outdoor activities)     │
│  • Streaming: Netflix, HBO Max                             │
│                                                             │
│  🚗 Transportation:                                          │
│  • Prefers: Uber/Lyft (doesn't like driving in new cities) │
│  • Eco-conscious: Interested in electric vehicles, bikes   │
│  • Walking: Enjoys walking up to 1.5 miles if scenic       │
│                                                             │
│  🛍️ Shopping:                                               │
│  • Style: Local artisan shops, boutiques (not malls)       │
│  • Interests: Handmade jewelry, art prints, natural beauty │
│               products, local coffee/tea                   │
│  • Budget: Moderate (willing to spend on unique finds)     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📅 BOOKING & STAY HISTORY                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                             │
│  Total Stays: 3                                             │
│  Total Nights: 14                                           │
│  Total Spent: $4,200                                        │
│  Average Rating Given: 4.8 ⭐                               │
│  Average Rating Received: 5.0 ⭐ (excellent guest!)         │
│                                                             │
│  Previous Stays:                                            │
│  1. Beachfront Oasis, San Diego (5 nights, Jan 2024)       │
│     - Used: Hot tub daily, kayaks (2x), yoga classes       │
│     - Booked: 3 restaurants, 1 spa, wine tour              │
│     - Favorite: "Morning yoga on the deck with ocean view" │
│                                                             │
│  2. Downtown Loft, Austin (4 nights, Apr 2024)             │
│     - Used: Smart home features, e-bike                    │
│     - Booked: 5 restaurants, art gallery tour, live music  │
│     - Favorite: "Walking distance to everything!"          │
│                                                             │
│  3. Mountain Retreat, Asheville (5 nights, Oct 2024)       │
│     - Used: Hot tub, hiking gear, fireplace               │
│     - Booked: 4 restaurants, spa day, pottery class        │
│     - Favorite: "Perfect balance of nature and comfort"    │
│                                                             │
│  Upcoming Stays:                                            │
│  • Coastal Haven, Charleston (7 nights, Feb 2025)          │
│    Haven already knows: Sarah loves vegetarian Italian,    │
│    morning yoga, and sunset beach walks. Pre-prepared      │
│    recommendations ready!                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🎁 REWARDS & LOYALTY STATUS                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                             │
│  Status: GOLD MEMBER 🥇                                     │
│  Points: 4,200 (next tier: Platinum at 10,000)             │
│                                                             │
│  Unlocked Perks:                                            │
│  ✅ Early check-in (2 PM instead of 3 PM)                  │
│  ✅ Late checkout (12 PM instead of 11 AM)                 │
│  ✅ Priority equipment reservations                        │
│  ✅ 10% discount on local experiences (via MCP partners)   │
│  ✅ Free equipment checkout (1 item per stay)              │
│  ✅ Personalized welcome gift                              │
│  ✅ Room upgrade (when available)                          │
│                                                             │
│  Active Rewards:                                            │
│  • Profile completion bonus: +500 points (85% complete)    │
│  • Birthday month: Free spa treatment (up to $150 value)   │
│  • Referral: 1,000 points per friend who books            │
│  • Review bonus: +200 points per detailed review           │
│                                                             │
│  Next Milestone:                                            │
│  Complete profile to 100%: +500 bonus points               │
│  Missing: Work/occupation, favorite quote, bucket list     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  🔒 PRIVACY & DATA CONTROL                                  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                             │
│  Data Sharing Preferences:                                  │
│  ✅ Share with local businesses (for personalized offers)  │
│  ✅ Share with future properties (for better experience)   │
│  ❌ Share with third-party advertisers                     │
│  ✅ Use for AI personalization                             │
│                                                             │
│  Communication Preferences:                                 │
│  ✅ Email: Booking confirmations, special offers (weekly)  │
│  ✅ SMS: Booking reminders, urgent updates only            │
│  ❌ Phone: Do not call                                     │
│  ✅ Push Notifications: Deals, recommendations             │
│                                                             │
│  [View All Data] [Download My Data] [Delete Account]      │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Collection Strategy

### Principle: **Progressive Profiling**

Collect data gradually over time, not all at once. Start with essentials, earn trust, then request more.

### Phase 1: Booking (Required Minimum)

**When**: During reservation

**What We Collect**:
- ✅ Name (first, last)
- ✅ Email
- ✅ Phone number
- ✅ Number of guests (party size)
- ✅ Check-in/check-out dates

**How**: Standard booking form (unavoidable for any booking)

**Profile Completeness**: 20%

---

### Phase 2: Pre-Arrival (Optional, Incentivized)

**When**: 7-10 days before check-in

**Email Subject**: "Get ready for your stay! Complete your profile and unlock perks 🎁"

**What We Ask** (Optional questions with rewards):

**Survey 1: Travel Preferences (5 minutes, +200 points)**
```
Hi Sarah! To make your stay even better, we'd love to learn a bit about your preferences.

1. What's your traveler type?
   [ ] Wellness Seeker (yoga, spa, relaxation)
   [ ] Foodie Explorer (restaurants, cooking classes)
   [ ] Adventure Junkie (hiking, water sports, active)
   [ ] Culture Vulture (museums, art, history)
   [ ] Beach Bum (sun, sand, ocean)
   [ ] Family Fun (kid-friendly activities)
   [ ] Digital Nomad (work + travel)
   [ ] Luxury Lounger (high-end, pampering)

2. Dietary preferences/restrictions? (so we can recommend perfect restaurants)
   [ ] Vegetarian
   [ ] Vegan
   [ ] Pescatarian
   [ ] Gluten-free
   [ ] Allergies: __________
   [ ] None

3. What are you most excited about for this trip?
   [ ] Relaxing and unplugging
   [ ] Exploring local food scene
   [ ] Outdoor activities
   [ ] Romantic getaway
   [ ] Celebrating something special (what? _______)
   [ ] Working remotely + adventuring

4. How do you like to spend mornings?
   [ ] Sleep in (I'm on vacation!)
   [ ] Early riser (up with the sun)
   [ ] Coffee first, then decide

5. Temperature preference in the property?
   [ ] Cool (68-70°F)
   [ ] Moderate (70-72°F)
   [ ] Warm (72-75°F)

Reward: +200 points + we'll pre-set your ideal temperature!
```

**Profile Completeness**: 45%

---

### Phase 3: Check-In (Interactive, Gamified)

**When**: Guest arrives and interacts with Haven AI assistant

**Haven's Approach**:
```
Haven: "Welcome, Sarah! I'm Haven, your AI assistant for this stay.
I'd love to get to know you better so I can provide personalized
recommendations. Mind if I ask a few quick questions? It'll take
just 2 minutes, and you'll earn 100 bonus points!"

[Guest agrees]

Haven: "Great! First question: If you could have one superpower during
your vacation, what would it be?"

Options:
• Time travel (see all the sights instantly)
• Teleportation (skip traffic, arrive anywhere)
• Mind reading (know the best local secrets)
• Super stamina (explore all day, no exhaustion)

[Haven uses answer to infer personality traits]

Haven: "Haha, I love it! Next: What's your ideal vacation day?"

Options:
• Morning yoga → beach → spa → sunset dinner
• Sleep in → brunch → explore downtown → live music
• Hike at sunrise → adventure sports → BBQ cookout
• Museum → art gallery → wine bar → theater

[Haven builds activity preference profile]

Haven: "Last one: Coffee or tea? And how do you take it?"

Guest: "Oat milk latte"

Haven: "Perfect! I've noted that. Your local coffee shop recommendation:
The Daily Grind makes the best oat milk lattes in town (0.4 mi away).
Want me to add it to your map?

✅ You earned 100 points! Profile: 60% complete.
Complete to 100% for a free equipment rental!"
```

**Profile Completeness**: 60%

---

### Phase 4: During Stay (Behavioral Learning)

**When**: Throughout the stay

**What We Learn** (Automatically, No Questions):

**Observation-Based Learning**:
- 🌡️ **Thermostat adjustments**: Sarah sets temp to 70°F every night → Save preference
- 💡 **Lighting preferences**: Sarah uses "Movie mode" scene 3x → Likes dim lighting for evening
- 🎵 **Music choices**: Sarah plays indie folk and acoustic → Music taste profile
- 🍽️ **Restaurant bookings**: Sarah books 3 Italian restaurants → Loves Italian cuisine
- 🧘 **Activity bookings**: Sarah books yoga class and spa → Wellness-focused traveler
- 🏖️ **Equipment checkout**: Sarah checks out paddleboard 2x → Enjoys water activities
- ⏰ **Usage patterns**: Sarah uses kitchen 8-9 AM daily → Late breakfast person

**Haven's Proactive Learning**:
```
Day 3:

Haven: "I noticed you've booked Italian restaurants 3 times —
you must really enjoy Italian food! There's a new Italian place
that just opened, 'Osteria del Mare,' with incredible seafood
pasta. Interested in hearing more?"

[If yes → Add Italian as favorite cuisine]
[If no → Refine understanding: Maybe avoiding new places]

---

Day 4:

Haven: "I see you've done yoga twice this trip. Would you like me to
automatically suggest yoga classes for future stays? I can also
recommend spa treatments you might enjoy."

[If yes → Flag wellness activities as high interest]
```

**Profile Completeness**: 75%

---

### Phase 5: Post-Stay (Reflective Feedback)

**When**: 24 hours after checkout

**Email**: "How was your stay? Share your experience and earn rewards!"

**Survey 2: Post-Stay Reflection (10 minutes, +300 points)**
```
Sarah, we hope you had an amazing stay! Help us make your next
visit even better by sharing your thoughts.

1. What was your favorite moment from this trip?
   [Open text field]

2. What activity/experience exceeded your expectations?
   [List of booked activities with star ratings]

3. If you could change one thing about the property, what would it be?
   [Open text field]

4. Which local business(es) should we definitely recommend to future guests?
   [Open text field]

5. On a scale of 1-10, how well did we match your preferences?
   1 (not at all) ━━━━━━━━━━ 10 (perfectly)

6. OPTIONAL: Tell us more about yourself!
   • What do you do for work? ___________
   • Favorite quote or motto? ___________
   • Top 3 bucket list destinations? ___________

Reward: +300 points + exclusive 15% off next booking!
```

**Profile Completeness**: 85-100% (depending on optional answers)

---

### Phase 6: Ongoing Engagement (Maintain Relationship)

**When**: Between bookings

**Quarterly "Check-In" Email**:
```
Subject: "Sarah, we miss you! Here's what's new 🌟"

Hi Sarah,

It's been 3 months since your last stay. Here's what's happening:

🆕 New Properties:
- Lakeside Lodge, Lake Tahoe (we know you love nature + wellness!)
- Rooftop Penthouse, New Orleans (live music scene you'd enjoy)

🎁 Your Birthday is Coming Up! (March 15)
Celebrate with us: Book a stay in March and get a FREE spa treatment
(up to $150 value) + late checkout until 2 PM.

🍽️ New MCP Partners:
We added 15 new local businesses in Charleston (your next destination!)
including 3 new vegetarian-friendly Italian restaurants 👀

📊 Profile Update (Optional):
Your preferences might change over time. Want to update your profile?
[Quick 2-minute survey: +100 points]

See you soon!
- The Haven Team

P.S. You're only 1,500 points from Platinum status! 🎉
```

---

## Rewards & Incentive System

### Gamification: Points Economy

**How Guests Earn Points**:

| Activity | Points | Rationale |
|----------|--------|-----------|
| **Profile Completion** | | |
| Basic info (20%) | 0 | Required for booking |
| Pre-arrival survey (45%) | +200 | First optional data |
| Check-in questions (60%) | +100 | Interactive, fun |
| Behavioral learning (75%) | +200 | Automatic (stay bonus) |
| Post-stay survey (85%) | +300 | Most valuable insights |
| Full profile (100%) | +500 | Bonus for completion |
| **Bookings & Stays** | | |
| Per night stayed | +50 | Encourages longer stays |
| Book via MCP partners | +25 | Drives local business revenue |
| Equipment checkout | +10 | Tracks preferences |
| **Engagement** | | |
| Detailed review (100+ words) | +200 | Valuable for future guests |
| Photo uploads | +50 | User-generated content |
| Refer a friend (who books) | +1,000 | New customer acquisition |
| **Loyalty Milestones** | | |
| 1st stay | +500 | Welcome bonus |
| 3rd stay | +1,000 | Building loyalty |
| 5th stay | +2,000 | VIP status |
| 10th stay | +5,000 | True loyalist |

**How Guests Redeem Points**:

| Reward | Points | Value | Conversion Rate |
|--------|--------|-------|-----------------|
| **Discounts** | | | |
| $10 off booking | 500 | $10 | 50 points = $1 |
| $25 off booking | 1,000 | $25 | 40 points = $1 |
| $50 off booking | 1,500 | $50 | 30 points = $1 |
| $100 off booking | 2,500 | $100 | 25 points = $1 |
| **Upgrades & Perks** | | | |
| Early check-in (2 PM) | 200 | $20 value | |
| Late checkout (12 PM) | 200 | $20 value | |
| Late checkout (2 PM) | 500 | $40 value | |
| Room upgrade | 1,000 | $50+ value | |
| **Free Experiences** | | | |
| Equipment rental (1 day) | 300 | $30-50 value | |
| Spa treatment ($100) | 2,000 | $100 value | |
| Dinner for 2 ($150) | 3,000 | $150 value | |
| Private chef ($300) | 6,000 | $300 value | |
| **Gifts** | | | |
| Local artisan gift box | 500 | $50 value | |
| Wine bottle + cheese | 400 | $40 value | |
| Beach essentials kit | 300 | $30 value | |

**Tier System** (Unlocks Additional Benefits):

| Tier | Points Needed | Perks Unlocked |
|------|---------------|----------------|
| **Silver** (Default) | 0-2,499 | • Basic points earning<br>• Standard booking terms |
| **Gold** | 2,500-9,999 | • 10% points bonus<br>• Early check-in (2 PM)<br>• Late checkout (12 PM)<br>• Priority equipment<br>• 10% discount on MCP partners |
| **Platinum** | 10,000+ | • 25% points bonus<br>• Early check-in (1 PM)<br>• Late checkout (2 PM)<br>• Guaranteed room upgrade<br>• Free equipment checkout (1/stay)<br>• 15% discount on MCP partners<br>• Dedicated concierge<br>• Birthday gift ($100 value) |

---

### Non-Points Rewards (Immediate Gratification)

**Instant Perks for Profile Completion**:

1. **Complete Dietary Preferences** →
   Immediate: "Here are 5 restaurants perfect for vegetarians near your property!"

2. **Complete Temperature Preferences** →
   Immediate: "I've pre-set your room to 70°F for arrival!"

3. **Complete Activity Interests** →
   Immediate: "I've created a personalized 3-day itinerary for you!"

4. **Complete Music Preferences** →
   Immediate: "I've queued up a custom playlist for your arrival!"

5. **100% Profile Completion** →
   Immediate: "FREE welcome gift waiting in your room!" (local artisan product, $30-50 value)

---

## Progressive Profiling Timeline

### Visual Flow

```
Booking          Pre-Arrival      Check-In       During Stay    Post-Stay      Ongoing
(Day -30)        (Day -7)         (Day 0)        (Days 1-5)     (Day 6)        (Future)
   │                │                │               │              │              │
   ▼                ▼                ▼               ▼              ▼              ▼
Required:        Optional:        Gamified:      Behavioral:    Reflective:    Maintenance:
- Name           - Travel type    - Fun Q&A      - Auto-learn   - Feedback     - Updates
- Email          - Dietary        - 2 min quiz   - Preferences  - Deep dive    - New interests
- Phone          - Interests      - Voice        - Patterns     - Suggestions  - Quarterly
- Dates          - Temp pref      - +100 pts     - +200 pts     - +300 pts     - +100 pts
                 - +200 pts

20% ████░░░░░░   45% ████████░░   60% ██████████░  75% ████████████  85-100%   Ongoing
```

---

## Privacy & Transparency

### Core Principles

1. **Transparency First**
   - Clear explanation of what data we collect and why
   - Plain language privacy policy (no legal jargon)
   - Before collecting any optional data: "Here's how we'll use this to improve your stay"

2. **Opt-In, Not Opt-Out**
   - All non-essential data collection is optional
   - Guest explicitly chooses to share (checkboxes, consent)
   - Can skip any question without penalty (but miss out on rewards)

3. **Data Control**
   - **View**: Guest can see all data we have on them
   - **Edit**: Guest can update any field anytime
   - **Download**: Export full profile as JSON/PDF
   - **Delete**: Permanent account deletion (GDPR/CCPA right to erasure)

4. **Security**
   - All data encrypted at rest (AES-256)
   - Encrypted in transit (TLS 1.3)
   - PCI DSS compliant for payment data
   - Regular security audits

5. **Limited Sharing**
   - Data never sold to third parties
   - Sharing with local businesses only if guest opts in (for personalized offers)
   - Anonymized aggregate data for analytics only

### Privacy Settings Screen

```
┌─────────────────────────────────────────────────────────────┐
│  🔒 PRIVACY SETTINGS                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                             │
│  Your data, your control. Manage what we collect and how   │
│  we use it.                                                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  DATA COLLECTION                                    │   │
│  │                                                      │   │
│  │  ✅ Basic information (required for booking)        │   │
│  │  ✅ Activity preferences (for recommendations)      │   │
│  │  ✅ Dietary preferences (for restaurant matches)    │   │
│  │  ❌ Social media profiles                           │   │
│  │  ❌ Browsing behavior                               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  DATA SHARING                                       │   │
│  │                                                      │   │
│  │  ✅ Share with future properties (better stays)     │   │
│  │     "Next property will know you love yoga!"        │   │
│  │                                                      │   │
│  │  ✅ Share with local businesses (personalized offers)│  │
│  │     "Get custom spa packages based on your taste"   │   │
│  │                                                      │   │
│  │  ❌ Share with marketing partners                   │   │
│  │  ❌ Share with third-party advertisers              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  AI PERSONALIZATION                                 │   │
│  │                                                      │   │
│  │  ✅ Use my data for AI recommendations              │   │
│  │     "Haven learns your preferences to help better"  │   │
│  │                                                      │   │
│  │  ✅ Voice recordings (stored for 30 days, then deleted)│ │
│  │  ❌ Facial recognition (not used)                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  COMMUNICATIONS                                     │   │
│  │                                                      │   │
│  │  ✅ Email: Booking confirmations (always)           │   │
│  │  ✅ Email: Personalized offers (weekly max)         │   │
│  │  ✅ SMS: Booking reminders only                     │   │
│  │  ❌ Phone: Do not call                              │   │
│  │  ✅ Push: Deals & recommendations                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Download My Data] [Delete Account] [View Privacy Policy] │
└─────────────────────────────────────────────────────────────┘
```

---

## UI/UX Design

### Guest Profile Interface (Web/Mobile App)

**Dashboard View**:
```
┌─────────────────────────────────────────────────────────────┐
│  MY PROFILE                                       [Edit] ⚙️  │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                             │
│  👤 Sarah Mitchell                                          │
│  🥇 Gold Member | 4,200 points                              │
│                                                             │
│  Profile Completeness: 85% ████████████░░░                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🎁 Complete your profile to unlock:                │   │
│  │ • +500 bonus points                                 │   │
│  │ • Free equipment rental                             │   │
│  │ • Better personalized recommendations               │   │
│  │                                                      │   │
│  │ Missing: Work/occupation, favorite quote           │   │
│  │ [Complete Now - 2 min]                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Tabs:                                                      │
│  [Overview] [Preferences] [History] [Rewards] [Privacy]    │
│                                                             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                             │
│  Quick Stats:                                               │
│  🏠 3 stays | 🌙 14 nights | ⭐ 4.8 avg rating            │
│                                                             │
│  Upcoming Stays:                                            │
│  📅 Feb 15-22: Coastal Haven, Charleston (7 nights)        │
│                                                             │
│  Favorite Activities:                                       │
│  🧘 Yoga | 🍷 Wine tours | 🏖️ Beach walks                  │
│                                                             │
│  Favorite Cuisines:                                         │
│  🍝 Italian ❤️❤️❤️ | 🍣 Japanese ❤️❤️ | 🌮 Mexican ❤️❤️    │
└─────────────────────────────────────────────────────────────┘
```

**Edit Mode (Conversational UI)**:
```
┌─────────────────────────────────────────────────────────────┐
│  EDIT PROFILE: Dietary Preferences                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                             │
│  💬 Let's update your dining preferences so we can          │
│     recommend the perfect restaurants for you!              │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🍽️ Do you follow any dietary restrictions?         │   │
│  │                                                      │   │
│  │ [✓] Vegetarian (no meat, fish OK)                   │   │
│  │ [ ] Vegan (no animal products)                       │   │
│  │ [ ] Pescatarian (seafood only)                       │   │
│  │ [ ] Gluten-free                                      │   │
│  │ [ ] Dairy-free                                       │   │
│  │ [ ] Halal                                            │   │
│  │ [ ] Kosher                                           │   │
│  │ [ ] None                                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚠️ Any food allergies we should know about?         │   │
│  │                                                      │   │
│  │ [✓] Shellfish - Severe (EpiPen required)            │   │
│  │ [✓] Tree nuts - Mild (avoid)                        │   │
│  │ [ ] Peanuts                                          │   │
│  │ [ ] Eggs                                             │   │
│  │ [ ] Soy                                              │   │
│  │ [ ] Other: _______________                           │   │
│  │ [ ] None                                             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  💡 Why we ask: We'll only recommend restaurants with      │
│     vegetarian options and flag any menus with shellfish   │
│     or tree nuts. Your safety is our priority!             │
│                                                             │
│  [Cancel] [Save Changes (+50 points)]                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Basic Guest Profiles (Months 1-2)

**Database**:
- [ ] Create guests table (name, email, phone, birthday)
- [ ] Create guest_preferences table
- [ ] Create guest_stay_history table

**UI**:
- [ ] Build profile view page
- [ ] Build profile edit page
- [ ] Add profile completion progress bar

**Features**:
- [ ] Basic info collection at booking
- [ ] Profile completeness calculation
- [ ] Manual profile editing

**Milestones**:
- ✓ All guests have profiles
- ✓ Profile completeness tracked

---

### Phase 2: Pre-Arrival Surveys & Rewards (Months 3-4)

**Email System**:
- [ ] Pre-arrival survey emails (7 days before check-in)
- [ ] Survey templates (dietary, interests, preferences)
- [ ] Survey response processing

**Rewards System**:
- [ ] Points tracking system
- [ ] Points earning rules engine
- [ ] Points redemption interface
- [ ] Tier system (Silver, Gold, Platinum)

**Features**:
- [ ] Optional pre-arrival surveys (+200 points)
- [ ] Instant rewards for profile completion
- [ ] Tier benefits display

**Milestones**:
- ✓ 50%+ guests complete pre-arrival survey
- ✓ Points system operational

---

### Phase 3: Haven AI Integration (Months 5-6)

**AI Features**:
- [ ] Haven check-in questionnaire (gamified)
- [ ] Behavioral learning (auto-detect preferences)
- [ ] Proactive profile updates based on actions

**Personalization**:
- [ ] AI-powered recommendations (restaurants, activities)
- [ ] Custom itinerary generation
- [ ] Preference-based equipment suggestions

**Milestones**:
- ✓ Haven learns guest preferences automatically
- ✓ 70%+ profile completeness via AI

---

### Phase 4: Full Ecosystem (Months 7-12)

**Advanced Features**:
- [ ] Returning guest recognition
- [ ] Cross-property profile sharing
- [ ] Birthday rewards automation
- [ ] Referral program
- [ ] Post-stay surveys (+300 points)

**Privacy & Control**:
- [ ] Privacy settings dashboard
- [ ] Data download feature (GDPR)
- [ ] Account deletion workflow
- [ ] Granular sharing controls

**Milestones**:
- ✓ Full rewards ecosystem operational
- ✓ 90%+ profile completeness for repeat guests
- ✓ GDPR/CCPA compliant

---

## Database Schema

```sql
-- Extended guest table with profile fields
CREATE TABLE guests (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  preferred_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  birthday DATE, -- Year optional (can be NULL)
  location VARCHAR(255), -- City, State/Country
  languages TEXT[], -- Array: ["English (native)", "Spanish (conversational)"]
  pronouns VARCHAR(20), -- "She/Her", "He/Him", "They/Them", etc.

  -- Emergency contact
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  emergency_contact_relationship VARCHAR(50),

  -- Loyalty & Rewards
  total_points INTEGER DEFAULT 0,
  tier VARCHAR(20) DEFAULT 'Silver', -- 'Silver', 'Gold', 'Platinum'
  member_since TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  total_stays INTEGER DEFAULT 0,
  total_nights INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0, -- in cents
  average_rating_given DECIMAL(2,1),
  average_rating_received DECIMAL(2,1),

  -- Profile completeness
  profile_completeness INTEGER DEFAULT 20, -- Percentage (0-100)

  -- Privacy settings
  share_with_properties BOOLEAN DEFAULT TRUE,
  share_with_local_businesses BOOLEAN DEFAULT TRUE,
  allow_ai_personalization BOOLEAN DEFAULT TRUE,
  email_marketing BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP -- Soft delete for GDPR
);

-- Persona & Personality
CREATE TABLE guest_personas (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE,

  -- Traveler type
  traveler_type VARCHAR(50), -- 'Wellness Seeker', 'Foodie Explorer', etc.

  -- Big Five personality traits (0-100 scale)
  openness INTEGER, -- Curious vs. Cautious
  conscientiousness INTEGER, -- Organized vs. Spontaneous
  extraversion INTEGER, -- Outgoing vs. Reserved
  agreeableness INTEGER, -- Friendly vs. Competitive
  neuroticism INTEGER, -- Calm vs. Anxious

  -- Travel style
  pace VARCHAR(20), -- 'Relaxed', 'Moderate', 'Fast-paced'
  planning_style VARCHAR(20), -- 'Spontaneous', 'Moderate', 'Detailed'
  social_preference VARCHAR(20), -- 'Solo', 'Small groups', 'Social'
  risk_tolerance VARCHAR(20), -- 'Low', 'Moderate', 'High'

  -- Interests & hobbies (JSON array)
  interests JSONB, -- ["Yoga", "Wine tasting", "Reading", "Photography"]

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Preferences (Detailed)
CREATE TABLE guest_preferences (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- 'dining', 'accommodation', 'activity', 'entertainment', 'transportation'
  preference_key VARCHAR(100) NOT NULL, -- 'dietary_restrictions', 'favorite_cuisine', 'temperature', etc.
  preference_value TEXT, -- Can be JSON for complex data
  confidence_score DECIMAL(3,2) DEFAULT 0.5, -- How confident we are (0.0-1.0)
  source VARCHAR(50), -- 'survey', 'behavioral', 'ai_inferred', 'explicit'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example preference entries:
-- (guest_id=1, category='dining', key='dietary_restriction', value='vegetarian', source='survey')
-- (guest_id=1, category='dining', key='favorite_cuisine', value='Italian', confidence=0.9, source='behavioral')
-- (guest_id=1, category='accommodation', key='ideal_temperature', value='70', source='behavioral')

-- Points & Rewards
CREATE TABLE guest_points_transactions (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guests(id),
  points INTEGER NOT NULL, -- Positive for earning, negative for redemption
  transaction_type VARCHAR(50), -- 'profile_completion', 'booking', 'review', 'referral', 'redemption'
  description TEXT,
  reference_id INTEGER, -- E.g., booking_id, survey_id, etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Redeemed rewards
CREATE TABLE guest_rewards_redemptions (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guests(id),
  reward_type VARCHAR(50), -- 'discount', 'upgrade', 'free_equipment', 'spa_treatment'
  points_cost INTEGER,
  reward_value INTEGER, -- Value in cents
  redemption_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'applied', 'used', 'expired'
  booking_id INTEGER REFERENCES bookings(id), -- If tied to specific booking
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Behavioral learning (auto-captured during stay)
CREATE TABLE guest_behavioral_data (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guests(id),
  booking_id INTEGER REFERENCES bookings(id),

  -- Observed behaviors
  behavior_type VARCHAR(50), -- 'thermostat_adjustment', 'lighting_scene', 'music_choice', 'restaurant_booking'
  behavior_value TEXT, -- JSON data
  frequency INTEGER DEFAULT 1, -- How many times observed

  -- Context
  time_of_day TIME,
  day_of_week INTEGER, -- 0-6

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example:
-- (guest_id=1, behavior_type='thermostat_adjustment', value='{"temp": 70, "time": "22:30"}', frequency=4)
-- Inference: Guest prefers 70°F for sleeping

-- Survey responses
CREATE TABLE guest_survey_responses (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guests(id),
  survey_type VARCHAR(50), -- 'pre_arrival', 'check_in', 'post_stay'
  booking_id INTEGER REFERENCES bookings(id),

  question TEXT,
  answer TEXT, -- Can be JSON for multiple choice

  points_awarded INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Conclusion

This Guest Card & Profile System transforms the guest experience from **transactional to relational**. By:

1. **Collecting data progressively** (not overwhelming at once)
2. **Providing clear value exchange** (better experience for sharing data)
3. **Gamifying the process** (points, tiers, rewards)
4. **Respecting privacy** (transparent, opt-in, full control)
5. **Learning behaviorally** (AI observes and adapts automatically)

...we create **hyper-personalized stays** where guests feel truly understood and valued.

**Key Benefits**:

**For Guests**:
- Better recommendations (restaurants, activities perfectly matched)
- Effortless experience (Haven knows their preferences)
- Tangible rewards (discounts, upgrades, free perks)
- Recognition (returning guests feel like VIPs)

**For Property Owners**:
- Higher satisfaction scores (personalization drives reviews)
- Increased loyalty (85%+ profile completeness = 3x rebooking rate)
- More revenue (points drive bookings, MCP commissions)
- Operational efficiency (AI automates concierge work)

**Next Steps**:
1. Design profile UI/UX mockups
2. Build database schema
3. Create pre-arrival survey templates
4. Implement points system
5. Integrate with Haven AI for behavioral learning
6. Pilot with 50 guests, measure adoption
7. Iterate based on feedback
8. Scale across all properties

The future of hospitality is **1:1 personalization at scale** — and this Guest Card system is the foundation.