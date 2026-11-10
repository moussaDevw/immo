import type { Property, VisitRequest } from '../types'
import { INITIAL_PROPERTIES, INITIAL_VISIT_REQUESTS } from '../data/mockData'

const STORAGE_KEYS = {
  PROPERTIES: 'musatech_immo_properties_v1',
  VISIT_REQUESTS: 'musatech_immo_requests_v1',
  FAVORITES: 'musatech_immo_favorites_v1',
  AUTH: 'musatech_immo_auth_v1',
}

function safeLocalStorageGet(key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key)
    }
  } catch {
    console.warn(`[MusaTech Storage] Impossible d'accéder au localStorage pour "${key}".`)
  }
  return null
}

function safeLocalStorageSet(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value)
    }
  } catch {
    console.warn(`[MusaTech Storage] Impossible d'écrire dans le localStorage pour "${key}".`)
  }
}

export const StorageService = {
  getProperties(): Property[] {
    const raw = safeLocalStorageGet(STORAGE_KEYS.PROPERTIES)
    if (!raw) {
      this.saveProperties(INITIAL_PROPERTIES)
      return INITIAL_PROPERTIES
    }
    try {
      const parsed = JSON.parse(raw) as Property[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    } catch {
      console.error('[MusaTech Storage] Erreur de lecture des biens. Réinitialisation.')
    }
    this.saveProperties(INITIAL_PROPERTIES)
    return INITIAL_PROPERTIES
  },

  saveProperties(properties: Property[]): void {
    safeLocalStorageSet(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties))
  },

  getPropertyById(id: string): Property | undefined {
    return this.getProperties().find((p) => p.id === id)
  },

  addProperty(property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property {
    const properties = this.getProperties()
    const id = `prop-${Date.now()}`
    const now = new Date().toISOString()

    // Ensure slug uniqueness
    let slug = property.slug || property.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (!slug) slug = `bien-${Date.now()}`
    let uniqueSlug = slug
    let slugCounter = 2
    while (properties.some((p) => p.slug === uniqueSlug)) {
      uniqueSlug = `${slug}-${slugCounter}`
      slugCounter++
    }

    // Ensure reference uniqueness
    let reference = property.reference
    if (!reference) {
      const prefix = property.neighborhood.substring(0, 3).toUpperCase()
      const rand = Math.floor(1000 + Math.random() * 9000)
      reference = `MT-${prefix}-2026-${rand}`
    }
    let uniqueRef = reference
    let refCounter = 2
    while (properties.some((p) => p.reference === uniqueRef)) {
      uniqueRef = `${reference}-${refCounter}`
      refCounter++
    }

    const newProperty: Property = {
      ...property,
      id,
      slug: uniqueSlug,
      reference: uniqueRef,
      createdAt: now,
      updatedAt: now,
    }
    const updated = [newProperty, ...properties]
    this.saveProperties(updated)
    return newProperty
  },

  updateProperty(property: Property): Property {
    const properties = this.getProperties()
    const now = new Date().toISOString()

    // Ensure slug uniqueness against other properties
    let uniqueSlug = property.slug
    let slugCounter = 2
    while (properties.some((p) => p.id !== property.id && p.slug === uniqueSlug)) {
      uniqueSlug = `${property.slug}-${slugCounter}`
      slugCounter++
    }

    // Ensure reference uniqueness against other properties
    let uniqueRef = property.reference
    let refCounter = 2
    while (properties.some((p) => p.id !== property.id && p.reference === uniqueRef)) {
      uniqueRef = `${property.reference}-${refCounter}`
      refCounter++
    }

    const updatedProp: Property = {
      ...property,
      slug: uniqueSlug,
      reference: uniqueRef,
      updatedAt: now,
    }

    const updated = properties.map((p) => (p.id === property.id ? updatedProp : p))
    this.saveProperties(updated)
    return updatedProp
  },

  deleteProperty(id: string): boolean {
    const properties = this.getProperties()
    const filtered = properties.filter((p) => p.id !== id)
    if (filtered.length !== properties.length) {
      this.saveProperties(filtered)
      return true
    }
    return false
  },

  getVisitRequests(): VisitRequest[] {
    const raw = safeLocalStorageGet(STORAGE_KEYS.VISIT_REQUESTS)
    if (!raw) {
      this.saveVisitRequests(INITIAL_VISIT_REQUESTS)
      return INITIAL_VISIT_REQUESTS
    }
    try {
      const parsed = JSON.parse(raw) as VisitRequest[]
      if (Array.isArray(parsed)) {
        return parsed
      }
    } catch {
      console.error('[MusaTech Storage] Erreur de lecture des demandes. Réinitialisation.')
    }
    this.saveVisitRequests(INITIAL_VISIT_REQUESTS)
    return INITIAL_VISIT_REQUESTS
  },

  saveVisitRequests(requests: VisitRequest[]): void {
    safeLocalStorageSet(STORAGE_KEYS.VISIT_REQUESTS, JSON.stringify(requests))
  },

  addVisitRequest(data: Omit<VisitRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>): VisitRequest {
    const requests = this.getVisitRequests()
    const id = `req-${Date.now()}`
    const now = new Date().toISOString()
    const newRequest: VisitRequest = {
      ...data,
      id,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    }
    const updated = [newRequest, ...requests]
    this.saveVisitRequests(updated)
    return newRequest
  },

  updateVisitRequest(request: VisitRequest): VisitRequest {
    const requests = this.getVisitRequests()
    const now = new Date().toISOString()
    const updated = requests.map((r) => (r.id === request.id ? { ...request, updatedAt: now } : r))
    this.saveVisitRequests(updated)
    return { ...request, updatedAt: now }
  },

  getFavorites(): string[] {
    const raw = safeLocalStorageGet(STORAGE_KEYS.FAVORITES)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  },

  saveFavorites(ids: string[]): void {
    safeLocalStorageSet(STORAGE_KEYS.FAVORITES, JSON.stringify(ids))
  },

  getIsAdminAuthenticated(): boolean {
    return safeLocalStorageGet(STORAGE_KEYS.AUTH) === 'true'
  },

  setAdminAuthenticated(auth: boolean): void {
    safeLocalStorageSet(STORAGE_KEYS.AUTH, auth ? 'true' : 'false')
  },

  resetToDefaultData(): void {
    this.saveProperties(INITIAL_PROPERTIES)
    this.saveVisitRequests(INITIAL_VISIT_REQUESTS)
  },
}

/**
 * Format currency in Francs CFA (XOF)
 * Ex: 780000000 -> "780 000 000 FCFA"
 */
export function formatCFA(amount: number): string {
  if (isNaN(amount)) return '0 FCFA'
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA'
}

/**
 * Format dates in French
 */
export function formatDateFR(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  } catch {
    return dateString
  }
}
