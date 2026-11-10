import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { AppProvider } from '../../context/AppContext'
import { AdminRequests } from './AdminRequests'
import { RequestDetailModal } from './RequestDetailModal'
import { INITIAL_VISIT_REQUESTS } from '../../data/mockData'
import { StorageService } from '../../services/storageService'

// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

function setInputValue(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(
    element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,
    'value'
  )
  descriptor?.set?.call(element, value)
  element.dispatchEvent(new Event('input', { bubbles: true }))
  element.dispatchEvent(new Event('change', { bubbles: true }))
}

describe('Admin Visit Requests & Prospects Management - Phase 11', () => {
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

  describe('Requests List & 8 Columns Table Structure', () => {
    it('renders the 8 required columns: Nom, Téléphone, E-mail, Bien demandé, Date réception, Créneau, Statut, Action', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminRequests onInspectRequest={() => {}} />
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain('Gestion des Demandes de Visite')
      expect(text).toContain(`${INITIAL_VISIT_REQUESTS.length} dossiers`)

      // Column headers
      expect(text).toContain('1. Nom')
      expect(text).toContain('2. Téléphone')
      expect(text).toContain('3. E-mail')
      expect(text).toContain('4. Bien demandé')
      expect(text).toContain('5. Date réception')
      expect(text).toContain('6. Créneau souhaité')
      expect(text).toContain('7. Statut')
      expect(text).toContain('8. Action')

      // Check client contacts
      const first = INITIAL_VISIT_REQUESTS[0]
      expect(text).toContain(first.fullName)
      expect(text).toContain(first.phone)
      expect(text).toContain(first.email)

      // Tel and Mailto links must exist
      const telLink = container.querySelector(`a[href="tel:${first.phone}"]`)
      const mailLink = container.querySelector(`a[href="mailto:${first.email}"]`)
      expect(telLink).toBeTruthy()
      expect(mailLink).toBeTruthy()
    })

    it('indicates clearly when the target property is archived', async () => {
      // Let's archive a property in storage and associate with a request
      const properties = StorageService.getProperties()
      const firstProp = properties[0]
      StorageService.updateProperty({ ...firstProp, status: 'archived' })

      await act(async () => {
        root.render(
          <AppProvider>
            <AdminRequests onInspectRequest={() => {}} />
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain('Bien archivé')
    })
  })

  describe('Search & Multi-criteria Filtering', () => {
    it('filters requests by search keyword on prospect name, phone, or property reference', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminRequests onInspectRequest={() => {}} />
          </AppProvider>
        )
      })

      const searchInput = container.querySelector(
        'input[placeholder="Nom, tél ou référence..."]'
      ) as HTMLInputElement
      expect(searchInput).toBeTruthy()

      // Search for Mamadou Diop
      await act(async () => {
        setInputValue(searchInput, 'Mamadou Diop')
      })

      const text = container.textContent || ''
      expect(text).toContain('Mamadou Diop')
      expect(text).not.toContain('Sophie Van Der Meer')
    })

    it('filters requests by canonical status tabs (Nouveau, À contacter, Visite planifiée, Traité, Annulé)', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminRequests onInspectRequest={() => {}} />
          </AppProvider>
        )
      })

      // Click on "À contacter" tab button
      const toContactButtons = Array.from(container.querySelectorAll('button')).filter(
        (b) => b.textContent?.includes('À contacter')
      )
      expect(toContactButtons.length).toBeGreaterThan(0)

      await act(async () => {
        toContactButtons[0].click()
      })

      const text = container.textContent || ''
      // Aïssatou Sow has status to_contact in mock data
      expect(text).toContain('Aïssatou Sow')
      expect(text).not.toContain('Mamadou Diop') // scheduled
    })

    it('filters requests by period (7 days, 30 days, this month) and allows filter reset', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminRequests onInspectRequest={() => {}} />
          </AppProvider>
        )
      })

      const periodSelect = container.querySelector(
        'select[aria-label="Filtrer par période"]'
      ) as HTMLSelectElement
      expect(periodSelect).toBeTruthy()

      await act(async () => {
        periodSelect.value = '7d'
        periodSelect.dispatchEvent(new Event('change', { bubbles: true }))
      })

      // Filter reset button appears
      const resetBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Réinitialiser les filtres')
      )
      expect(resetBtn).toBeTruthy()

      await act(async () => {
        resetBtn?.click()
      })

      expect(periodSelect.value).toBe('all')
    })
  })

  describe('Request Details Modal, Status Updating & History Timeline', () => {
    it('renders prospect details, visit slot, client message, and links', async () => {
      const mockReq = INITIAL_VISIT_REQUESTS[0]

      await act(async () => {
        root.render(
          <AppProvider>
            <RequestDetailModal request={mockReq} onClose={() => {}} />
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain(`Dossier de Visite : ${mockReq.fullName}`)
      expect(text).toContain(mockReq.email)
      expect(text).toContain(mockReq.phone)
      expect(text).toContain(mockReq.preferredDate)
      expect(text).toContain('Consentement accordé pour être recontacté')
      expect(text).toContain('Historique des changements de statut')
    })

    it('updates status and notes with audit log history persistence', async () => {
      const mockReq = INITIAL_VISIT_REQUESTS[0]
      const handleClose = vi.fn()

      await act(async () => {
        root.render(
          <AppProvider>
            <RequestDetailModal request={mockReq} onClose={handleClose} />
          </AppProvider>
        )
      })

      // Click status "Traité" button
      const traiteeBtn = Array.from(container.querySelectorAll('button')).find(
        (b) => b.textContent?.trim() === 'Traité'
      )
      expect(traiteeBtn).toBeTruthy()

      await act(async () => {
        traiteeBtn?.click()
      })

      // Enter manager notes
      const notesTextarea = container.querySelector(
        'textarea[placeholder="Ex: Client contacté par téléphone ce matin. Budget confirmé, accord pour visite samedi 10h avec Babacar Sy..."]'
      ) as HTMLTextAreaElement
      expect(notesTextarea).toBeTruthy()

      await act(async () => {
        setInputValue(notesTextarea, 'Visite effectuée ce matin. Client très intéressé par le titre foncier.')
      })

      // Submit form
      const form = container.querySelector('form') as HTMLFormElement
      await act(async () => {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })

      // Verify in storage
      const updatedReqs = StorageService.getVisitRequests()
      const found = updatedReqs.find((r) => r.id === mockReq.id)
      expect(found).toBeTruthy()
      expect(found?.status).toBe('completed')
      expect(found?.internalAdminNotes).toContain('Visite effectuée ce matin')
      expect(found?.statusHistory?.length).toBeGreaterThanOrEqual(2)
      expect(found?.statusHistory?.some((h) => h.status === 'completed')).toBe(true)
    })
  })
})

