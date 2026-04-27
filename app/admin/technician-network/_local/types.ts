export type Technician = {
  id: string;
  fullName: string;
  roleTitle?: string;
  years?: string;
  specialties?: string;
  videoUrl?: string;
  bio?: string;
  photoUrl?: string;
};

export type PartnerStore = {
  rating?: string;
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  googleLink?: string;
  bannerUrl?: string;
  pitch?: string;
  status: "Active" | "Inactive";
  technicians: Technician[];
  lat?: number;
  lng?: number;
  createdAt?: string;
  updatedAt?: string;
};
