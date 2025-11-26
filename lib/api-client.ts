/**
 * API Client for connecting frontend to backend
 * Handles all HTTP requests with proper error handling, authentication, and type safety
 */

// Use relative URL for same-origin requests (proxy will handle it)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    // Try to load token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.authToken = localStorage.getItem('zkp_auth_token');
    }
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null) {
    this.authToken = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('zkp_auth_token', token);
      } else {
        localStorage.removeItem('zkp_auth_token');
      }
    }
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Base fetch method with error handling
   */
  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const headers = new Headers(options.headers);

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.authToken) {
      headers.set('Authorization', `Bearer ${this.authToken}`);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || data.message || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        ...data,
      };
    } catch (error: any) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error.message || 'Network error. Please check your connection.',
      };
    }
  }

  // ==================== AUTHENTICATION ====================

  /**
   * Register a new user
   */
  async register(username: string, email: string, password: string) {
    const response = await this.fetch<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });

    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  /**
   * Login user
   */
  async login(email: string, password: string) {
    const response = await this.fetch<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  /**
   * Logout user
   */
  logout() {
    this.setAuthToken(null);
  }

  /**
   * Get current user info
   */
  async getCurrentUser() {
    return this.fetch<{ user: any }>('/auth/me');
  }

  // ==================== ZKP PROOFS ====================

  /**
   * Generate a zero-knowledge proof
   */
  async generateProof(circuitType: 'snark' | 'stark' | 'rollup', inputs: any) {
    return this.fetch<any>('/zkp/generate', {
      method: 'POST',
      body: JSON.stringify({ circuitType, inputs }),
    });
  }

  /**
   * Verify a zero-knowledge proof
   */
  async verifyProof(proofId?: string, circuitType?: string, proofData?: any) {
    return this.fetch<{ verified: boolean; status?: string; proofId?: string; verifiedAt?: string }>(
      '/zkp/verify',
      {
        method: 'POST',
        body: JSON.stringify({ proofId, circuitType, proofData }),
      },
    );
  }

  /**
   * Get proof history for current user
   */
  async getProofHistory(page: number = 1, limit: number = 10) {
    return this.fetch<{
      count: number;
      total: number;
      page: number;
      pages: number;
      data: any[];
    }>(`/zkp/history?page=${page}&limit=${limit}`);
  }

  /**
   * Run hybrid flow
   */
  async runHybridFlow(userCount: number = 10) {
    return this.fetch<any>('/zkp/hybrid', {
      method: 'POST',
      body: JSON.stringify({ userCount }),
    });
  }

  // ==================== ML PREDICTIONS ====================

  /**
   * Predict credit score using ML model
   */
  async predictCreditScore(input: {
    age: number;
    salary: number;
    balance: number;
    txCount: number;
    country?: string;
  }) {
    return this.fetch<{
      predictedScore: number;
      confidence: number;
      riskLevel: 'low' | 'medium' | 'high';
      factors: any;
      recommendations: string[];
    }>('/ml/predict/credit-score', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  /**
   * Detect fraud in user data
   */
  async detectFraud(input: {
    age: number;
    salary: number;
    balance: number;
    txCount: number;
  }) {
    return this.fetch<{
      isFraud: boolean;
      fraudScore: number;
      anomalies: string[];
    }>('/ml/detect/fraud', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  // ==================== DATASET ====================

  /**
   * Get dataset entries
   */
  async getDataset(page: number = 1, limit: number = 50) {
    return this.fetch<{
      count: number;
      total: number;
      data: any[];
    }>(`/dataset?page=${page}&limit=${limit}`);
  }

  /**
   * Get single dataset entry by ID
   */
  async getDatasetEntry(id: number) {
    return this.fetch<any>(`/dataset/${id}`);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;

