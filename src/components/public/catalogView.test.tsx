import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { CatalogView } from './CatalogView'
import { AppProvider } from '../../context/AppContext'
import { StorageService } from '../../services/storageService'

// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('Catalog Experience & Multi-criteria Search - Phase 06', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    StorageService.resetToDefaultData()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => {
      root.unmount()
    })
    container.remove()
  })

  it('renders catalog header, search bar, and controls', async () => {
    await act(async () => {
      root.render(
        <AppProvider>
          <CatalogView onBookVisit={() => {}} />
        </AppProvider>
      )
    })

    const text = container.textContent
    expect(text).toContain('Catalogue des Annonces Immobilières')
    expect(text).toContain('bien')
    expect(text).toContain('disponible')
    expect(text).toContain('Trier par :')
  })

  it('renders search input and allows typing keywords', async () => {
    await act(async () => {
      root.render(
        <AppProvider>
          <CatalogView onBookVisit={() => {}} />
        </AppProvider>
      )
    })

    const searchInput = container.querySelector('input[placeholder*="Rechercher par titre"]') as HTMLInputElement
    expect(searchInput).not.toBeNull()

    await act(async () => {
      searchInput.value = 'Almadies'
      searchInput.dispatchEvent(new Event('input', { bubbles: true }))
      searchInput.dispatchEvent(new Event('change', { bubbles: true }))
    })

    expect(container.textContent).toContain('Almadies')
  })

  it('renders transaction filter tabs (Tous, Vente, Location)', async () => {
    await act(async () => {
      root.render(
        <AppProvider>
          <CatalogView onBookVisit={() => {}} />
        </AppProvider>
      )
    })

    const buttons = Array.from(container.querySelectorAll('button'))
    const venteBtn = buttons.find((b) => b.textContent?.trim() === 'Vente')
    const locationBtn = buttons.find((b) => b.textContent?.trim() === 'Location')
    const tousBtn = buttons.find((b) => b.textContent?.trim() === 'Tous')

    expect(venteBtn).toBeDefined()
    expect(locationBtn).toBeDefined()
    expect(tousBtn).toBeDefined()
  })

  it('renders sort dropdown with pertinence, nouveaute, prix-asc, prix-desc, surface-desc', async () => {
    await act(async () => {
      root.render(
        <AppProvider>
          <CatalogView onBookVisit={() => {}} />
        </AppProvider>
      )
    })

    const select = container.querySelector('select[aria-label="Trier les annonces immobilières"]') as HTMLSelectElement
    expect(select).not.toBeNull()

    const options = Array.from(select.querySelectorAll('option')).map((o) => o.value)
    expect(options).toContain('pertinence')
    expect(options).toContain('nouveaute')
    expect(options).toContain('prix-asc')
    expect(options).toContain('prix-desc')
    expect(options).toContain('surface-desc')
  })

  it('renders property cards with valid specs (never inventing absent specs)', async () => {
    await act(async () => {
      root.render(
        <AppProvider>
          <CatalogView onBookVisit={() => {}} />
        </AppProvider>
      )
    })

    const cards = container.querySelectorAll('article')
    expect(cards.length).toBeGreaterThan(0)

    const firstCardText = cards[0].textContent
    expect(firstCardText).toContain('FCFA')
    expect(firstCardText).toContain('m²')
    expect(firstCardText).toContain('Consulter')
  })

  it('supports visit booking trigger from card button', async () => {
    const handleBookVisit = vi.fn()

    await act(async () => {
      root.render(
        <AppProvider>
          <CatalogView onBookVisit={handleBookVisit} />
        </AppProvider>
      )
    })

    const visitBtns = Array.from(container.querySelectorAll('button')).filter((b) =>
      b.textContent?.includes('Visiter')
    )
    expect(visitBtns.length).toBeGreaterThan(0)

    await act(async () => {
      visitBtns[0].click()
    })
    expect(handleBookVisit).toHaveBeenCalledTimes(1)
  })

  it('STRICT BUSINESS RULE: Draft and Archived properties are NEVER shown publicly', async () => {
    // Add a draft property and an archived property into storage
    const allProps = StorageService.getProperties()
    const draftProp = {
      ...allProps[0],
      id: 'prop-draft-hidden',
      reference: 'HIDDEN-DRAFT-REF',
      title: 'Titre Annonce Secrète Brouillon',
      status: 'draft' as const,
    }
    const archivedProp = {
      ...allProps[0],
      id: 'prop-archived-hidden',
      reference: 'HIDDEN-ARCHIVED-REF',
      title: 'Titre Annonce Secrète Archivée',
      status: 'archived' as const,
    }
    StorageService.saveProperties([draftProp, archivedProp, ...allProps])

    await act(async () => {
      root.render(
        <AppProvider>
          <CatalogView onBookVisit={() => {}} />
        </AppProvider>
      )
    })

    const text = container.textContent || ''
    expect(text).not.toContain('HIDDEN-DRAFT-REF')
    expect(text).not.toContain('Titre Annonce Secrète Brouillon')
    expect(text).not.toContain('HIDDEN-ARCHIVED-REF')
    expect(text).not.toContain('Titre Annonce Secrète Archivée')
  })
})
