export type PartnerStore = {
  id: number;
  name: string;
  address: string;
  city: string;
  hours: string;
  phone: string;
  rating: number;            // e.g., 4.8
  googleReviewsUrl: string;
  blurb?: string;
};
