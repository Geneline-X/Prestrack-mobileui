const API_BASE_URL = "https://prestrack-backend-z0tc.onrender.com/api/fhir";

interface ApiResponse<T> {
  resourceType: string;
  data?: T;
  entry?: Array<{ resource: T }>;
  total?: number;
  error?: string;
}

export class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      ...options.headers,
    });

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data);
        const error = new Error(data.message || `Request failed with status ${response.status}`) as any;
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data as T;
    } catch (err) {
      console.error('API request failed:', err);
      throw err;
    }
  }

  // Patient methods
  async getPatientDashboard<T = any>(): Promise<T> {
    return this.request('/patient/dashboard');
  }

  async getPatientProfile(patientId: string): Promise<any> {
    return this.request(`/Patient/${patientId}`);
  }

  async updatePatientProfile(patientId: string, data: any): Promise<any> {
    return this.request(`/Patient/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async getObservations(patientId: string, params?: any): Promise<any> {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/Observation?patient=${patientId}${queryString}`);
  }

  async getCurrentPregnancy(patientId: string): Promise<any> {
    return this.request(`/Pregnancy?patient=${patientId}&status=active&_sort=-onsetDateTime&_count=1`);
  }

  async getAppointments(patientId: string, params?: any): Promise<any> {
    const queryString = params ? `&${new URLSearchParams(params)}` : '';
    return this.request(`/Appointment?patient=${patientId}${queryString}`);
  }

  // Consent methods
  async getConsent(patientId: string): Promise<any> {
    return this.request(`/Consent?patient=${patientId}&status=active&_sort=-date&_count=1`);
  }

  async giveConsent(patientId: string, data: any): Promise<any> {
    return this.request('/Consent', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        patient: { reference: `Patient/${patientId}` },
        status: 'active',
        date: new Date().toISOString()
      })
    });
  }
}

export const api = new ApiService();
export default api;
