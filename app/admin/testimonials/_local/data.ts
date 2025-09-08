import type { Testimonial } from "./types";

export const servicePlans = [
  "NBN Standard",
  "NBN Premium",
  "Mobile 20GB",
  "Mobile Unlimited",
  "NBN Business Pro",
];

export const seedTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "Melbourne, VIC",
    plan: "NBN Premium",
    rating: 5,
    quote:
      "Exceptional service and lightning-fast internet. Couldn't be happier with our NBN connection!",
    published: true,
    createdAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    location: "Melbourne, VIC",
    plan: "Mobile Unlimited",
    rating: 5,
    quote:
      "Exceptional service and lightning-fast internet. Couldn't be happier with our NBN connection!",
    published: true,
    createdAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    location: "Melbourne, VIC",
    plan: "NBN Business Pro",
    rating: 5,
    quote:
      "Exceptional service and lightning-fast internet. Couldn't be happier with our NBN connection!",
    published: true,
    createdAt: "2024-01-15T10:00:00.000Z",
  },
];
