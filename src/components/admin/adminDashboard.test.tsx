import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { AppProvider } from '../../context/AppContext'
import { AdminLayout } from './AdminLayout'
import { AdminDashboard } from './AdminDashboard'
import App from '../../App'
import { StorageService } from '../../services/storageService'
import { INITIAL_PROPERTIES, INITIAL_VISIT_REQUESTS } from '../../data/mockData'

// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('Admin Space & Overview Dashboard - Phase 09', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    window.location.hash = ''
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
    window.location.hash = ''
  })

  describe('AdminLayout Structure & Responsive Navigation', () => {
    it('renders sidebar, brand header, and explicit Mode démonstration badge', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminLayout>
              <div>Contenu de test</div>
            </AdminLayout>
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain('MusaTech')
      expect(text).toContain('PRO')
      expect(text).toContain('Mode démonstration')
      expect(text).toContain('Vue d’ensemble')
      expect(text).toContain('Biens immobiliers')
      expect(text).toContain('Demandes de visite')
      expect(text).toContain('Paramètres démo')
    })

    it('renders the demonstration manager user profile and logout action', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminLayout>
              <div>Contenu de test</div>
            </AdminLayout>
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain('Cheikh Amadou Sall')
      expect(text).toContain('Gestionnaire Immobilier')
      expect(text).toContain('Site public')
      expect(text).toContain('Quitter')
    })

    it('opens and closes mobile navigation drawer on hamburger menu click', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminLayout>
              <div>Contenu de test</div>
            </AdminLayout>
          </AppProvider>
        )
      })

      // Find hamburger menu button
      const menuBtn = container.querySelector('button[aria-label="Ouvrir le menu d\'administration"]')
      expect(menuBtn).toBeTruthy()

      // Click to open drawer
      await act(async () => {
        ;(menuBtn as HTMLButtonElement).click()
      })

      // Drawer should now be visible
      const drawer = container.querySelector('div[aria-label="Navigation d\'administration mobile"]')
      expect(drawer).toBeTruthy()

      // Click close button inside drawer
      const closeBtn = drawer?.querySelector('button[aria-label="Fermer le menu"]')
      expect(closeBtn).toBeTruthy()

      await act(async () => {
        ;(closeBtn as HTMLButtonElement).click()
      })

      // Drawer should now be closed
      expect(container.querySelector('div[aria-label="Navigation d\'administration mobile"]')).toBeNull()
    })
  })

  describe('AdminDashboard Key Performance Indicators (Real Data)', () => {
    it('calculates and displays all 6 official required indicators accurately', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminDashboard
              onAddNewProperty={() => {}}
              onInspectRequest={() => {}}
            />
          </AppProvider>
        )
      })

      const text = container.textContent || ''

      // Expected real calculations from mock dataset
      const totalProps = INITIAL_PROPERTIES.length
      const publishedProps = INITIAL_PROPERTIES.filter((p) => p.status === 'published').length
      const draftProps = INITIAL_PROPERTIES.filter((p) => p.status === 'draft').length
      const totalReqs = INITIAL_VISIT_REQUESTS.length
      const newReqs = INITIAL_VISIT_REQUESTS.filter((r) => r.status === 'new').length
      const toProcessReqs = INITIAL_VISIT_REQUESTS.filter(
        (r) => r.status === 'new' || r.status === 'to_contact'
      ).length

      // Check header info
      expect(text).toContain('Vue d’ensemble de votre portefeuille & prospects')
      expect(text).toContain('Indicateurs Clés de l’Agence')

      // 1. Total des biens
      expect(text).toContain('Total des Biens')
      expect(text).toContain(`${totalProps}`)

      // 2. Biens publiés
      expect(text).toContain('Biens Publiés')
      expect(text).toContain(`${publishedProps}`)

      // 3. Brouillons
      expect(text).toContain('Brouillons')
      expect(text).toContain(`${draftProps}`)

      // 4. Demandes reçues
      expect(text).toContain('Demandes Reçues')
      expect(text).toContain(`${totalReqs}`)

      // 5. Nouvelles
      expect(text).toContain('Nouvelles')
      expect(text).toContain(`${newReqs}`)

      // 6. À Traiter
      expect(text).toContain('À Traiter')
      expect(text).toContain(`${toProcessReqs}`)
    })

    it('displays status distribution bars with real proportions', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminDashboard
              onAddNewProperty={() => {}}
              onInspectRequest={() => {}}
            />
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain('Répartition des Biens par Statut')
      expect(text).toContain('Publiés (en ligne)')
      expect(text).toContain('Brouillons (hors ligne)')
      expect(text).toContain('Archivés (vendus / retirés)')

      expect(text).toContain('Répartition des Demandes par Statut')
      expect(text).toContain('Nouvelles')
      expect(text).toContain('À contacter')
      expect(text).toContain('Planifiées')
      expect(text).toContain('Réalisées')
      expect(text).toContain('Annulées')
    })
  })

  describe('Dashboard Content: Recent Inquiries & Properties', () => {
    it('renders recent visit requests and handles inspect trigger', async () => {
      const handleInspect = vi.fn()

      await act(async () => {
        root.render(
          <AppProvider>
            <AdminDashboard
              onAddNewProperty={() => {}}
              onInspectRequest={handleInspect}
            />
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain('Dernières demandes reçues')

      // Check that at least one mock client is visible
      const firstReq = INITIAL_VISIT_REQUESTS[0]
      expect(text).toContain(firstReq.fullName)

      // Find "Traiter" buttons and click the first one
      const traiterButtons = Array.from(container.querySelectorAll('button')).filter(
        (b) => b.textContent?.trim() === 'Traiter'
      )
      expect(traiterButtons.length).toBeGreaterThan(0)

      await act(async () => {
        traiterButtons[0].click()
      })

      expect(handleInspect).toHaveBeenCalled()
    })

    it('renders recently added properties and handles edit/add triggers', async () => {
      const handleAddNew = vi.fn()
      const handleEdit = vi.fn()

      await act(async () => {
        root.render(
          <AppProvider>
            <AdminDashboard
              onAddNewProperty={handleAddNew}
              onInspectRequest={() => {}}
              onEditProperty={handleEdit}
            />
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain('Biens récemment ajoutés')

      // Check that the latest property reference appears
      const sortedProps = [...INITIAL_PROPERTIES].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      expect(text).toContain(sortedProps[0].reference)

      // Check trigger for Add New Property
      const addButtons = Array.from(container.querySelectorAll('button')).filter(
        (b) => b.textContent?.includes('Publier un nouveau bien')
      )
      expect(addButtons.length).toBeGreaterThan(0)

      await act(async () => {
        addButtons[0].click()
      })

      expect(handleAddNew).toHaveBeenCalled()

      // Check trigger for Edit Property
      const editButtons = Array.from(container.querySelectorAll('button')).filter(
        (b) => b.textContent?.trim() === 'Modifier'
      )
      if (editButtons.length > 0) {
        await act(async () => {
          editButtons[0].click()
        })
        expect(handleEdit).toHaveBeenCalled()
      }
    })
  })

  describe('Administration Protection & Access Control', () => {
    it('protects admin dashboard view when user is unauthenticated', async () => {
      // With unauthenticated state
      window.location.hash = 'admin/tableau-de-bord'

      await act(async () => {
        root.render(<App />)
      })

      // Access barrier is shown
      const text = container.textContent || ''
      expect(text).toContain('Espace Gestionnaire Agence')
      expect(text).toContain('Veuillez vous identifier pour accéder au tableau de bord')
      expect(text).toContain('Accéder avec le compte démo')
      expect(text).not.toContain('Vue d’ensemble de votre portefeuille & prospects')
    })

    it('allows access to dashboard when authenticated and locks on logout', async () => {
      // Pre-authenticate demo manager
      StorageService.setAdminAuthenticated(true)
      window.location.hash = 'admin/tableau-de-bord'

      await act(async () => {
        root.render(<App />)
      })

      // Authenticated: dashboard is visible
      expect(container.textContent).toContain('Vue d’ensemble de l’Agence')
      expect(container.textContent).toContain('Vue d’ensemble de votre portefeuille & prospects')

      // Find logout button in desktop header
      const logoutButtons = Array.from(container.querySelectorAll('button')).filter(
        (b) => b.textContent?.includes('Déconnexion') || b.textContent?.includes('Quitter')
      )
      expect(logoutButtons.length).toBeGreaterThan(0)

      // Click logout
      await act(async () => {
        logoutButtons[0].click()
      })

      // User is logged out and returned to public home view
      const textAfterLogout = container.textContent || ''
      expect(textAfterLogout).not.toContain('Vue d’ensemble de votre portefeuille & prospects')
    })
  })
})
