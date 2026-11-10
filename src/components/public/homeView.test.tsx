import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { HomeView } from './HomeView'
import { AppProvider } from '../../context/AppContext'

// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('Home Page Experience - Phase 05', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
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

  it('renders Hero with required exact title and quick search bar', async () => {
    await act(async () => {
      root.render(
        <AppProvider>
          <HomeView onBookVisit={() => {}} onOpenAdvisorModal={() => {}} />
        </AppProvider>
      )
    })

    const text = container.textContent
    // 1. Hero exact title
    expect(text).toContain('Trouvez le bien immobilier')
    expect(text).toContain('qui vous correspond')

    // 2. Search criteria presence
    expect(text).toContain('Quartier')
    expect(text).toContain('Type de bien')
    expect(text).toContain('Budget min (FCFA)')
    expect(text).toContain('Budget max (FCFA)')
    expect(text).toContain('Rechercher')
  })

  it('renders Featured Properties section with cards and visit action', async () => {
    const handleBookVisit = vi.fn()

    await act(async () => {
      root.render(
        <AppProvider>
          <HomeView onBookVisit={handleBookVisit} onOpenAdvisorModal={() => {}} />
        </AppProvider>
      )
    })

    const text = container.textContent
    expect(text).toContain('Biens d’Exception à la Une')
    expect(text).toContain('Sélection Exclusive MusaTech')

    // Find visit buttons
    const visitButtons = Array.from(container.querySelectorAll('button')).filter((b) =>
      b.textContent?.includes('Visiter')
    )
    expect(visitButtons.length).toBeGreaterThan(0)

    // Trigger visit booking
    await act(async () => {
      visitButtons[0].click()
    })
    expect(handleBookVisit).toHaveBeenCalledTimes(1)
  })

  it('renders all 7 popular Dakar neighborhoods', async () => {
    await act(async () => {
      root.render(
        <AppProvider>
          <HomeView onBookVisit={() => {}} onOpenAdvisorModal={() => {}} />
        </AppProvider>
      )
    })

    const text = container.textContent
    expect(text).toContain('Almadies')
    expect(text).toContain('Mermoz')
    expect(text).toContain('Ngor')
    expect(text).toContain('Plateau')
    expect(text).toContain('Point E')
    expect(text).toContain('Sacré-Cœur')
    expect(text).toContain('Mamelles')
  })

  it('renders Why Platform, Advisor Assistance and Final CTA sections', async () => {
    const handleAdvisorModal = vi.fn()

    await act(async () => {
      root.render(
        <AppProvider>
          <HomeView onBookVisit={() => {}} onOpenAdvisorModal={handleAdvisorModal} />
        </AppProvider>
      )
    })

    const text = container.textContent
    // Why platform
    expect(text).toContain('Pourquoi Choisir MusaTech Real Estate ?')
    expect(text).toContain('Vérification Cadastrale Explicite')
    expect(text).toContain('Visites Adaptées à la Diaspora')

    // Advisor section
    expect(text).toContain('Un Conseiller Privé pour Guider Votre Projet')

    // Final CTA
    expect(text).toContain('Prêt à Concrétiser Votre Acquisition ou Location à Dakar ?')

    // Trigger advisor modal button in advisor section
    const advisorBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Demander un rappel gratuit')
    )
    expect(advisorBtn).toBeDefined()

    await act(async () => {
      advisorBtn?.click()
    })
    expect(handleAdvisorModal).toHaveBeenCalledTimes(1)
  })
})
