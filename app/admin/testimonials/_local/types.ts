export type Testimonial = {
  id: number;
  name: string;
  location: string;
  plan?: string;          // e.g., "NBN Premium"
  rating: 1 | 2 | 3 | 4 | 5;
  avatarUrl?: string;
  quote: string;
  published: boolean;
  createdAt: string;      // ISO date
};
