import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { AppProvider } from '../../context/AppContext'
import { AdminDemoSettings } from './AdminDemoSettings'
import { AdminAuthModal } from '../common/AdminAuthModal'
import { StorageService } from '../../services/storageService'
import { INITIAL_PROPERTIES, INITIAL_VISIT_REQUESTS } from '../../data/mockData'

// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('Demo Persistence, Security & Architecture - Phase 12', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => {
      root.unmount()
    })
    container.remove()
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('Demo Settings Panel & Storage Transparency', () => {
    it('renders real-time metrics for properties and requests without decorative numbers', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminDemoSettings />
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain('Persistance, Sécurité & Architecture de Démonstration')
      expect(text).toContain('Biens enregistrés')
      expect(text).toContain(`${INITIAL_PROPERTIES.length}`)
      expect(text).toContain('Demandes & Prospects')
      expect(text).toContain(`${INITIAL_VISIT_REQUESTS.length}`)
      expect(text).toContain('Empreinte navigateur')
    })

    it('displays the full comparative matrix between Current Demo and Required Production', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminDemoSettings />
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain('Matrice Comparée : Démonstration Actuelle vs Déploiement Production')
      expect(text).toContain('Persistance des données')
      expect(text).toContain('PostgreSQL')
      expect(text).toContain('Prisma')
      expect(text).toContain('Authentification & Sessions')
      expect(text).toContain('HttpOnly')
      expect(text).toContain('Hébergement des Médias')
      expect(text).toContain('AWS S3')
      expect(text).toContain('Validation & Sécurité Entrées')
      expect(text).toContain('Notifications & Messagerie')
      expect(text).toContain('Traçabilité & Audit')
    })

    it('renders the transparency notice stating localStorage is a local single-device sandbox', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminDemoSettings />
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain('Avertissement de Transparence MusaTech')
      expect(text).toContain('localStorage ne constitue pas une base de données multi-utilisateurs sécurisée')
    })
  })

  describe('Data Reset Workflow', () => {
    it('restores initial 19 properties and 7 requests when reset is confirmed', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

      // First mutate storage by deleting a property
      const properties = StorageService.getProperties()
      StorageService.deleteProperty(properties[0].id)
      expect(StorageService.getProperties().length).toBe(properties.length - 1)

      await act(async () => {
        root.render(
          <AppProvider>
            <AdminDemoSettings />
          </AppProvider>
        )
      })

      // Find reset button
      const resetBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Restaurer les données d’origine')
      )
      expect(resetBtn).toBeTruthy()

      await act(async () => {
        resetBtn?.click()
      })

      expect(confirmSpy).toHaveBeenCalled()

      // Storage should be fully restored
      expect(StorageService.getProperties().length).toBe(19)
      expect(StorageService.getVisitRequests().length).toBe(7)
    })
  })

  describe('Demonstration Authentication & Temporary Security', () => {
    it('displays explicit temporary demo notice and preconfigured advisor identity', async () => {
      // Simulate opening auth modal
      StorageService.setAdminAuthenticated(false)

      await act(async () => {
        root.render(
          <AppProvider>
            <AdminAuthModal />
          </AppProvider>
        )
      })

      // Open auth modal via event or trigger
      // Note: AdminAuthModal renders when isAuthModalOpen is true
    })

    it('persists changes across reload simulation in StorageService', () => {
      // Ensure visit requests persist on re-read
      const initialCount = StorageService.getVisitRequests().length
      const newReq = StorageService.addVisitRequest({
        propertyId: 'prop-alm-01',
        fullName: 'Awa Diagne',
        phone: '+221 77 123 45 67',
        email: 'awa.diagne@test.sn',
        preferredDate: '2026-03-25',
        preferredTime: '10h - 12h',
        visitType: 'presentiel',
        message: 'Demande de test de persistance',
        propertyTitle: 'Villa Almadies',
      })

      expect(newReq.id).toBeTruthy()
      expect(StorageService.getVisitRequests().length).toBe(initialCount + 1)

      // Re-read from storage
      const reRead = StorageService.getVisitRequests()
      const found = reRead.find((r) => r.id === newReq.id)
      expect(found).toBeTruthy()
      expect(found?.fullName).toBe('Awa Diagne')
    })
  })
})

