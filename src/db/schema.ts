import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Properties table
export const properties = sqliteTable('properties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),

  // NEW: Rental type for hybrid support
  type: text('type').notNull().default('long-term'), // 'short-term' | 'long-term' | 'hybrid'

  propertyType: text('property_type').notNull(), // apartment, house, commercial, etc.
  units: integer('units').notNull().default(1),

  // NEW: Short-term rental fields
  nightlyRate: integer('nightly_rate'), // in cents, for short-term rentals
  cleaningFee: integer('cleaning_fee'), // in cents
  amenities: text('amenities'), // JSON string of amenities

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Tenants table
export const tenants = sqliteTable('tenants', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone').notNull(),
  emergencyContact: text('emergency_contact'),
  emergencyPhone: text('emergency_phone'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Leases table
export const leases = sqliteTable('leases', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  tenantId: integer('tenant_id').notNull().references(() => tenants.id),
  unitNumber: text('unit_number'),
  startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
  endDate: integer('end_date', { mode: 'timestamp' }).notNull(),
  monthlyRent: integer('monthly_rent').notNull(), // stored in cents
  securityDeposit: integer('security_deposit').notNull(), // stored in cents
  status: text('status').notNull().default('active'), // active, expired, terminated
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Payments table
export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  leaseId: integer('lease_id').notNull().references(() => leases.id),
  amount: integer('amount').notNull(), // stored in cents
  dueDate: integer('due_date', { mode: 'timestamp' }).notNull(),
  paidDate: integer('paid_date', { mode: 'timestamp' }),
  status: text('status').notNull().default('pending'), // pending, paid, late, partial
  paymentMethod: text('payment_method'), // check, bank_transfer, credit_card, etc.
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Maintenance requests table
export const maintenanceRequests = sqliteTable('maintenance_requests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  tenantId: integer('tenant_id').references(() => tenants.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  priority: text('priority').notNull().default('medium'), // low, medium, high, urgent
  status: text('status').notNull().default('open'), // open, in_progress, completed, cancelled
  category: text('category'), // plumbing, electrical, hvac, appliance, etc.
  completedDate: text('completed_date'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// NEW: Guests table (separate from tenants) - Extended for Guest Card Profile System
export const guests = sqliteTable('guests', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Basic Information
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  preferredName: text('preferred_name'),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  birthday: integer('birthday', { mode: 'timestamp' }), // Date only (year optional)
  location: text('location'), // City, State/Country
  languages: text('languages'), // JSON array: ["English (native)", "Spanish (conversational)"]
  pronouns: text('pronouns'), // "She/Her", "He/Him", "They/Them", etc.

  // Emergency Contact
  emergencyContact: text('emergency_contact'),
  emergencyPhone: text('emergency_phone'),
  emergencyContactRelationship: text('emergency_contact_relationship'),

  // Loyalty & Rewards
  totalPoints: integer('total_points').notNull().default(0),
  tier: text('tier').notNull().default('Silver'), // 'Silver', 'Gold', 'Platinum'
  memberSince: integer('member_since', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  totalStays: integer('total_stays').notNull().default(0),
  totalNights: integer('total_nights').notNull().default(0),
  totalSpent: integer('total_spent').notNull().default(0), // in cents
  averageRatingGiven: text('average_rating_given'), // stored as text: "4.8"
  averageRatingReceived: text('average_rating_received'), // stored as text: "5.0"

  // Profile Completeness
  profileCompleteness: integer('profile_completeness').notNull().default(20), // Percentage (0-100)

  // Privacy Settings
  shareWithProperties: integer('share_with_properties', { mode: 'boolean' }).notNull().default(true),
  shareWithLocalBusinesses: integer('share_with_local_businesses', { mode: 'boolean' }).notNull().default(true),
  allowAiPersonalization: integer('allow_ai_personalization', { mode: 'boolean' }).notNull().default(true),
  emailMarketing: integer('email_marketing', { mode: 'boolean' }).notNull().default(true),
  smsNotifications: integer('sms_notifications', { mode: 'boolean' }).notNull().default(true),

  // Metadata
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }), // Soft delete for GDPR
});

// NEW: Bookings table (short-term reservations) - Extended for Guest Integration
export const bookings = sqliteTable('bookings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  guestId: integer('guest_id').notNull().references(() => guests.id),
  checkInDate: integer('check_in_date', { mode: 'timestamp' }).notNull(),
  checkOutDate: integer('check_out_date', { mode: 'timestamp' }).notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled'
  nightlyRate: integer('nightly_rate').notNull(), // in cents
  cleaningFee: integer('cleaning_fee').default(0), // in cents
  totalAmount: integer('total_amount').notNull(), // in cents
  specialRequests: text('special_requests'),

  // Guest Profile Integration
  applyGuestPreferences: integer('apply_guest_preferences', { mode: 'boolean' }).notNull().default(true),
  bookingPreferences: text('booking_preferences'), // JSON - booking-specific overrides
  personalizedItinerary: text('personalized_itinerary'), // JSON - generated itinerary
  pointsEarned: integer('points_earned').notNull().default(0),
  pointsRedeemed: integer('points_redeemed').notNull().default(0),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// NEW: IoT Devices table (foundation for Phase 2)
export const iotDevices = sqliteTable('iot_devices', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull().references(() => properties.id),
  haEntityId: text('ha_entity_id').notNull().unique(), // Home Assistant entity ID
  deviceType: text('device_type').notNull(), // 'light' | 'lock' | 'thermostat' | 'sensor' | 'switch' | 'media_player'
  name: text('name').notNull(),
  room: text('room'), // 'Living Room', 'Bedroom 1', etc.
  guestControllable: integer('guest_controllable', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// NEW: IoT Permissions table (temporary guest access)
export const iotPermissions = sqliteTable('iot_permissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id),
  deviceId: integer('device_id').notNull().references(() => iotDevices.id),
  grantedAt: integer('granted_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  revokedAt: integer('revoked_at', { mode: 'timestamp' }),
});

// ============================================
// GUEST PROFILE SYSTEM TABLES
// ============================================

// Guest Personas (Personality & Travel Style)
export const guestPersonas = sqliteTable('guest_personas', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guestId: integer('guest_id').notNull().references(() => guests.id, { onDelete: 'cascade' }),

  // Traveler Type
  travelerType: text('traveler_type'), // 'Wellness Seeker', 'Foodie Explorer', 'Adventure Junkie', etc.

  // Big Five Personality Traits (0-100 scale)
  openness: integer('openness'), // Curious vs. Cautious
  conscientiousness: integer('conscientiousness'), // Organized vs. Spontaneous
  extraversion: integer('extraversion'), // Outgoing vs. Reserved
  agreeableness: integer('agreeableness'), // Friendly vs. Competitive
  neuroticism: integer('neuroticism'), // Calm vs. Anxious

  // Travel Style
  pace: text('pace'), // 'Relaxed', 'Moderate', 'Fast-paced'
  planningStyle: text('planning_style'), // 'Spontaneous', 'Moderate', 'Detailed'
  socialPreference: text('social_preference'), // 'Solo', 'Small groups', 'Social'
  riskTolerance: text('risk_tolerance'), // 'Low', 'Moderate', 'High'

  // Interests & Hobbies (JSON array)
  interests: text('interests'), // ["Yoga", "Wine tasting", "Reading", "Photography"]

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Guest Preferences (Detailed preferences across categories)
export const guestPreferences = sqliteTable('guest_preferences', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guestId: integer('guest_id').notNull().references(() => guests.id, { onDelete: 'cascade' }),
  category: text('category').notNull(), // 'dining', 'accommodation', 'activity', 'entertainment', 'transportation'
  preferenceKey: text('preference_key').notNull(), // 'dietary_restrictions', 'favorite_cuisine', 'temperature', etc.
  preferenceValue: text('preference_value'), // Can be JSON for complex data
  confidenceScore: text('confidence_score').default('0.5'), // How confident we are (0.0-1.0) - stored as text
  source: text('source'), // 'survey', 'behavioral', 'ai_inferred', 'explicit'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Guest Points Transactions
export const guestPointsTransactions = sqliteTable('guest_points_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guestId: integer('guest_id').notNull().references(() => guests.id),
  points: integer('points').notNull(), // Positive for earning, negative for redemption
  transactionType: text('transaction_type'), // 'profile_completion', 'booking', 'review', 'referral', 'redemption'
  description: text('description'),
  referenceId: integer('reference_id'), // E.g., booking_id, survey_id, etc.
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Guest Rewards Redemptions
export const guestRewardsRedemptions = sqliteTable('guest_rewards_redemptions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guestId: integer('guest_id').notNull().references(() => guests.id),
  rewardType: text('reward_type'), // 'discount', 'upgrade', 'free_equipment', 'spa_treatment'
  pointsCost: integer('points_cost'),
  rewardValue: integer('reward_value'), // Value in cents
  redemptionStatus: text('redemption_status').notNull().default('pending'), // 'pending', 'applied', 'used', 'expired'
  bookingId: integer('booking_id').references(() => bookings.id), // If tied to specific booking
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Guest Behavioral Data (auto-captured during stays)
export const guestBehavioralData = sqliteTable('guest_behavioral_data', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guestId: integer('guest_id').notNull().references(() => guests.id),
  bookingId: integer('booking_id').notNull().references(() => bookings.id),

  // Observed behaviors
  behaviorType: text('behavior_type'), // 'thermostat_adjustment', 'lighting_scene', 'music_choice', 'restaurant_booking'
  behaviorValue: text('behavior_value'), // JSON data
  frequency: integer('frequency').notNull().default(1), // How many times observed

  // Context
  timeOfDay: text('time_of_day'), // Stored as "HH:MM:SS"
  dayOfWeek: integer('day_of_week'), // 0-6 (Sunday = 0)

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Guest Surveys
export const guestSurveys = sqliteTable('guest_surveys', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  guestId: integer('guest_id').notNull().references(() => guests.id),
  bookingId: integer('booking_id').references(() => bookings.id),
  surveyType: text('survey_type'), // 'pre_arrival', 'check_in', 'post_stay'
  status: text('status').notNull().default('sent'), // 'sent', 'completed', 'expired'
  pointsReward: integer('points_reward').notNull().default(0),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Guest Survey Responses
export const guestSurveyResponses = sqliteTable('guest_survey_responses', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  surveyId: integer('survey_id').notNull().references(() => guestSurveys.id),
  question: text('question').notNull(),
  answer: text('answer'), // JSON for complex answers
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Booking Guests (for multi-guest bookings)
export const bookingGuests = sqliteTable('booking_guests', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  guestId: integer('guest_id').notNull().references(() => guests.id),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  relationship: text('relationship'), // 'primary', 'spouse', 'child', 'friend', 'family'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Booking Property Configurations
export const bookingPropertyConfigs = sqliteTable('booking_property_configs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  bookingId: integer('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  configType: text('config_type'), // 'temperature', 'lighting', 'music', 'welcome'
  configValue: text('config_value'), // JSON
  appliedAt: integer('applied_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});
