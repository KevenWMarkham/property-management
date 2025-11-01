// Base Guest Interface (matches database schema)
export interface Guest {
  id: number;

  // Basic Information
  firstName: string;
  lastName: string;
  preferredName?: string | null;
  email: string;
  phone?: string | null;
  birthday?: Date | null;
  location?: string | null;
  languages?: string | null; // JSON string: ["English (native)", "Spanish (conversational)"]
  pronouns?: string | null;

  // Emergency Contact
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  emergencyContactRelationship?: string | null;

  // Loyalty & Rewards
  totalPoints: number;
  tier: 'Silver' | 'Gold' | 'Platinum';
  memberSince: Date;
  totalStays: number;
  totalNights: number;
  totalSpent: number; // in cents
  averageRatingGiven?: string | null; // stored as text: "4.8"
  averageRatingReceived?: string | null; // stored as text: "5.0"

  // Profile Completeness
  profileCompleteness: number; // Percentage (0-100)

  // Privacy Settings
  shareWithProperties: boolean;
  shareWithLocalBusinesses: boolean;
  allowAiPersonalization: boolean;
  emailMarketing: boolean;
  smsNotifications: boolean;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

// Guest Persona (Personality & Travel Style)
export interface GuestPersona {
  id: number;
  guestId: number;

  // Traveler Type
  travelerType?: string | null;

  // Big Five Personality Traits (0-100 scale)
  openness?: number | null;
  conscientiousness?: number | null;
  extraversion?: number | null;
  agreeableness?: number | null;
  neuroticism?: number | null;

  // Travel Style
  pace?: string | null;
  planningStyle?: string | null;
  socialPreference?: string | null;
  riskTolerance?: string | null;

  // Interests & Hobbies
  interests?: string | null; // JSON string: ["Yoga", "Wine tasting", "Reading"]

  createdAt: Date;
  updatedAt: Date;
}

// Guest Preference
export interface GuestPreference {
  id: number;
  guestId: number;
  category: string; // 'dining', 'accommodation', 'activity', 'entertainment', 'transportation'
  preferenceKey: string;
  preferenceValue?: string | null;
  confidenceScore?: string | null; // stored as text: "0.85"
  source?: string | null; // 'survey', 'behavioral', 'ai_inferred', 'explicit'
  createdAt: Date;
  updatedAt: Date;
}

// Guest Points Transaction
export interface GuestPointsTransaction {
  id: number;
  guestId: number;
  points: number; // Positive for earning, negative for redemption
  transactionType?: string | null;
  description?: string | null;
  referenceId?: number | null;
  createdAt: Date;
}

// Guest Rewards Redemption
export interface GuestRewardsRedemption {
  id: number;
  guestId: number;
  rewardType?: string | null;
  pointsCost?: number | null;
  rewardValue?: number | null; // in cents
  redemptionStatus: string; // 'pending', 'applied', 'used', 'expired'
  bookingId?: number | null;
  expiresAt?: Date | null;
  createdAt: Date;
}

// Guest Behavioral Data
export interface GuestBehavioralData {
  id: number;
  guestId: number;
  bookingId: number;
  behaviorType?: string | null;
  behaviorValue?: string | null; // JSON string
  frequency: number;
  timeOfDay?: string | null;
  dayOfWeek?: number | null;
  createdAt: Date;
}

// Guest Survey
export interface GuestSurvey {
  id: number;
  guestId: number;
  bookingId?: number | null;
  surveyType?: string | null;
  status: string; // 'sent', 'completed', 'expired'
  pointsReward: number;
  completedAt?: Date | null;
  createdAt: Date;
}

// Guest Survey Response
export interface GuestSurveyResponse {
  id: number;
  surveyId: number;
  question: string;
  answer?: string | null; // JSON string for complex answers
  createdAt: Date;
}

// Booking Guest (for multi-guest bookings)
export interface BookingGuest {
  id: number;
  bookingId: number;
  guestId: number;
  isPrimary: boolean;
  relationship?: string | null;
  createdAt: Date;
}

// Booking Property Config
export interface BookingPropertyConfig {
  id: number;
  bookingId: number;
  configType?: string | null;
  configValue?: string | null; // JSON string
  appliedAt?: Date | null;
  createdAt: Date;
}

// Complete Guest Profile (with all related data)
export interface GuestProfile extends Guest {
  persona?: GuestPersona | null;
  preferences: GuestPreference[];
  pointsTransactions: GuestPointsTransaction[];
  surveys: GuestSurvey[];
  bookings: number; // count
}

// Parsed Preference Types (for easier use in UI)
export interface ParsedGuestPreferences {
  dining?: {
    dietaryRestrictions?: string[];
    allergies?: string[];
    favoriteCuisines?: string[];
    spiceTolerance?: string;
    drinks?: string[];
    mealTiming?: string;
    priceRange?: string;
  };
  accommodation?: {
    idealTemperature?: number;
    beddingPreference?: string;
    lightingPreference?: string;
    noisePreference?: string;
    amenities?: string[];
  };
  activities?: string[];
  entertainment?: {
    music?: string[];
    movies?: string[];
    streaming?: string[];
  };
  transportation?: string;
  shopping?: {
    style?: string;
    interests?: string[];
    budget?: string;
  };
}
