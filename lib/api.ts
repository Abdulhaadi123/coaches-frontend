const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  async signup(data: {
    fullName?: string;
    email?: string;
    password: string;
    role: string;
    companyName?: string;
    ownerName?: string;
    ownerEmail?: string;
  }) {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    
    // Handle rate limiting
    if (res.status === 429) {
      const text = await res.text();
      throw new Error(text || 'Too many login attempts');
    }
    
    return res.json();
  },

  async logout() {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    return res.json();
  },

  async verifyAuth() {
    const res = await fetch(`${API_URL}/auth/verify`, {
      credentials: 'include',
    });
    return res.json();
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  async resetPassword(token: string, password: string) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token, password }),
    });
    return res.json();
  },

  async verifyEmail(token: string) {
    const res = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token }),
    });
    return res.json();
  },

  async resendVerification(email: string) {
    const res = await fetch(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // Playbook APIs
  async createPlaybook(data: any) {
    const res = await fetch(`${API_URL}/playbooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getPlaybooks() {
    const res = await fetch(`${API_URL}/playbooks`, {
      credentials: 'include',
    });
    return res.json();
  },

  async getPlaybookById(id: string) {
    const res = await fetch(`${API_URL}/playbooks/${id}`, {
      credentials: 'include',
    });
    return res.json();
  },

  async updatePlaybook(id: string, data: any) {
    const res = await fetch(`${API_URL}/playbooks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deletePlaybook(id: string) {
    const res = await fetch(`${API_URL}/playbooks/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.json();
  },

  // Coach APIs
  async addRep(data: { name: string; email: string; phone: string }) {
    const res = await fetch(`${API_URL}/coach/add-rep`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to add rep');
    }
    return json;
  },

  async getTeamMembers() {
    const res = await fetch(`${API_URL}/coach/team-members`, {
      credentials: 'include',
    });
    return res.json();
  },

  async removeRep(repId: string) {
    const res = await fetch(`${API_URL}/coach/remove-rep/${repId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return res.json();
  },

  async setupRepAccount(token: string, password: string) {
    const res = await fetch(`${API_URL}/auth/setup-rep`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token, password }),
    });
    return res.json();
  },

  async setupCoachAccount(token: string, password: string) {
    const res = await fetch(`${API_URL}/auth/setup-coach`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token, password }),
    });
    return res.json();
  },

  // Admin APIs
  async addCompany(data: { name: string; ownerName: string; ownerEmail: string; status: string }) {
    const res = await fetch(`${API_URL}/admin/add-company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to add company');
    }
    return json;
  },

  async getCompanies() {
    const res = await fetch(`${API_URL}/admin/companies`, {
      credentials: 'include',
    });
    return res.json();
  },

  async updateCompany(companyId: string, data: { name: string; ownerName: string; ownerEmail: string; status: string }) {
    const res = await fetch(`${API_URL}/admin/update-company/${companyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to update company');
    }
    return json;
  },

  async deleteCompany(companyId: string) {
    const res = await fetch(`${API_URL}/admin/delete-company/${companyId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to delete company');
    }
    return json;
  },

  async getAllUsers() {
    const res = await fetch(`${API_URL}/admin/users`, {
      credentials: 'include',
    });
    return res.json();
  },

  async createUser(data: { name: string; email: string; userType: string; companyId?: string; role: string; status: string }) {
    const res = await fetch(`${API_URL}/admin/create-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to create user');
    }
    return json;
  },

  async updateUser(userId: string, data: { name: string; email: string; role: string; status: string }) {
    const res = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to update user');
    }
    return json;
  },

  async deleteUser(userId: string) {
    const res = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || 'Failed to delete user');
    }
    return json;
  },

  async sendUpgradeLink(userId: string, data: { plan: string; billingCycle: string }) {
    const res = await fetch(`${API_URL}/admin/users/${userId}/send-upgrade-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateUserSubscription(userId: string, data: { plan: string; status: string; billingCycle: string; nextBillingDate?: string }) {
    const res = await fetch(`${API_URL}/admin/users/${userId}/subscription`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async createPaymentSession(priceId: string) {
    const res = await fetch(`${API_URL}/payment/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ priceId }),
    });
    return res.json();
  },

  async verifyPaymentSession(sessionId: string) {
    const res = await fetch(`${API_URL}/payment/verify-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ sessionId }),
    });
    return res.json();
  },

  async getUserSessions(userId: string) {
    const res = await fetch(`${API_URL}/admin/users/${userId}/sessions`, {
      credentials: 'include',
    });
    return res.json();
  },
};
