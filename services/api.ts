// API service for FHIR Maternal Health API
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = "https://prestrack-backend-z0tc.onrender.com/api/fhir"

interface ApiResponse<T> {
  resourceType: string
  data?: T
  entry?: Array<{ resource: T }>
  total?: number
  error?: string
}

export class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  setAuthToken(token: string) {
    this.token = token
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {},
    retry = true
  ): Promise<T> {
    // Try to get the latest token from storage if we don't have one
    if (!this.token) {
      try {
        const storedToken = await SecureStore.getItemAsync('auth_token');
        if (storedToken) {
          this.token = storedToken;
        }
      } catch (error) {
        console.warn('Failed to get auth token from storage:', error);
      }
    }

    const headers = new Headers({
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    });

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized (token expired)
      if (response.status === 401 && retry) {
        console.log('Token expired, attempting to refresh...');
        try {
          // Try to refresh the token
          const refreshToken = await SecureStore.getItemAsync('refresh_token');
          if (refreshToken) {
            console.log('Found refresh token, attempting to refresh...');
            const refreshResponse = await fetch(`${this.baseURL}/auth/refresh-token`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ refresh_token: refreshToken }), // Match backend expected field name
            });

            if (refreshResponse.ok) {
              const data = await refreshResponse.json();
              console.log('Token refresh response:', data);
              
              if (data.accessToken && data.refreshToken) {
                await Promise.all([
                  SecureStore.setItemAsync('auth_token', data.accessToken),
                  SecureStore.setItemAsync('refresh_token', data.refreshToken)
                ]);
                
                this.token = data.accessToken;
                
                // Update the Authorization header with the new token
                headers.set('Authorization', `Bearer ${data.accessToken}`);
                
                // Retry the original request with the new token
                const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
                  ...options,
                  headers,
                });
                
                if (!retryResponse.ok) {
                  throw new Error(`Request failed with status ${retryResponse.status}`);
                }
                
                return await retryResponse.json();
              } else {
                throw new Error('Invalid token response format');
              }
            }
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Clear tokens and throw error - will be handled by the component
          await Promise.all([
            SecureStore.deleteItemAsync('auth_token'),
            SecureStore.deleteItemAsync('refresh_token')
          ]);
          this.token = null;
          throw new Error('Session expired. Please log in again.');
        }
        
        // If we get here, refresh failed
        throw new Error('Failed to refresh token. Please log in again.');
      }

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error:', data)
        const error = new Error(data.message || `Request failed with status ${response.status}`) as any;
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data as T
    } catch (err) {
      const error = err as Error & { status?: number };
      console.error("API request failed:", error);
      // If it's an authentication error, clear the token and redirect to login
      if (error.status === 401) {
        await SecureStore.deleteItemAsync('auth_token');
        await SecureStore.deleteItemAsync('refresh_token');
        this.token = null;
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
      throw error;
    }
  }

  // Patient methods
  async getPatientDashboard<T = any>(): Promise<T> {
    return this.request<T>('/patient');
  }

  // Auth methods
  async login(username: string, password: string) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login failed:', data);
        const error = new Error(data.message || 'Login failed');
        (error as any).status = response.status;
        (error as any).data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Login request failed:', error);
      throw error;
    }
  }

  async register(userData: any) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async refreshToken(refreshToken: string) {
    return this.request("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })
  }

  async getUserProfile() {
    return this.request("/auth/profile")
  }

  // Patients
  async getPatients(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/Patient${queryString ? `?${queryString}` : ""}`)
  }

  async createPatient(patientData: any) {
    return this.request("/Patient", {
      method: "POST",
      body: JSON.stringify(patientData),
    })
  }

  async searchPatients(params: Record<string, string>) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/Patient?${queryString}`)
  }

  // Practitioners
  async getPractitioners(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/Practitioner${queryString ? `?${queryString}` : ""}`)
  }

  async getPractitionerById(id: string) {
    return this.request(`/Practitioner/${id}`)
  }

  // Appointments (using Pregnancy resource for maternal health)
  async getPregnancies(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/Pregnancy${queryString ? `?${queryString}` : ""}`)
  }

  async getPregnancyById(id: string) {
    return this.request(`/Pregnancy/${id}`)
  }

  async createPregnancy(pregnancyData: any) {
    return this.request("/Pregnancy", {
      method: "POST",
      body: JSON.stringify(pregnancyData),
    })
  }

  // Observations
  async getObservations(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/Observation${queryString ? `?${queryString}` : ""}`)
  }

  async createObservation(observationData: any) {
    return this.request("/Observation", {
      method: "POST",
      body: JSON.stringify(observationData),
    })
  }

  // Organizations (Healthcare facilities)
  async getOrganizations(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/Organization${queryString ? `?${queryString}` : ""}`)
  }

  // Patient Profile methods
  async getPatientProfile() {
    return this.request("/patient/profile")
  }

  async updatePatientProfile(profileData: any) {
    return this.request("/patient/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }

  // Pregnancy related methods
  async getCurrentPregnancy() {
    return this.request("/patient/pregnancies/current")
  }

  async addPrenatalVisit(visitData: any) {
    return this.request("/patient/pregnancies/current/prenatal-visit", {
      method: "POST",
      body: JSON.stringify(visitData),
    })
  }

  // Health data methods
  async getHealthObservations(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/patient/observations${queryString ? `?${queryString}` : ""}`)
  }

  // Consent and sharing
  async updateConsent(consentData: any) {
    return this.request("/patient/consent", {
      method: "PUT",
      body: JSON.stringify(consentData),
    })
  }

  async shareHealthData(shareData: any) {
    return this.request("/patient/share", {
      method: "POST",
      body: JSON.stringify(shareData),
    })
  }

  // Notifications
  async getNotifications(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/Notification${queryString ? `?${queryString}` : ""}`)
  }

  async acknowledgeNotification(id: string) {
    return this.request(`/Notification/${id}/acknowledge`, {
      method: "PUT",
    })
  }

  // SMS
  async sendSMS(to: string, message: string, patientId?: string) {
    return this.request("/SMS/send", {
      method: "POST",
      body: JSON.stringify({ to, message, patientId }),
    })
  }

  // Analytics
  async getDashboardAnalytics(params?: Record<string, string>) {
    const queryString = params ? new URLSearchParams(params).toString() : ""
    return this.request(`/Analytics/dashboard${queryString ? `?${queryString}` : ""}`)
  }

  // Visits (Prenatal Visits)
  async createPrenatalVisit(pregnancyId: string, visitData: any) {
    return this.request(`/Pregnancy/${pregnancyId}/prenatal-visit`, {
      method: "POST",
      body: JSON.stringify(visitData),
    })
  }

  async getPrenatalVisits(pregnancyId: string) {
    return this.request(`/Pregnancy/${pregnancyId}/prenatal-visit`)
  }
}

export const apiService = new ApiService()
export default apiService

export async function registerUser(userData: any) {
  return apiService.register(userData)
}
