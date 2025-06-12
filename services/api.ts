// API service for FHIR Maternal Health API
const API_BASE_URL = 'https://prestrack-backend-8k65.onrender.com/api/fhir';

interface ApiResponse<T> {
  resourceType: string;
  data?: T;
  entry?: Array<{ resource: T }>;
  total?: number;
  error?: string;
}

export class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        // Try to parse JSON error, fallback to text
        let errorData;
        if (contentType && contentType.includes('application/json')) {
          errorData = await response.json();
        } else {
          errorData = { error: await response.text() };
        }
        throw new Error(`HTTP error! status: ${response.status} - ${JSON.stringify(errorData)}`);
      }

      if (contentType && contentType.includes('application/json')) {
        const data: ApiResponse<T> = await response.json();
        return data;
      } else {
        // Unexpected content type
        throw new Error('Invalid response from server (not JSON)');
      }
    } catch (error: any) {
      console.error('API request failed:', error);
      return {
        resourceType: 'Error',
        error: error.message || 'Unknown error'
      } as ApiResponse<T>;
    }
  }

  // Authentication
  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getUserProfile() {
    return this.request('/auth/profile');
  }

  // Patients
  async getPatients(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/Patient${queryString ? `?${queryString}` : ''}`);
  }

  async createPatient(patientData: any) {
    return this.request('/Patient', {
      method: 'POST',
      body: JSON.stringify(patientData)
    });
  }

  async searchPatients(params: Record<string, string>) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/Patient?${queryString}`);
  }

  // Practitioners
  async getPractitioners(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/Practitioner${queryString ? `?${queryString}` : ''}`);
  }

  async getPractitionerById(id: string) {
    return this.request(`/Practitioner/${id}`);
  }

  // Appointments (using Pregnancy resource for maternal health)
  async getPregnancies(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/Pregnancy${queryString ? `?${queryString}` : ''}`);
  }

  async getPregnancyById(id: string) {
    return this.request(`/Pregnancy/${id}`);
  }

  async createPregnancy(pregnancyData: any) {
    return this.request('/Pregnancy', {
      method: 'POST',
      body: JSON.stringify(pregnancyData),
    });
  }

  // Observations
  async getObservations(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/Observation${queryString ? `?${queryString}` : ''}`);
  }

  async createObservation(observationData: any) {
    return this.request('/Observation', {
      method: 'POST',
      body: JSON.stringify(observationData),
    });
  }

  // Organizations (Healthcare facilities)
  async getOrganizations(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/Organization${queryString ? `?${queryString}` : ''}`);
  }

  // Patient Portal
  async getPatientDashboard() {
    return this.request('/PatientPortal/dashboard');
  }

  async getPatientObservations(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/PatientPortal/observations${queryString ? `?${queryString}` : ''}`);
  }

  // Notifications
  async getNotifications(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/Notification${queryString ? `?${queryString}` : ''}`);
  }

  async acknowledgeNotification(id: string) {
    return this.request(`/Notification/${id}/acknowledge`, {
      method: 'PUT',
    });
  }

  // SMS
  async sendSMS(to: string, message: string, patientId?: string) {
    return this.request('/SMS/send', {
      method: 'POST',
      body: JSON.stringify({ to, message, patientId }),
    });
  }

  // Analytics
  async getDashboardAnalytics(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request(`/Analytics/dashboard${queryString ? `?${queryString}` : ''}`);
  }

  // Visits (Prenatal Visits)
  async createPrenatalVisit(pregnancyId: string, visitData: any) {
    return this.request(`/Pregnancy/${pregnancyId}/prenatal-visit`, {
      method: 'POST',
      body: JSON.stringify(visitData),
    });
  }

  async getPrenatalVisits(pregnancyId: string) {
    return this.request(`/Pregnancy/${pregnancyId}/prenatal-visit`);
  }
}

export const apiService = new ApiService();
export default apiService;

export async function registerUser(userData: any) {
  return apiService.register(userData);
}