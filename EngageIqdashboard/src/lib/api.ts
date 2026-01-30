const API_BASE_URL = 'http://localhost:3001/api'

// Auth API
export const authApi = {
  register: async (userData: { email: string; password: string; name?: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return response.json()
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })
    return response.json()
  },

  getProfile: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  }
}

// Social Media API
export const socialApi = {
  getAccounts: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/social`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  },

  addInstagramAccount: async (token: string, accountData: { username: string; accessToken: string; refreshToken?: string }) => {
    const response = await fetch(`${API_BASE_URL}/social/instagram`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(accountData)
    })
    return response.json()
  },

  addYouTubeAccount: async (token: string, accountData: { channelId: string; channelTitle: string; accessToken: string; refreshToken?: string }) => {
    const response = await fetch(`${API_BASE_URL}/social/youtube`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(accountData)
    })
    return response.json()
  },

  addTwitterAccount: async (token: string, accountData: { username: string; accessToken: string; refreshToken?: string }) => {
    const response = await fetch(`${API_BASE_URL}/social/twitter`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(accountData)
    })
    return response.json()
  },

  deleteAccount: async (token: string, platform: string, accountId: string) => {
    const response = await fetch(`${API_BASE_URL}/social/${platform}/${accountId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  }
}

// Analytics API
export const analyticsApi = {
  getAnalytics: async (token: string, params?: { platform?: string; metricType?: string; startDate?: string; endDate?: string }) => {
    const queryString = new URLSearchParams(params as any).toString()
    const url = `${API_BASE_URL}/analytics${queryString ? `?${queryString}` : ''}`
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  },

  addAnalytics: async (token: string, data: { platform: string; metricType: string; date: string; value: number; metadata?: any }) => {
    const response = await fetch(`${API_BASE_URL}/analytics`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    return response.json()
  },

  getReports: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/analytics/reports`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  },

  createReport: async (token: string, reportData: { title: string; type: string; startDate: string; endDate: string; data: any }) => {
    const response = await fetch(`${API_BASE_URL}/analytics/reports`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reportData)
    })
    return response.json()
  },

  getReport: async (token: string, reportId: string) => {
    const response = await fetch(`${API_BASE_URL}/analytics/reports/${reportId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  },

  deleteReport: async (token: string, reportId: string) => {
    const response = await fetch(`${API_BASE_URL}/analytics/reports/${reportId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    return response.json()
  }
}
