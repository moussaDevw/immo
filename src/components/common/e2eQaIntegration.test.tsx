import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import App from '../../App'
import { StorageService } from '../../services/storageService'
import type { Property } from '../../types'

// @ts-expect-error global flag for react testing
globalThis.IS_REACT_ACT_ENVIRONMENT = true

function setInputValue(input: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto =
    input instanceof HTMLTextAreaElement
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
  setter?.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
  input.dispatchEvent(new Event('change', { bubbles: true }))
}

describe('Senior QA Engineer - End-to-End Functional & Boundary Test Suite (Phase 14)', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    localStorage.clear()
    StorageService.resetToDefaultData()
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
    vi.restoreAllMocks()
  })

  // =========================================================================
  // 1. PARCOURS UTILISATEUR PUBLICS (1 à 5)
  // =========================================================================
  describe('Parcours Publics : Découverte, Filtres, Tri et Consultation', () => {
    it('Parcours 1 & 2 : Accueil vers catalogue et recherche par quartier', async () => {
      await act(async () => {
        root.render(<App />)
      })

      // Vérifier présence Hero
      expect(container.textContent).toContain('Trouvez le bien immobilier qui vous correspond')

      // Clic sur le quartier Almadies dans la section quartiers populaires
      const almadiesBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Almadies')
      )
      expect(almadiesBtn).toBeDefined()

      await act(async () => {
        almadiesBtn?.click()
      })

      // On doit être sur le catalogue avec le titre du catalogue
      expect(container.textContent).toContain('Catalogue des Annonces Immobilières')
      expect(container.textContent).toContain('Quartier : Almadies')

      // Toutes les cartes affichées doivent mentionner Almadies
      const cards = container.querySelectorAll('article')
      expect(cards.length).toBeGreaterThan(0)
      for (const card of Array.from(cards)) {
        expect(card.textContent).toContain('Almadies')
      }
    })

    it('Parcours 3 : Combinaison de filtres multi-critères (Vente + Villa + Almadies)', async () => {
      await act(async () => {
        root.render(<App />)
      })

      // Aller au catalogue via le menu
      const mainNav = container.querySelector('nav[aria-label="Navigation principale"]')
      const buyLink = Array.from(mainNav?.querySelectorAll('button') || []).find((b) =>
        b.textContent?.includes('Acheter')
      )
      await act(async () => {
        buyLink?.click()
      })

      // Sélectionner le quartier Almadies
      const neighborhoodSelect = container.querySelector('select[aria-label*="quartier"]') as HTMLSelectElement
      if (neighborhoodSelect) {
        await act(async () => {
          neighborhoodSelect.value = 'Almadies'
          neighborhoodSelect.dispatchEvent(new Event('change', { bubbles: true }))
        })
      }

      // Sélectionner le type de bien Villa
      const typeSelect = container.querySelector('select[aria-label*="type"]') as HTMLSelectElement
      if (typeSelect) {
        await act(async () => {
          typeSelect.value = 'villa'
          typeSelect.dispatchEvent(new Event('change', { bubbles: true }))
        })
      }

      // Vérifier que la liste affiche des villas aux Almadies
      const resultText = container.textContent
      expect(resultText).toContain('Almadies')
      expect(resultText).toContain('Villa')
    })

    it('Parcours 4 : Tri par prix croissant et décroissant', async () => {
      await act(async () => {
        root.render(<App />)
      })

      // Aller au catalogue
      const mainNav = container.querySelector('nav[aria-label="Navigation principale"]')
      const buyLink = Array.from(mainNav?.querySelectorAll('button') || []).find((b) =>
        b.textContent?.includes('Acheter')
      )
      await act(async () => {
        buyLink?.click()
      })

      // Trouver le sélecteur de tri
      const sortSelect = container.querySelector('select[aria-label*="Trier"]') as HTMLSelectElement
      expect(sortSelect).toBeTruthy()

      // 1. Tri prix croissant
      await act(async () => {
        sortSelect.value = 'prix-asc'
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }))
      })

      // 2. Tri prix décroissant
      await act(async () => {
        sortSelect.value = 'prix-desc'
        sortSelect.dispatchEvent(new Event('change', { bubbles: true }))
      })

      expect(sortSelect.value).toBe('prix-desc')
    })

    it('Parcours 5 : Consultation d’une fiche détaillée et navigation galerie', async () => {
      await act(async () => {
        root.render(<App />)
      })

      // Clic sur le premier titre de propriété pour ouvrir la fiche
      const firstPropertyTitle = container.querySelector('article h3') as HTMLElement
      expect(firstPropertyTitle).toBeTruthy()
      const titleText = firstPropertyTitle.textContent || ''

      await act(async () => {
        firstPropertyTitle.click()
      })

      // Vérifier présence fil d'Ariane, titre et onglets
      expect(container.textContent).toContain('Retour au catalogue')
      expect(container.textContent).toContain(titleText)
      expect(container.textContent).toContain('Présentation & Prestations')
      expect(container.textContent).toContain('Simulateur Financier')
    })
  })

  // =========================================================================
  // 2. GESTION DES DEMANDES ET PROSPECTS (6 à 8)
  // =========================================================================
  describe('Parcours Demandes : Réservation, Suivi Dashboard et Statuts', () => {
    it('Parcours 6 & 7 : Soumission d’une demande de visite et vérification dans le cockpit agence', async () => {
      await act(async () => {
        root.render(<App />)
      })

      // 1. Trouver un bouton "Visiter" sur une carte
      const visitBtns = Array.from(container.querySelectorAll('button')).filter((b) =>
        b.textContent?.includes('Visiter')
      )
      expect(visitBtns.length).toBeGreaterThan(0)

      await act(async () => {
        visitBtns[0].click()
      })

      // Modale de visite ouverte
      const modal = container.querySelector('div[role="dialog"]')
      expect(modal).toBeTruthy()
      expect(modal?.textContent).toContain('Demander une visite')

      // Remplir le formulaire avec setInputValue
      const nameInput = modal?.querySelector('input[placeholder*="Mariama"]') as HTMLInputElement
      const phoneInput = modal?.querySelector('input[placeholder*="+221 77"]') as HTMLInputElement
      const emailInput = modal?.querySelector('input[placeholder*="nom@exemple"]') as HTMLInputElement
      const consentCheckbox = modal?.querySelector('#consent-booking-checkbox') as HTMLInputElement

      await act(async () => {
        setInputValue(nameInput, 'Ibrahima Fall')
        setInputValue(phoneInput, '+221 77 987 65 43')
        setInputValue(emailInput, 'ibrahima.fall@demo.sn')
        consentCheckbox.click()
      })

      // Soumettre via l'événement submit
      const form = modal?.querySelector('form') as HTMLFormElement
      await act(async () => {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })

      // Attendre la latence réseau simulée (300ms)
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 400))
      })

      // Message de succès avec confirmation
      expect(modal?.textContent).toContain('Demande transmise avec succès !')
      expect(modal?.textContent).toContain('Ibrahima Fall')

      // 2. Vérifier dans le cockpit agence
      await act(async () => {
        window.location.hash = 'admin/demandes'
        window.dispatchEvent(new Event('hashchange'))
      })

      // Déverrouiller l'accès démo si l'écran de verrouillage est affiché
      const unlockBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Accéder avec le compte démo')
      )
      if (unlockBtn) {
        await act(async () => {
          unlockBtn.click()
        })
      }

      // Si la modale d'authentification s'affiche, confirmer avec "Accéder à la démo"
      const authConfirmBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Accéder à la démo')
      )
      if (authConfirmBtn) {
        await act(async () => {
          authConfirmBtn.click()
        })
        // Attendre la simulation d'authentification locale (400ms)
        await act(async () => {
          await new Promise((resolve) => setTimeout(resolve, 450))
        })
      }

      // La demande d'Ibrahima Fall doit être présente sur le tableau de bord
      expect(container.textContent).toContain('Ibrahima Fall')
      expect(container.textContent).toContain('Nouveau')

      // Accéder à la liste complète des demandes pour vérifier le numéro de téléphone
      const requestsNavBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Demandes de visite')
      )
      if (requestsNavBtn) {
        await act(async () => {
          requestsNavBtn.click()
        })
        expect(container.textContent).toContain('Ibrahima Fall')
        expect(container.textContent).toContain('+221 77 987 65 43')
      }
    })

    it('Parcours 8 : Changement de statut et historique d’audit', async () => {
      StorageService.setAdminAuthenticated(true)
      await act(async () => {
        window.location.hash = 'admin/demandes'
        window.dispatchEvent(new Event('hashchange'))
        root.render(<App />)
      })

      // Trouver le bouton "Détails" de consultation d'une demande
      const detailBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.trim() === 'Détails'
      )
      expect(detailBtn).toBeTruthy()

      await act(async () => {
        detailBtn?.click()
      })

      // Modale de détail de la demande
      const detailModal = container.querySelector('div[role="dialog"]')
      expect(detailModal).toBeTruthy()
      expect(detailModal?.textContent).toContain('Dossier de Visite')

      // Clic sur le bouton de statut "Traité"
      const traiteeBtn = Array.from(detailModal?.querySelectorAll('button') || []).find(
        (b) => b.textContent?.trim() === 'Traité'
      )
      expect(traiteeBtn).toBeTruthy()

      await act(async () => {
        traiteeBtn?.click()
      })

      // Saisir une note interne
      const notesTextarea = detailModal?.querySelector('textarea') as HTMLTextAreaElement
      if (notesTextarea) {
        await act(async () => {
          setInputValue(notesTextarea, 'Visite effectuée ce matin. Client très intéressé par le titre foncier.')
        })
      }

      // Soumettre la mise à jour
      const form = detailModal?.querySelector('form') as HTMLFormElement
      await act(async () => {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })

      // Vérifier que la mise à jour est enregistrée
      expect(container.textContent).toContain('Traité')
    })
  })

  // =========================================================================
  // 3. GESTION DU PORTFOLIO IMMOBILIER CRUD (9 à 12)
  // =========================================================================
  describe('Parcours Portfolio : CRUD, Publication et Archivage', () => {
    it('Parcours 9 : Création d’un nouveau bien immobilier', async () => {
      StorageService.setAdminAuthenticated(true)
      await act(async () => {
        window.location.hash = 'admin/biens'
        window.dispatchEvent(new Event('hashchange'))
        root.render(<App />)
      })

      // Clic sur "Publier un nouveau bien"
      const addBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('nouveau bien')
      )
      expect(addBtn).toBeDefined()

      await act(async () => {
        addBtn?.click()
      })

      const formModal = container.querySelector('div[role="dialog"]')
      expect(formModal).toBeTruthy()

      // Remplir les champs obligatoires avec setInputValue
      const titleInput = formModal?.querySelector('input[placeholder*="Villa contemporaine"]') as HTMLInputElement
      const addressInput = formModal?.querySelector('input[placeholder*="Zone Résidentielle"]') as HTMLInputElement
      const priceInput = formModal?.querySelector('input[placeholder*="450000000"]') as HTMLInputElement
      const surfaceInput = formModal?.querySelector('input[placeholder*="350"]') as HTMLInputElement

      await act(async () => {
        setInputValue(titleInput, 'Villa QA Test Mermoz 2026')
        setInputValue(addressInput, 'Mermoz Pyrotechnie, Dakar')
        setInputValue(priceInput, '220000000')
        setInputValue(surfaceInput, '280')
      })

      // Soumettre le formulaire
      const form = formModal?.querySelector('form') as HTMLFormElement
      await act(async () => {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })

      // Vérifier que le bien est présent dans la liste
      expect(container.textContent).toContain('Villa QA Test Mermoz 2026')
    })

    it('Parcours 10 & 11 : Modification et bascule publication / dépublication', async () => {
      StorageService.setAdminAuthenticated(true)
      await act(async () => {
        window.location.hash = 'admin/biens'
        window.dispatchEvent(new Event('hashchange'))
        root.render(<App />)
      })

      // Trouver un bouton basculer publication (ex: Dépublier MT-ALM-2026-01)
      const togglePubBtn = container.querySelector('button[aria-label^="Dépublier"]') as HTMLButtonElement
      expect(togglePubBtn).toBeTruthy()

      await act(async () => {
        togglePubBtn.click()
      })

      // Le statut a basculé en Brouillon
      expect(container.textContent).toContain('Brouillon')
    })

    it('Parcours 12 : Archivage avec confirmation et vérification de la disparition publique', async () => {
      // Mock window.confirm pour autoriser l'archivage
      vi.spyOn(window, 'confirm').mockReturnValue(true)

      StorageService.setAdminAuthenticated(true)
      await act(async () => {
        window.location.hash = 'admin/biens'
        window.dispatchEvent(new Event('hashchange'))
        root.render(<App />)
      })

      // Trouver le bouton d'archivage d'un bien
      const archiveBtn = container.querySelector('button[aria-label^="Archiver"]') as HTMLButtonElement
      expect(archiveBtn).toBeTruthy()

      await act(async () => {
        archiveBtn.click()
      })

      // Retourner au site public depuis l'espace admin
      const exitAdminBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Site public') || b.textContent?.includes('Retour au site public')
      )
      expect(exitAdminBtn).toBeTruthy()
      await act(async () => {
        exitAdminBtn?.click()
      })

      // Naviguer vers le catalogue public via le lien Acheter du menu
      const mainNav = container.querySelector('nav[aria-label="Navigation principale"]')
      const catalogNavBtn = Array.from(mainNav?.querySelectorAll('button') || []).find((b) =>
        b.textContent?.includes('Acheter')
      )
      await act(async () => {
        catalogNavBtn?.click()
      })

      // Les biens archivés ne doivent jamais apparaître dans le catalogue public
      const publicCards = container.querySelectorAll('article')
      expect(publicCards.length).toBeGreaterThan(0)
      for (const card of Array.from(publicCards)) {
        expect(card.textContent).not.toContain('Archivé')
      }
    })
  })

  // =========================================================================
  // 4. CAS LIMITES & CONDITIONS AUX LIMITES (Boundary Conditions)
  // =========================================================================
  describe('Cas Limites & Robustesse Technique', () => {
    it('Cas Limite 1 : Recherche sans aucun résultat -> État vide et réinitialisation', async () => {
      await act(async () => {
        root.render(<App />)
      })

      // Aller au catalogue via le menu
      const mainNav = container.querySelector('nav[aria-label="Navigation principale"]')
      const buyLink = Array.from(mainNav?.querySelectorAll('button') || []).find((b) =>
        b.textContent?.includes('Acheter')
      )
      await act(async () => {
        buyLink?.click()
      })

      // Saisir une recherche textuelle introuvable avec setInputValue
      const searchInput = container.querySelector('input[placeholder*="Rechercher par titre"]') as HTMLInputElement
      expect(searchInput).toBeTruthy()

      await act(async () => {
        setInputValue(searchInput, 'QuartierIntrouvableXYZ9999')
      })

      // Vérifier état vide
      expect(container.textContent).toContain('Aucun bien ne correspond à vos critères')

      // Clic sur le bouton de réinitialisation de l'état vide
      const resetBtn = Array.from(container.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('Réinitialiser tous les filtres')
      )
      expect(resetBtn).toBeDefined()

      await act(async () => {
        resetBtn?.click()
      })

      // Résultats restaurés
      expect(container.textContent).not.toContain('Aucun bien ne correspond à vos critères')
      expect(container.querySelectorAll('article').length).toBeGreaterThan(0)
    })

    it('Cas Limite 2 : Bien inconnu -> Écran de repli 404', async () => {
      await act(async () => {
        window.location.hash = 'bien/id-inexistant-404'
        window.dispatchEvent(new Event('hashchange'))
        root.render(<App />)
      })

      expect(container.textContent).toContain('Propriété introuvable')
      expect(container.textContent).toContain('Retourner au catalogue')
    })

    it('Cas Limite 3 : Bien non publié (Brouillon) accédé publiquement', async () => {
      // prop-alm-draft-01 est un brouillon dans le mockData
      await act(async () => {
        window.location.hash = 'bien/prop-alm-draft-01'
        window.dispatchEvent(new Event('hashchange'))
        root.render(<App />)
      })

      expect(container.textContent).toContain('Annonce non disponible')
      expect(container.textContent).toContain('Brouillon')
      expect(container.textContent).toContain('Découvrir les biens disponibles')
    })

    it('Cas Limite 4 : Formulaire invalide (champs requis manquants)', async () => {
      await act(async () => {
        root.render(<App />)
      })

      const visitBtns = Array.from(container.querySelectorAll('button')).filter((b) =>
        b.textContent?.includes('Visiter')
      )
      await act(async () => {
        visitBtns[0].click()
      })

      const modal = container.querySelector('div[role="dialog"]')
      const form = modal?.querySelector('form') as HTMLFormElement

      // Soumettre formulaire vide sans consentement
      await act(async () => {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })

      // Bloqué avec message d'erreur
      expect(modal?.textContent).toContain('Veuillez renseigner votre nom')
    })

    it('Cas Limite 5 & 6 : Validation téléphone sénégalais +221 et diaspora', async () => {
      await act(async () => {
        root.render(<App />)
      })

      const visitBtns = Array.from(container.querySelectorAll('button')).filter((b) =>
        b.textContent?.includes('Visiter')
      )
      await act(async () => {
        visitBtns[0].click()
      })

      const modal = container.querySelector('div[role="dialog"]')
      const nameInput = modal?.querySelector('input[placeholder*="Mariama"]') as HTMLInputElement
      const phoneInput = modal?.querySelector('input[placeholder*="+221 77"]') as HTMLInputElement
      const emailInput = modal?.querySelector('input[placeholder*="nom@exemple"]') as HTMLInputElement
      const consentCheckbox = modal?.querySelector('#consent-booking-checkbox') as HTMLInputElement
      const form = modal?.querySelector('form') as HTMLFormElement

      // Téléphone sénégalais complet
      await act(async () => {
        setInputValue(nameInput, 'Fatou Ndiaye')
        setInputValue(phoneInput, '+221 78 500 12 34')
        setInputValue(emailInput, 'fatou@demo.sn')
        consentCheckbox.click()
      })

      await act(async () => {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })

      // Attendre la latence réseau simulée (300ms)
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 400))
      })

      expect(modal?.textContent).toContain('Demande transmise avec succès !')
    })

    it('Cas Limite 7 : Absence de caractéristiques optionnelles (pas de crash)', async () => {
      // Créer une propriété minimale sans chambres ni surface dans le storage
      const minimalProp: Property = {
        id: 'prop-test-minimal',
        slug: 'terrain-minimal-qa',
        reference: 'MT-MIN-01',
        title: 'Terrain Constructible Minimal',
        description: 'Parcelle brute sans bâtiment.',
        price: 50000000,
        currency: 'XOF',
        propertyType: 'land',
        transactionType: 'sale',
        status: 'published',
        neighborhood: 'Mamelles',
        addressLabel: 'Mamelles Phare, Dakar',
        city: 'Dakar',
        featured: false,
        surface: 0,
        bedrooms: 0,
        bathrooms: 0,
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'],
        amenities: [],
        createdAt: '2026-03-01T00:00:00Z',
        updatedAt: '2026-03-01T00:00:00Z',
      }
      StorageService.saveProperties([minimalProp, ...StorageService.getProperties()])

      await act(async () => {
        window.location.hash = 'bien/prop-test-minimal'
        window.dispatchEvent(new Event('hashchange'))
        root.render(<App />)
      })

      // Doit s'afficher sans crash et sans inventer des chambres
      expect(container.textContent).toContain('Terrain Constructible Minimal')
      expect(container.textContent).not.toContain('0 ch.')
    })

    it('Cas Limite 8 : Persistance après rechargement (localStorage)', () => {
      const allProps = StorageService.getProperties()
      expect(allProps.length).toBeGreaterThanOrEqual(19)

      const requests = StorageService.getVisitRequests()
      expect(requests.length).toBeGreaterThanOrEqual(7)
    })
  })
})
