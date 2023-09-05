export interface TypeHealthFacility {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthFacility {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  typeHealthFacilityId: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}
