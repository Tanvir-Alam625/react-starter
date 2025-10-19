import axios from 'axios'

// Create axios instance with default config
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Simple in-memory cache
interface CacheEntry {
  data: any
  timestamp: number
  ttl: number
}

class ApiCache {
  private cache = new Map<string, CacheEntry>()

  set(key: string, data: any, ttl = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    })
  }

  get(key: string) {
    const entry = this.cache.get(key)
    if (!entry) return null

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data
  }

  clear() {
    this.cache.clear()
  }

  delete(key: string) {
    this.cache.delete(key)
  }
}

const cache = new ApiCache()

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add request timestamp for debugging
    config.metadata = { startTime: Date.now() }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime
      console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url}: ${duration}ms`)
    }

    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-token')
      cache.clear()
      window.location.href = '/login'
    }

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('API Error:', error.response?.data || error.message)
    }

    return Promise.reject(error)
  }
)

// Enhanced API client with caching
export const apiClient = {
  get: async <T>(url: string, params?: object, options?: { cache?: boolean; ttl?: number }) => {
    const cacheKey = `GET:${url}:${JSON.stringify(params)}`
    
    if (options?.cache) {
      const cached = cache.get(cacheKey)
      if (cached) return { data: cached }
    }

    const response = await api.get<T>(url, { params })
    
    if (options?.cache) {
      cache.set(cacheKey, response.data, options.ttl)
    }

    return response
  },

  post: <T>(url: string, data?: object) => {
    // Clear related cache entries on mutations
    cache.clear()
    return api.post<T>(url, data)
  },

  put: <T>(url: string, data?: object) => {
    // Clear related cache entries on mutations
    cache.clear()
    return api.put<T>(url, data)
  },

  patch: <T>(url: string, data?: object) => {
    // Clear related cache entries on mutations
    cache.clear()
    return api.patch<T>(url, data)
  },

  delete: <T>(url: string) => {
    // Clear related cache entries on mutations
    cache.clear()
    return api.delete<T>(url)
  },

  // Cache management
  cache: {
    clear: () => cache.clear(),
    delete: (key: string) => cache.delete(key),
    get: (key: string) => cache.get(key),
  },
}

// TypeScript module augmentation for request metadata
declare module 'axios' {
  interface AxiosRequestConfig {
    metadata?: {
      startTime: number
    }
  }
}