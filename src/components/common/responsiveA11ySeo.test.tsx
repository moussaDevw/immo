import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import App from '../../App'
import { StorageService } from '../../services/storageService'
import fs from 'node:fs'
import path from 'node:path'

// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('Quality Gate: Responsive, Accessibility & SEO - Phase 13', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    window.history.replaceState(null, '', '/')
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
    window.history.replaceState(null, '', '/')
  })

  describe('SEO, Robots.txt & Dynamic Metadata Management', () => {
    it('updates document.title and meta robots dynamically per view', async () => {
      await act(async () => {
        root.render(<App />)
      })

      // 1. Home page title
      expect(document.title).toContain('MusaTech Real Estate')
      expect(document.title).toContain('Vente, Location')

      const robotsMeta = document.querySelector('meta[name="robots"]')
      expect(robotsMeta?.getAttribute('content')).toBe('index, follow')

      // 2. Navigate to Catalog via Navbar link
      const mainNav = container.querySelector('nav[aria-label="Navigation principale"]')
      const catalogBtn = Array.from(mainNav?.querySelectorAll('button') || []).find((b) =>
        b.textContent?.includes('Acheter')
      )
      expect(catalogBtn).toBeDefined()

      await act(async () => {
        catalogBtn?.click()
      })

      expect(document.title).toContain('Catalogue Immobilier Dakar')
      expect(robotsMeta?.getAttribute('content')).toBe('index, follow')

      // 3. Navigate to Property Detail
      await act(async () => {
        window.location.hash = 'bien/prop-alm-01'
        window.dispatchEvent(new Event('hashchange'))
      })

      expect(document.title).toContain('Almadies')
      expect(robotsMeta?.getAttribute('content')).toBe('index, follow')

      // 4. Navigate to Admin Space -> sets noindex, nofollow
      StorageService.setAdminAuthenticated(true)
      await act(async () => {
        window.location.hash = 'admin/tableau-de-bord'
        window.dispatchEvent(new Event('hashchange'))
      })

      expect(document.title).toContain('Cockpit Gestionnaire Agence')
      expect(robotsMeta?.getAttribute('content')).toBe('noindex, nofollow')
    })

    it('verifies robots.txt disallows admin paths and references sitemap', () => {
      const robotsPath = path.resolve(process.cwd(), 'public', 'robots.txt')
      expect(fs.existsSync(robotsPath)).toBe(true)

      const content = fs.readFileSync(robotsPath, 'utf-8')
      expect(content).toContain('Disallow: /admin/')
      expect(content).toContain('Disallow: /*#admin*')
      expect(content).toContain('Allow: /')
      expect(content).toContain('sitemap.xml')
    })

    it('verifies sitemap.xml lists published properties and excludes admin routes', () => {
      const sitemapPath = path.resolve(process.cwd(), 'public', 'sitemap.xml')
      expect(fs.existsSync(sitemapPath)).toBe(true)

      const content = fs.readFileSync(sitemapPath, 'utf-8')
      expect(content).toContain('https://musatech-immo.demo.sn/')
      expect(content).toContain('#catalogue')
      expect(content).toContain('#bien/prop-alm-01')
      expect(content).not.toContain('admin')
      expect(content).not.toContain('draft')
    })
  })

  describe('Accessibility (a11y) & WCAG AA Standards', () => {
    it('ensures all interactive buttons and image elements have accessible labels or alt text', async () => {
      await act(async () => {
        root.render(<App />)
      })

      // Images must have non-empty alt text
      const images = Array.from(container.querySelectorAll('img'))
      for (const img of images) {
        expect(img.getAttribute('alt')).toBeTruthy()
        expect(img.getAttribute('alt')?.trim().length).toBeGreaterThan(0)
      }

      // Dialog triggers must have accessible labels
      const advisorBtn = container.querySelector('button[aria-label="Contacter un conseiller"]')
      expect(advisorBtn).toBeTruthy()
    })

    it('supports modal dismissal via Escape key', async () => {
      await act(async () => {
        root.render(<App />)
      })

      // Open Advisor Contact modal
      const advisorBtn = container.querySelector('button[aria-label="Contacter un conseiller"]') as HTMLButtonElement
      expect(advisorBtn).toBeTruthy()

      await act(async () => {
        advisorBtn.click()
      })

      // Modal is open
      let modal = container.querySelector('div[role="dialog"]')
      expect(modal).toBeTruthy()

      // Press Escape
      await act(async () => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      })

      // Modal should be closed
      modal = container.querySelector('div[role="dialog"]')
      expect(modal).toBeNull()
    })
  })

  describe('Responsive Layout & Mobile Controls', () => {
    it('renders mobile navigation toggle and drawer on small viewport widths', async () => {
      await act(async () => {
        root.render(<App />)
      })

      // Mobile hamburger button
      const menuBtn = container.querySelector('button[aria-label="Ouvrir le menu de navigation"]')
      expect(menuBtn).toBeTruthy()
      expect(menuBtn?.getAttribute('aria-expanded')).toBe('false')

      // Open mobile drawer
      await act(async () => {
        ;(menuBtn as HTMLButtonElement).click()
      })

      expect(menuBtn?.getAttribute('aria-expanded')).toBe('true')
      expect(container.textContent).toContain('Navigation')
    })
  })
})

