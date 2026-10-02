export type BadgeType = "Trending" | "Popular" | "Almost Funded" | "New" | "Ending Soon" | "Staff Pick";

export type FundingType = "All-or-Nothing" | "Flexible Funding";

export interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
  color: string; // tailwind gradient classes
  image: string;
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  location: string;
  verified: boolean;
  bio: string;
  campaignsCreated: number;
  campaignsBacked: number;
  joined: string;
  socials: { website?: string; twitter?: string; instagram?: string; linkedin?: string; youtube?: string };
}

export interface Reward {
  id: string;
  amount: number;
  title: string;
  description: string;
  items: string[];
  delivery: string;
  backers: number;
  limit: number | null;
  shipsTo?: string;
}

export interface CampaignStory {
  intro: string;
  problem: string;
  solution: string;
  features: { title: string; text: string }[];
}

export interface Campaign {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: string; // category slug
  creatorId: string;
  location: string;
  country: string;
  image: string;
  gallery: string[];
  raised: number;
  goal: number;
  backers: number;
  daysLeft: number;
  launched: string;
  views: number;
  badges: BadgeType[];
  featured?: boolean;
  trending?: boolean;
  fundingType: FundingType;
  story: CampaignStory;
}
