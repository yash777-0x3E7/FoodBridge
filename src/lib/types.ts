export type UserRole = "donor" | "receiver";

export type DonorOrgType = "hotel" | "restaurant" | "caterer" | "function_hall" | "other";
export type ReceiverOrgType = "orphanage" | "ngo" | "shelter" | "individual" | "other";

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  organizationName: string;
  organizationType: DonorOrgType | ReceiverOrgType;
  createdAt: number;
}

export type ListingStatus = "available" | "claimed" | "expired";
export type PriceType = "free" | "low_cost";

export interface FoodListing {
  id: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  foodTitle: string;
  foodType: string;
  description: string;
  quantity: string;
  servesCount: number;
  pickupAddress: string;
  contactPhone: string;
  priceType: PriceType;
  price?: number;
  pickupTime: number;   // epoch ms
  expiresAt: number;    // epoch ms
  notes?: string;
  status: ListingStatus;
  claimedBy?: string;
  claimedByName?: string;
  claimedByPhone?: string;
  claimedAt?: number;
  createdAt: number;
}
