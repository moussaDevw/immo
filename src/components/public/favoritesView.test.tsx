import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import App from '../../App'
import { FavoritesView } from './FavoritesView'
import { AppProvider } from '../../context/AppContext'
import { StorageService } from '../../services/storageService'

// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('Favorites Page & Navigation - MusaTech Real Estate', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    StorageService.resetToDefaultData()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    window.location.hash = ''
  })

  afterEach(() => {
    act(() => {
      root.unmount()
    })
    container.remove()
  })

  it('navigates to favorites page when clicking the Navbar favorites button', async () => {
    await act(async () => {
      root.render(<App />)
    })

    // Find the Navbar favorites button
    const favButton = Array.from(container.querySelectorAll('button')).find((btn) =>
      btn.getAttribute('aria-label')?.includes('favoris')
    )
    expect(favButton).toBeTruthy()

    await act(async () => {
      favButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    // Should navigate to favorites view
    expect(container.textContent).toContain('Mes Biens Immobiliers Favoris')
    expect(document.title).toContain('Mes Favoris')
  })

  it('renders the empty state when no favorites are saved', async () => {
    await act(async () => {
      root.render(
        <AppProvider>
          <FavoritesView onBookVisit={() => {}} onOpenAdvisorModal={() => {}} />
        </AppProvider>
      )
    })

    expect(container.textContent).toContain('Votre carnet de favoris est vide')
    expect(container.textContent).toContain('Explorer le catalogue')
    expect(container.textContent).toContain('0 bien enregistré')
  })

  it('renders saved properties with transaction filtering and view mode toggle', async () => {
    // Pre-seed favorites with 2 properties (1 sale, 1 rent)
    StorageService.saveFavorites(['prop-alm-01', 'prop-ngor-02'])

    const handleBookVisit = vi.fn()
    const handleOpenAdvisor = vi.fn()

    await act(async () => {
      root.render(
        <AppProvider>
          <FavoritesView
            onBookVisit={handleBookVisit}
            onOpenAdvisorModal={handleOpenAdvisor}
          />
        </AppProvider>
      )
    })

    // Both properties should be visible
    expect(container.textContent).toContain('2 biens enregistrés')
    expect(container.textContent).toContain('Villa contemporaine d’exception')
    expect(container.textContent).toContain('Appartement standing face à la baie de Ngor Virage')

    // Filter by Vente
    const saleFilterBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Vente')
    )
    expect(saleFilterBtn).toBeTruthy()

    await act(async () => {
      saleFilterBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(container.textContent).toContain('Villa contemporaine d’exception')
    expect(container.textContent).not.toContain('Appartement standing face à la baie de Ngor Virage')

    // Switch view mode to list
    const listModeBtn = container.querySelector('button[aria-label="Affichage liste"]')
    expect(listModeBtn).toBeTruthy()

    await act(async () => {
      listModeBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    // Click on Book Visit from card
    const bookButtons = Array.from(container.querySelectorAll('button')).filter((b) =>
      b.textContent?.includes('Visite') || b.textContent?.includes('Demander une visite')
    )
    expect(bookButtons.length).toBeGreaterThan(0)
    await act(async () => {
      bookButtons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(handleBookVisit).toHaveBeenCalled()
  })

  it('allows clearing all favorites via confirmation', async () => {
    StorageService.saveFavorites(['prop-alm-01', 'prop-ngor-02'])

    await act(async () => {
      root.render(
        <AppProvider>
          <FavoritesView onBookVisit={() => {}} onOpenAdvisorModal={() => {}} />
        </AppProvider>
      )
    })

    expect(container.textContent).toContain('2 biens enregistrés')

    // Click trash button
    const trashBtn = container.querySelector('button[aria-label="Vider tous mes favoris"]')
    expect(trashBtn).toBeTruthy()

    await act(async () => {
      trashBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    // Confirmation button should appear
    const confirmBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Confirmer le vidage')
    )
    expect(confirmBtn).toBeTruthy()

    await act(async () => {
      confirmBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    // Now empty state should be rendered
    expect(container.textContent).toContain('Votre carnet de favoris est vide')
    expect(StorageService.getFavorites()).toEqual([])
  })
})
