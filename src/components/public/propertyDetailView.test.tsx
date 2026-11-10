import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { PropertyDetailView } from './PropertyDetailView'
import { AppProvider } from '../../context/AppContext'
import { StorageService } from '../../services/storageService'

// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

describe('PropertyDetailView - Phase 07 (Fiche détaillée du bien et galerie interactive)', () => {
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

  it('renders property title, reference, price in FCFA, and key specifications', async () => {
    const publishedProps = StorageService.getProperties().filter((p) => p.status === 'published')
    const targetProp = publishedProps[0]

    await act(async () => {
      root.render(
        <AppProvider>
          <PropertyDetailView
            propertyId={targetProp.id}
            onBookVisit={() => {}}
          />
        </AppProvider>
      )
    })

    const text = container.textContent
    expect(text).toContain(targetProp.title)
    expect(text).toContain(targetProp.reference)
    expect(text).toContain(targetProp.neighborhood)
    expect(text).toContain('FCFA')
    expect(text).toContain(`${targetProp.surface} m²`)
    expect(text).toContain('Titre Foncier')
  })

  it('renders interactive photo gallery with counter, navigation, and thumbnails', async () => {
    const publishedProps = StorageService.getProperties().filter(
      (p) => p.status === 'published' && p.images.length > 1
    )
    const targetProp = publishedProps[0]

    await act(async () => {
      root.render(
        <AppProvider>
          <PropertyDetailView
            propertyId={targetProp.id}
            onBookVisit={() => {}}
          />
        </AppProvider>
      )
    })

    // Gallery counter
    expect(container.textContent).toContain(`Photo 1 / ${targetProp.images.length}`)

    // Next image button
    const nextBtn = container.querySelector('button[aria-label="Photo suivante"]') as HTMLButtonElement
    expect(nextBtn).not.toBeNull()

    await act(async () => {
      nextBtn.click()
    })

    // Counter updated to 2
    expect(container.textContent).toContain(`Photo 2 / ${targetProp.images.length}`)

    // Thumbnails
    const thumbs = container.querySelectorAll('button[aria-label*="Afficher la photo"]')
    expect(thumbs.length).toBe(targetProp.images.length)

    // Clicking a thumbnail
    await act(async () => {
      ;(thumbs[0] as HTMLButtonElement).click()
    })

    expect(container.textContent).toContain(`Photo 1 / ${targetProp.images.length}`)
  })

  it('opens and closes fullscreen lightbox modal on zoom button click', async () => {
    const publishedProps = StorageService.getProperties().filter((p) => p.status === 'published')
    const targetProp = publishedProps[0]

    await act(async () => {
      root.render(
        <AppProvider>
          <PropertyDetailView
            propertyId={targetProp.id}
            onBookVisit={() => {}}
          />
        </AppProvider>
      )
    })

    const zoomBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Plein écran')
    )
    expect(zoomBtn).toBeDefined()

    await act(async () => {
      zoomBtn?.click()
    })

    // Lightbox modal is displayed
    const lightbox = container.querySelector('div[role="dialog"]')
    expect(lightbox).not.toBeNull()
    expect(lightbox?.textContent).toContain('sur')

    // Close button
    const closeBtn = container.querySelector('button[aria-label="Fermer la vue plein écran"]') as HTMLButtonElement
    expect(closeBtn).not.toBeNull()

    await act(async () => {
      closeBtn.click()
    })

    expect(container.querySelector('div[role="dialog"]')).toBeNull()
  })

  it('switches between information tabs (overview, legal, simulator)', async () => {
    const publishedProps = StorageService.getProperties().filter((p) => p.status === 'published')
    const targetProp = publishedProps[0]

    await act(async () => {
      root.render(
        <AppProvider>
          <PropertyDetailView
            propertyId={targetProp.id}
            onBookVisit={() => {}}
          />
        </AppProvider>
      )
    })

    // Overview is active by default
    expect(container.textContent).toContain('Description du bien')
    expect(container.textContent).toContain('Équipements & Prestations')

    // Switch to Location tab
    const locTabBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Localisation & Quartier')
    )
    expect(locTabBtn).toBeDefined()

    await act(async () => {
      locTabBtn?.click()
    })

    expect(container.textContent).toContain('Localisation & Cadre de vie')
    expect(container.textContent).toContain('Repère de quartier illustratif')
    expect(container.textContent).toContain('Discrétion & Sécurité des propriétaires')

    // Switch to Legal tab
    const legalTabBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Sécurité Juridique & Frais')
    )
    expect(legalTabBtn).toBeDefined()

    await act(async () => {
      legalTabBtn?.click()
    })

    expect(container.textContent).toContain('Garanties juridiques & sécurisation des transactions')
    expect(container.textContent).toContain('Compte Séquestre Notarié Agréé')

    // Switch to Simulator tab
    const simTabBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Simulateur Financier')
    )
    expect(simTabBtn).toBeDefined()

    await act(async () => {
      simTabBtn?.click()
    })

    expect(container.textContent).toContain('Simulateur d’emprunt & plan de financement')
    expect(container.textContent).toContain('Mensualité estimée :')
    expect(container.textContent).toContain('Apport personnel :')
  })

  it('renders dedicated advisor card with WhatsApp link and telephone', async () => {
    const publishedProps = StorageService.getProperties().filter(
      (p) => p.status === 'published' && p.agent
    )
    const targetProp = publishedProps[0]

    await act(async () => {
      root.render(
        <AppProvider>
          <PropertyDetailView
            propertyId={targetProp.id}
            onBookVisit={() => {}}
          />
        </AppProvider>
      )
    })

    expect(container.textContent).toContain(targetProp.agent!.name)
    expect(container.textContent).toContain(targetProp.agent!.title)

    const whatsappLink = container.querySelector('a[href*="wa.me"]') as HTMLAnchorElement
    expect(whatsappLink).not.toBeNull()
    expect(whatsappLink.href).toContain('wa.me')
    expect(whatsappLink.href).toContain(encodeURIComponent(targetProp.reference))

    const phoneLink = container.querySelector(`a[href^="tel:"]`) as HTMLAnchorElement
    expect(phoneLink).not.toBeNull()
  })

  it('triggers visit booking callback when clicking Demander une visite button', async () => {
    const publishedProps = StorageService.getProperties().filter((p) => p.status === 'published')
    const targetProp = publishedProps[0]
    const handleBookVisit = vi.fn()

    await act(async () => {
      root.render(
        <AppProvider>
          <PropertyDetailView
            propertyId={targetProp.id}
            onBookVisit={handleBookVisit}
          />
        </AppProvider>
      )
    })

    const bookBtn = Array.from(container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Demander une visite')
    )
    expect(bookBtn).toBeDefined()

    await act(async () => {
      bookBtn?.click()
    })

    expect(handleBookVisit).toHaveBeenCalledWith(targetProp)
  })

  it('toggles favorite status when clicking the Sauvegarder button', async () => {
    const publishedProps = StorageService.getProperties().filter((p) => p.status === 'published')
    const targetProp = publishedProps[0]

    await act(async () => {
      root.render(
        <AppProvider>
          <PropertyDetailView
            propertyId={targetProp.id}
            onBookVisit={() => {}}
          />
        </AppProvider>
      )
    })

    const favBtn = container.querySelector('button[aria-label="Ajouter aux favoris"]') as HTMLButtonElement
    expect(favBtn).not.toBeNull()
    expect(favBtn.textContent).toContain('Sauvegarder')

    await act(async () => {
      favBtn.click()
    })

    // Now it should be "Enregistré"
    expect(container.textContent).toContain('Enregistré')
  })

  it('renders EmptyState when property is not found', async () => {
    await act(async () => {
      root.render(
        <AppProvider>
          <PropertyDetailView
            propertyId="non-existent-id"
            onBookVisit={() => {}}
          />
        </AppProvider>
      )
    })

    expect(container.textContent).toContain('Propriété introuvable')
    expect(container.textContent).toContain('Retourner au catalogue')
  })

  it('renders EmptyState and blocks access if property is draft or archived', async () => {
    // Insert a draft property
    const draftProp = StorageService.addProperty({
      slug: 'villa-draft-secret',
      reference: 'MT-SECRET-001',
      title: 'Villa Privée Non Publiée',
      description: 'Cette villa ne doit pas être visible.',
      transactionType: 'sale',
      propertyType: 'villa',
      price: 500000000,
      currency: 'XOF',
      neighborhood: 'Almadies',
      city: 'Dakar',
      addressLabel: 'Zone Secrète',
      surface: 400,
      bedrooms: 4,
      bathrooms: 4,
      images: ['https://example.com/photo.jpg'],
      amenities: ['Piscine'],
      status: 'draft',
      featured: false,
    })

    await act(async () => {
      root.render(
        <AppProvider>
          <PropertyDetailView
            propertyId={draftProp.id}
            onBookVisit={() => {}}
          />
        </AppProvider>
      )
    })

    expect(container.textContent).toContain('Annonce non disponible')
    expect(container.textContent).toContain('Brouillon')
    expect(container.textContent).toContain('Découvrir les biens disponibles')
    // Confidential description should NOT be leaked
    expect(container.textContent).not.toContain('Cette villa ne doit pas être visible.')
  })
})
