import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { AppProvider } from '../../context/AppContext'
import { AdminProperties } from './AdminProperties'
import { PropertyFormModal } from './PropertyFormModal'
import { INITIAL_PROPERTIES } from '../../data/mockData'
import { StorageService } from '../../services/storageService'

// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Helper for controlled input value setting in jsdom
function setInputValue(element: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(
    element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype,
    'value'
  )
  descriptor?.set?.call(element, value)
  element.dispatchEvent(new Event('input', { bubbles: true }))
  element.dispatchEvent(new Event('change', { bubbles: true }))
}

describe('Admin Properties Portfolio Management - Phase 10 (CRUD & Workflows)', () => {
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

  describe('Properties List, Filtering & Search', () => {
    it('renders responsive table with thumbnail, reference, title, neighborhood, type, price, status and date', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminProperties onAddNew={() => {}} onEdit={() => {}} />
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain('Portefeuille d’Annonces')
      expect(text).toContain(`${INITIAL_PROPERTIES.length} biens`)

      // Check first property columns
      const first = INITIAL_PROPERTIES[0]
      expect(text).toContain(first.reference)
      expect(text).toContain(first.neighborhood)
      expect(text).toContain('780 000 000 FCFA')
    })

    it('filters properties by search keyword on title or reference', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminProperties onAddNew={() => {}} onEdit={() => {}} />
          </AppProvider>
        )
      })

      const searchInput = container.querySelector(
        'input[placeholder="Rechercher par titre ou référence..."]'
      ) as HTMLInputElement
      expect(searchInput).toBeTruthy()

      // Search for specific reference
      await act(async () => {
        setInputValue(searchInput, 'MT-ALM-2026-01')
      })

      const text = container.textContent || ''
      expect(text).toContain('MT-ALM-2026-01')
      expect(text).not.toContain('MT-MER-2026-01')
    })

    it('filters properties by status: published, draft, archived', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminProperties onAddNew={() => {}} onEdit={() => {}} />
          </AppProvider>
        )
      })

      const statusSelect = container.querySelector(
        'select[aria-label="Filtrer par statut"]'
      ) as HTMLSelectElement
      expect(statusSelect).toBeTruthy()

      // Filter by "draft"
      await act(async () => {
        statusSelect.value = 'draft'
        statusSelect.dispatchEvent(new Event('change', { bubbles: true }))
      })

      const text = container.textContent || ''
      expect(text).toContain('MT-ALM-2026-DRAFT')
      expect(text).not.toContain('MT-ALM-2026-01')
    })

    it('filters properties by neighborhood and transaction type', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminProperties onAddNew={() => {}} onEdit={() => {}} />
          </AppProvider>
        )
      })

      const neighborhoodSelect = container.querySelector(
        'select[aria-label="Filtrer par quartier"]'
      ) as HTMLSelectElement
      const transactionSelect = container.querySelector(
        'select[aria-label="Filtrer par transaction"]'
      ) as HTMLSelectElement

      // Filter by Point E & Rent
      await act(async () => {
        neighborhoodSelect.value = 'Point E'
        neighborhoodSelect.dispatchEvent(new Event('change', { bubbles: true }))
        transactionSelect.value = 'rent'
        transactionSelect.dispatchEvent(new Event('change', { bubbles: true }))
      })

      const text = container.textContent || ''
      expect(text).toContain('MT-PTE-2026-02') // Plateau de bureaux Point E
      expect(text).not.toContain('MT-ALM-2026-01')
    })
  })

  describe('Property Actions: Publish, Unpublish, Archive & Delete', () => {
    it('toggles publication status between published and draft', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <AdminProperties onAddNew={() => {}} onEdit={() => {}} />
          </AppProvider>
        )
      })

      // Target first published property: MT-ALM-2026-01
      const unpublishBtn = container.querySelector(
        'button[aria-label="Dépublier MT-ALM-2026-01"]'
      ) as HTMLButtonElement
      expect(unpublishBtn).toBeTruthy()

      await act(async () => {
        unpublishBtn.click()
      })

      // Property should now have a draft status
      const publishBtn = container.querySelector(
        'button[aria-label="Publier MT-ALM-2026-01"]'
      ) as HTMLButtonElement
      expect(publishBtn).toBeTruthy()
    })

    it('requires confirmation before archiving a property', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm')

      // Case 1: User cancels confirmation
      confirmSpy.mockReturnValueOnce(false)

      await act(async () => {
        root.render(
          <AppProvider>
            <AdminProperties onAddNew={() => {}} onEdit={() => {}} />
          </AppProvider>
        )
      })

      const archiveBtn = container.querySelector(
        'button[aria-label="Archiver MT-ALM-2026-01"]'
      ) as HTMLButtonElement
      expect(archiveBtn).toBeTruthy()

      await act(async () => {
        archiveBtn.click()
      })

      expect(confirmSpy).toHaveBeenCalled()
      // Status should remain unchanged when cancelled
      expect(container.querySelector('button[aria-label="Dépublier MT-ALM-2026-01"]')).toBeTruthy()

      // Case 2: User confirms archiving
      confirmSpy.mockReturnValueOnce(true)

      await act(async () => {
        archiveBtn.click()
      })

      expect(confirmSpy).toHaveBeenCalledTimes(2)
      // Property is now archived
    })
  })

  describe('Property Creation & Modification Modal (CRUD Form)', () => {
    it('renders all required form fields including featured toggle, presets, and demo cloud upload disclaimer', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <PropertyFormModal onClose={() => {}} />
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain('Publier une nouvelle annonce')
      expect(text).toContain('Titre de l’annonce *')
      expect(text).toContain('Type de transaction *')
      expect(text).toContain('Catégorie de bien *')
      expect(text).toContain('Quartier à Dakar *')
      expect(text).toContain('Prix en Francs CFA (XOF) *')
      expect(text).toContain('Surface (m²) *')
      expect(text).toContain('Mettre ce bien en avant (Featured)')
      expect(text).toContain('Gestion des médias en démonstration commerciale')
    })

    it('validates strictly required fields and positive numbers while preserving input on error', async () => {
      await act(async () => {
        root.render(
          <AppProvider>
            <PropertyFormModal onClose={() => {}} />
          </AppProvider>
        )
      })

      // Type title but enter negative price
      const titleInput = container.querySelector('input[placeholder="Ex: Villa contemporaine avec piscine miroir aux Almadies"]') as HTMLInputElement
      const addressInput = container.querySelector('input[placeholder="Ex: Zone Résidentielle des Almadies, près de la Corniche"]') as HTMLInputElement
      const priceInput = container.querySelector('input[placeholder="Ex: 450000000"]') as HTMLInputElement
      const form = container.querySelector('form') as HTMLFormElement
      expect(form).toBeTruthy()

      await act(async () => {
        setInputValue(titleInput, 'Nouvelle Villa Test Ngor')
        setInputValue(addressInput, 'Corniche de Ngor')
        setInputValue(priceInput, '-1000')
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })

      // Error message should be shown
      const text = container.textContent || ''
      expect(text).toContain('Erreur de validation')
      expect(text).toContain('Le prix doit être un nombre strictement positif')

      // Preserves entered title and address
      expect(titleInput.value).toBe('Nouvelle Villa Test Ngor')
      expect(addressInput.value).toBe('Corniche de Ngor')
    })

    it('creates property with unique slug and reference in storage', async () => {
      const handleClose = vi.fn()

      await act(async () => {
        root.render(
          <AppProvider>
            <PropertyFormModal onClose={handleClose} />
          </AppProvider>
        )
      })

      const titleInput = container.querySelector('input[placeholder="Ex: Villa contemporaine avec piscine miroir aux Almadies"]') as HTMLInputElement
      const addressInput = container.querySelector('input[placeholder="Ex: Zone Résidentielle des Almadies, près de la Corniche"]') as HTMLInputElement
      const priceInput = container.querySelector('input[placeholder="Ex: 450000000"]') as HTMLInputElement
      const surfaceInput = container.querySelector('input[placeholder="Ex: 350"]') as HTMLInputElement
      const form = container.querySelector('form') as HTMLFormElement
      expect(form).toBeTruthy()

      await act(async () => {
        setInputValue(titleInput, 'Résidence Sunset Mamelles')
        setInputValue(addressInput, 'Mamelles Falaise')
        setInputValue(priceInput, '320000000')
        setInputValue(surfaceInput, '280')
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })

      expect(handleClose).toHaveBeenCalled()

      // Verify in storage
      const properties = StorageService.getProperties()
      const created = properties.find((p) => p.title === 'Résidence Sunset Mamelles')
      expect(created).toBeTruthy()
      expect(created?.reference).toMatch(/^MT-[A-Z]{3}-2026-\d{4}/)
      expect(created?.slug).toContain('residence-sunset-mamelles')
      expect(created?.price).toBe(320000000)
      expect(created?.surface).toBe(280)
    })

    it('populates fields when editing an existing property', async () => {
      const existing = INITIAL_PROPERTIES[0]

      await act(async () => {
        root.render(
          <AppProvider>
            <PropertyFormModal propertyToEdit={existing} onClose={() => {}} />
          </AppProvider>
        )
      })

      const text = container.textContent || ''
      expect(text).toContain(`Modifier l’annonce : ${existing.reference}`)
      expect(text).toContain('Enregistrer les modifications')

      const titleInput = container.querySelector('input[placeholder="Ex: Villa contemporaine avec piscine miroir aux Almadies"]') as HTMLInputElement
      expect(titleInput.value).toBe(existing.title)
    })
  })
})
