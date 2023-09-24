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

export interface Specialist {
  id: string;
  name: string;
  descriptionDisease: string;
  descriptionDoctor: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicRoom {
  roomNumber: number;
  healthFacilityId: string;
  capacity: number;
  HealthFacility: HealthFacility;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicDegree {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
