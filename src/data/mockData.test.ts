import { describe, it, expect } from 'vitest'
import {
  INITIAL_PROPERTIES,
  INITIAL_VISIT_REQUESTS,
  DAKAR_NEIGHBORHOODS_DATA,
  DEFAULT_ADMIN_USER,
} from './mockData'
import type { DakarNeighborhood, PropertyType, TransactionType, VisitRequestStatus } from '../types'

describe('Jeu de données de démonstration - Phase 08 (Mock Data & Integrity)', () => {
  describe('Properties Volume & Distribution across Dakar', () => {
    it('contains at least 12 published properties (17 published in total, 19 overall)', () => {
      const published = INITIAL_PROPERTIES.filter((p) => p.status === 'published')
      expect(INITIAL_PROPERTIES.length).toBeGreaterThanOrEqual(12)
      expect(published.length).toBeGreaterThanOrEqual(12)
      expect(INITIAL_PROPERTIES.length).toBe(19)
      expect(published.length).toBe(17)
    })

    it('contains draft and archived properties for back-office demonstration', () => {
      const drafts = INITIAL_PROPERTIES.filter((p) => p.status === 'draft')
      const archived = INITIAL_PROPERTIES.filter((p) => p.status === 'archived')
      expect(drafts.length).toBeGreaterThanOrEqual(1)
      expect(archived.length).toBeGreaterThanOrEqual(1)
    })

    it('satisfies the minimum neighborhood quotas across all 7 Dakar areas', () => {
      const countByNeighborhood = INITIAL_PROPERTIES.filter(
        (p) => p.status === 'published'
      ).reduce(
        (acc, p) => {
          acc[p.neighborhood] = (acc[p.neighborhood] || 0) + 1
          return acc
        },
        {} as Record<DakarNeighborhood, number>
      )

      expect(countByNeighborhood['Almadies']).toBeGreaterThanOrEqual(2)
      expect(countByNeighborhood['Mermoz']).toBeGreaterThanOrEqual(2)
      expect(countByNeighborhood['Ngor']).toBeGreaterThanOrEqual(1)
      expect(countByNeighborhood['Plateau']).toBeGreaterThanOrEqual(1)
      expect(countByNeighborhood['Point E']).toBeGreaterThanOrEqual(1)
      expect(countByNeighborhood['Sacré-Cœur']).toBeGreaterThanOrEqual(1)
      expect(countByNeighborhood['Mamelles']).toBeGreaterThanOrEqual(1)
    })

    it('synchronizes DAKAR_NEIGHBORHOODS_DATA counts with published properties', () => {
      expect(DAKAR_NEIGHBORHOODS_DATA.length).toBe(7)

      for (const neighborhood of DAKAR_NEIGHBORHOODS_DATA) {
        const actualPublishedCount = INITIAL_PROPERTIES.filter(
          (p) => p.neighborhood === neighborhood.name && p.status === 'published'
        ).length

        expect(neighborhood.propertiesCount).toBe(actualPublishedCount)
        expect(neighborhood.imageUrl).toBeTruthy()
        expect(neighborhood.averagePriceM2).toContain('FCFA')
      }
    })
  })

  describe('Property Types, Transactions & Price Coherence', () => {
    it('covers all property types: apartments, villas, land, and offices', () => {
      const types = new Set<PropertyType>(INITIAL_PROPERTIES.map((p) => p.propertyType))
      expect(types.has('apartment')).toBe(true)
      expect(types.has('villa')).toBe(true)
      expect(types.has('land')).toBe(true)
      expect(types.has('office')).toBe(true)
    })

    it('covers both sale and rent transactions', () => {
      const transactions = new Set<TransactionType>(INITIAL_PROPERTIES.map((p) => p.transactionType))
      expect(transactions.has('sale')).toBe(true)
      expect(transactions.has('rent')).toBe(true)
    })

    it('validates currency, prices, surfaces, and land structural rules', () => {
      for (const prop of INITIAL_PROPERTIES) {
        expect(prop.currency).toBe('XOF')
        expect(prop.price).toBeGreaterThan(0)
        expect(prop.surface).toBeGreaterThan(0)

        if (prop.propertyType === 'land') {
          expect(prop.bedrooms).toBe(0)
          expect(prop.bathrooms).toBe(0)
          expect(prop.parkingSpots).toBe(0)
        } else {
          expect(prop.bathrooms).toBeGreaterThan(0)
        }
      }
    })
  })

  describe('Identifiers & Structural Uniqueness', () => {
    it('ensures all property IDs, slugs, and references are unique', () => {
      const ids = INITIAL_PROPERTIES.map((p) => p.id)
      const slugs = INITIAL_PROPERTIES.map((p) => p.slug)
      const references = INITIAL_PROPERTIES.map((p) => p.reference)

      expect(new Set(ids).size).toBe(ids.length)
      expect(new Set(slugs).size).toBe(slugs.length)
      expect(new Set(references).size).toBe(references.length)
    })

    it('ensures complete content, images, and non-sensitive address labels', () => {
      for (const prop of INITIAL_PROPERTIES) {
        expect(prop.title.trim().length).toBeGreaterThan(10)
        expect(prop.description.trim().length).toBeGreaterThan(50)
        expect(prop.images.length).toBeGreaterThanOrEqual(1)
        expect(prop.amenities.length).toBeGreaterThanOrEqual(3)

        // Address labels must be indicative zones, never exact fabricated private addresses
        expect(prop.addressLabel).toBeTruthy()
        expect(prop.city).toBe('Dakar')
        expect(prop.addressLabel.toLowerCase()).not.toContain('n°')
        expect(prop.addressLabel.toLowerCase()).not.toContain('rue exacte')
      }
    })
  })

  describe('Visit Requests & Dashboard Integration', () => {
    it('contains visit requests spanning all 5 statuses', () => {
      const statuses = new Set<VisitRequestStatus>(INITIAL_VISIT_REQUESTS.map((r) => r.status))
      expect(statuses.has('new')).toBe(true)
      expect(statuses.has('to_contact')).toBe(true)
      expect(statuses.has('scheduled')).toBe(true)
      expect(statuses.has('completed')).toBe(true)
      expect(statuses.has('cancelled')).toBe(true)
    })

    it('ensures all visit request foreign keys refer to existing properties', () => {
      const propertyIdSet = new Set(INITIAL_PROPERTIES.map((p) => p.id))

      for (const req of INITIAL_VISIT_REQUESTS) {
        expect(propertyIdSet.has(req.propertyId)).toBe(true)
        expect(req.id).toMatch(/^req-\d{4}-\d{3}$/)
        expect(req.fullName.trim().length).toBeGreaterThan(2)
        expect(req.phone).toMatch(/^(\+221|\+33|\+1|\+44)/)
        expect(req.email).toContain('@')
        expect(req.createdAt).toBeTruthy()
        expect(req.updatedAt).toBeTruthy()
      }
    })
  })

  describe('Admin User Defaults', () => {
    it('provides a valid default demonstration admin user', () => {
      expect(DEFAULT_ADMIN_USER.id).toBe('usr_admin_01')
      expect(DEFAULT_ADMIN_USER.name).toBeTruthy()
      expect(DEFAULT_ADMIN_USER.email).toBe('admin@musatech.sn')
      expect(DEFAULT_ADMIN_USER.role).toBe('Gestionnaire Immobilier')
    })
  })
})

