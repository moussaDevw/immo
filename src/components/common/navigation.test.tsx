import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { AppProvider } from '../../context/AppContext'

// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('Public Shell - Navbar & Footer', () => {
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

  it('renders Navbar with brand logo, main navigation links and advisor CTA', async () => {
    const handleOpenAdvisor = vi.fn()

    await act(async () => {
      root.render(
        <AppProvider>
          <Navbar onOpenAdvisorModal={handleOpenAdvisor} />
        </AppProvider>
      )
    })

    const text = container.textContent
    expect(text).toContain('MusaTech')
    expect(text).toContain('Accueil')
    expect(text).toContain('Acheter')
    expect(text).toContain('Louer')
    expect(text).toContain('À propos')
    expect(text).toContain('Parler à un conseiller')

    // Find the advisor CTA button and click it
    const buttons = Array.from(container.querySelectorAll('button'))
    const advisorBtn = buttons.find((b) => b.textContent?.includes('Parler à un conseiller'))
    expect(advisorBtn).toBeDefined()

    await act(async () => {
      advisorBtn?.click()
    })
    expect(handleOpenAdvisor).toHaveBeenCalledTimes(1)
  })

  it('toggles mobile menu accessibility attributes properly', async () => {
    await act(async () => {
      root.render(
        <AppProvider>
          <Navbar onOpenAdvisorModal={() => {}} />
        </AppProvider>
      )
    })

    const toggleButton = container.querySelector('button[aria-controls="mobile-nav-menu"]')
    expect(toggleButton).not.toBeNull()
    expect(toggleButton?.getAttribute('aria-expanded')).toBe('false')

    // Open mobile menu
    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    const openToggle = container.querySelector('button[aria-controls="mobile-nav-menu"]')
    expect(openToggle?.getAttribute('aria-expanded')).toBe('true')
    const mobileMenu = container.querySelector('#mobile-nav-menu')
    expect(mobileMenu).not.toBeNull()
  })

  it('renders Footer with demo disclaimers, brand notice and functional links', async () => {
    await act(async () => {
      root.render(
        <AppProvider>
          <Footer />
        </AppProvider>
      )
    })

    const text = container.textContent
    expect(text).toContain('Démonstration conçue par MusaTech')
    expect(text).toContain('MusaTech Real Estate')
    expect(text).toContain('Coordonnées Démo')
    expect(text).toContain('Mentions Légales (Démo)')

    // Verify there are no dead links with href="#"
    const anchorTags = Array.from(container.querySelectorAll('a'))
    const hashLinks = anchorTags.filter((a) => a.getAttribute('href') === '#')
    expect(hashLinks.length).toBe(0)
  })
})

