import { describe, it, expect, beforeEach } from 'vitest'
import { StorageService, formatCFA, formatDateFR } from './storageService'
import type { Property, VisitRequest } from '../types'

describe('Formatters (FCFA & Dates)', () => {
  it('formats amount into FCFA currency string with space separators', () => {
    const formatted = formatCFA(780000000)
    // Accept non-breaking or normal spaces from Intl
    expect(formatted.replace(/\s/g, ' ')).toBe('780 000 000 FCFA')
  })

  it('handles 0 and invalid numbers safely', () => {
    expect(formatCFA(0)).toBe('0 FCFA')
    expect(formatCFA(NaN)).toBe('0 FCFA')
  })

  it('formats ISO dates into French formatted strings', () => {
    const formatted = formatDateFR('2026-03-15T10:00:00.000Z')
    expect(formatted).toContain('2026')
    expect(formatted).toContain('15')
    expect(formatted.toLowerCase()).toContain('mars')
  })

  it('handles invalid date strings gracefully', () => {
    expect(formatDateFR('invalid-date')).toBe('invalid-date')
  })
})

describe('StorageService Properties DAL', () => {
  beforeEach(() => {
    localStorage.clear()
    StorageService.resetToDefaultData()
  })

  it('returns initial properties when localStorage is freshly initialized', () => {
    const properties = StorageService.getProperties()
    expect(properties.length).toBeGreaterThanOrEqual(12)
    expect(properties[0]).toHaveProperty('id')
    expect(properties[0]).toHaveProperty('reference')
    expect(properties[0]).toHaveProperty('transactionType')
  })

  it('adds a new property and prepends it to the list', () => {
    const initialCount = StorageService.getProperties().length
    const newPropData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'> = {
      reference: 'MT-ALM-2026-TEST',
      title: 'Villa Test Almadies',
      slug: 'villa-test-almadies',
      description: 'Superbe villa test.',
      transactionType: 'sale',
      propertyType: 'villa',
      price: 650000000,
      currency: 'XOF',
      neighborhood: 'Almadies',
      city: 'Dakar',
      addressLabel: 'Corniche des Almadies',
      surface: 500,
      bedrooms: 5,
      bathrooms: 5,
      parkingSpots: 3,
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811'],
      amenities: ['Piscine', 'Groupe électrogène'],
      status: 'published',
      featured: true,
    }

    const created = StorageService.addProperty(newPropData)
    expect(created.id).toBeDefined()
    expect(created.createdAt).toBeDefined()
    expect(created.updatedAt).toBeDefined()

    const list = StorageService.getProperties()
    expect(list.length).toBe(initialCount + 1)
    expect(list[0].id).toBe(created.id)
    expect(list[0].reference).toBe('MT-ALM-2026-TEST')
  })

  it('updates an existing property and refreshes updatedAt', () => {
    const properties = StorageService.getProperties()
    const target = properties[0]
    const updated = StorageService.updateProperty({
      ...target,
      price: 999000000,
      title: 'Titre Modifié',
    })

    expect(updated.price).toBe(999000000)
    expect(updated.title).toBe('Titre Modifié')

    const reloaded = StorageService.getPropertyById(target.id)
    expect(reloaded?.price).toBe(999000000)
    expect(reloaded?.title).toBe('Titre Modifié')
  })

  it('deletes an existing property', () => {
    const properties = StorageService.getProperties()
    const target = properties[0]
    const success = StorageService.deleteProperty(target.id)
    expect(success).toBe(true)

    const reloaded = StorageService.getPropertyById(target.id)
    expect(reloaded).toBeUndefined()
  })

  it('returns false when trying to delete non-existent property', () => {
    const success = StorageService.deleteProperty('non-existent-id-999')
    expect(success).toBe(false)
  })
})

describe('StorageService Visit Requests DAL', () => {
  beforeEach(() => {
    localStorage.clear()
    StorageService.resetToDefaultData()
  })

  it('returns initial mock requests', () => {
    const requests = StorageService.getVisitRequests()
    expect(requests.length).toBeGreaterThan(0)
    expect(requests[0]).toHaveProperty('fullName')
    expect(requests[0]).toHaveProperty('status')
  })

  it('adds a new visit request with initial status "new"', () => {
    const initialCount = StorageService.getVisitRequests().length
    const newReqData: Omit<VisitRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'> = {
      propertyId: 'prop-1',
      propertyTitle: 'Villa d’Architecte Almadies',
      propertyReference: 'MT-ALM-2026-001',
      fullName: 'Aïssatou Ba',
      email: 'aissatou.ba@example.com',
      phone: '+221 77 123 45 67',
      preferredDate: '2026-04-10',
      preferredTime: '10h - 12h',
      visitType: 'presentiel',
      message: 'Intéressée par un achat direct.',
    }

    const created = StorageService.addVisitRequest(newReqData)
    expect(created.id).toBeDefined()
    expect(created.status).toBe('new')
    expect(created.createdAt).toBeDefined()

    const list = StorageService.getVisitRequests()
    expect(list.length).toBe(initialCount + 1)
    expect(list[0].id).toBe(created.id)
  })

  it('updates request status and internal notes', () => {
    const requests = StorageService.getVisitRequests()
    const target = requests[0]
    const updated = StorageService.updateVisitRequest({
      ...target,
      status: 'scheduled',
      internalAdminNotes: 'Visite programmée pour samedi matin.',
    })

    expect(updated.status).toBe('scheduled')
    expect(updated.internalAdminNotes).toBe('Visite programmée pour samedi matin.')

    const list = StorageService.getVisitRequests()
    const found = list.find((r) => r.id === target.id)
    expect(found?.status).toBe('scheduled')
    expect(found?.internalAdminNotes).toBe('Visite programmée pour samedi matin.')
  })
})

describe('StorageService Demo Auth and Favorites', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('manages favorites list persistence', () => {
    expect(StorageService.getFavorites()).toEqual([])
    StorageService.saveFavorites(['prop-1', 'prop-2'])
    expect(StorageService.getFavorites()).toEqual(['prop-1', 'prop-2'])
  })

  it('manages demo admin auth state', () => {
    expect(StorageService.getIsAdminAuthenticated()).toBe(false)
    StorageService.setAdminAuthenticated(true)
    expect(StorageService.getIsAdminAuthenticated()).toBe(true)
    StorageService.setAdminAuthenticated(false)
    expect(StorageService.getIsAdminAuthenticated()).toBe(false)
  })
})

