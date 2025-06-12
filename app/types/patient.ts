export interface Observation {
  date: string;
  note: string;
}

export interface PatientData {
  name: string;
  age: number;
  pregnancyStatus: 'Active' | 'Inactive';
  gestationalAge: string;
  estimatedDueDate: Date;
  nextAppointment: Date;
  recentObservations: Observation[];
} 