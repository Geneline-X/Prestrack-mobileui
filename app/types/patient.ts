export interface Observation {
  id: string;
  date: string;
  type: string;
  value: string;
  note?: string;
}

export interface PatientData {
  patientId: string;
  name: string;
  age: number;
  pregnancyStatus: 'Active' | 'Inactive' | 'Not Pregnant';
  gestationalAge?: string;
  estimatedDueDate?: string | null;
  nextAppointment?: string | null;
  recentObservations: Observation[];
  weeksPregnant?: number;
}

// Default export to satisfy the route requirements
const PatientTypes = () => null;
export default PatientTypes;