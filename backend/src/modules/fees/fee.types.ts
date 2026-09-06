// ============================================
// FEE CATEGORY
// ============================================

export const FeeCategoryType = {
  RECURRING: "RECURRING",
  ONE_TIME: "ONE_TIME",
} as const;

export type FeeCategoryType =
  (typeof FeeCategoryType)[keyof typeof FeeCategoryType];

export interface CreateFeeCategoryData {
  name: string;
  description?: string;
  type: FeeCategoryType;
  isActive?: boolean;
}

export interface UpdateFeeCategoryData {
  name?: string;
  description?: string;
  type?: FeeCategoryType;
  isActive?: boolean;
}


// ============================================
// FEE STRUCTURE
// ============================================

export const FeeFrequency = {
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  HALF_YEARLY: "HALF_YEARLY",
  YEARLY: "YEARLY",
  ONE_TIME: "ONE_TIME",
} as const;

export type FeeFrequency =
  (typeof FeeFrequency)[keyof typeof FeeFrequency];


export interface CreateFeeStructureData {
  sessionId: string;

  feeCategoryId: string;

  name: string;

  amount: number;

  frequency: FeeFrequency;

  description?: string;

  dueDay?: number;

  isActive?: boolean;
}


export interface UpdateFeeStructureData {
  sessionId?: string;

  feeCategoryId?: string;

  name?: string;

  amount?: number;

  frequency?: FeeFrequency;

  description?: string;

  dueDay?: number;

  isActive?: boolean;
}