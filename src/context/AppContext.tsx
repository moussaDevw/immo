import React, { useState, useEffect, useCallback } from 'react'
import type {
  ActiveView,
  AdminUser,
  AppToast,
  FilterState,
  Property,
  StatusHistoryEntry,
  VisitRequest,
  VisitRequestStatus,
} from '../types'
import { DEFAULT_FILTERS, VISIT_STATUS_LABELS } from '../types'
import { DEFAULT_ADMIN_USER } from '../data/mockData'
import { StorageService } from '../services/storageService'
import { AppContext } from './appContextDef'

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      return StorageService.getProperties()
    } catch {
      return []
    }
  })
  const [requests, setRequests] = useState<VisitRequest[]>(() => {
    try {
      return StorageService.getVisitRequests()
    } catch {
      return []
    }
  })
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return StorageService.getFavorites()
    } catch {
      return []
    }
  })
  const [isLoadingData] = useState(false)

  const [activeView, setActiveView] = useState<ActiveView>('home')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return StorageService.getIsAdminAuthenticated()
    } catch {
      return false
    }
  })
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [adminUser] = useState<AdminUser>(DEFAULT_ADMIN_USER)

  const [toast, setToast] = useState<AppToast | null>(null)

  // Sync hash routing on initial load & popstate
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '')
      if (!hash || hash === '/' || hash === 'accueil') {
        setActiveView('home')
        setSelectedPropertyId(null)
      } else if (hash === 'catalogue' || hash === 'biens') {
        setActiveView('catalog')
        setSelectedPropertyId(null)
      } else if (hash.startsWith('bien/')) {
        const id = hash.replace('bien/', '')
        setActiveView('property-detail')
        setSelectedPropertyId(id)
      } else if (hash === 'admin' || hash === 'admin/tableau-de-bord') {
        setActiveView('admin-dashboard')
      } else if (hash === 'admin/biens') {
        setActiveView('admin-properties')
      } else if (hash === 'admin/demandes') {
        setActiveView('admin-requests')
      } else if (hash === 'admin/parametres') {
        setActiveView('admin-settings')
      }
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateTo = useCallback(
    (view: ActiveView, propertyId?: string, requestId?: string) => {
      setActiveView(view)
      if (propertyId !== undefined) {
        setSelectedPropertyId(propertyId)
      }
      if (requestId !== undefined) {
        setSelectedRequestId(requestId)
      }

      // Update URL hash
      let newHash = ''
      switch (view) {
        case 'home':
          newHash = ''
          break
        case 'catalog':
          newHash = 'catalogue'
          break
        case 'property-detail':
          newHash = `bien/${propertyId || selectedPropertyId || ''}`
          break
        case 'admin-dashboard':
          newHash = 'admin/tableau-de-bord'
          break
        case 'admin-properties':
          newHash = 'admin/biens'
          break
        case 'admin-requests':
          newHash = 'admin/demandes'
          break
        case 'admin-settings':
          newHash = 'admin/parametres'
          break
      }

      if (window.location.hash.replace('#', '') !== newHash) {
        window.history.pushState(null, '', newHash ? `#${newHash}` : window.location.pathname)
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [selectedPropertyId]
  )

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
  }, [])

  const toggleFavorite = useCallback((propertyId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
      StorageService.saveFavorites(next)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (propertyId: string) => favorites.includes(propertyId),
    [favorites]
  )

  const showToast = useCallback((toastData: Omit<AppToast, 'id'>) => {
    const id = `toast-${Date.now()}`
    setToast({ ...toastData, id })
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  // Auto hide toast after 5s
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
    }, 5000)
    return () => clearTimeout(timer)
  }, [toast])

  const openAuthModal = useCallback(() => setIsAuthModalOpen(true), [])
  const closeAuthModal = useCallback(() => setIsAuthModalOpen(false), [])

  const loginAdmin = useCallback(() => {
    setIsAdminAuthenticated(true)
    StorageService.setAdminAuthenticated(true)
    setIsAuthModalOpen(false)
    showToast({
      type: 'success',
      title: 'Session démonstration activée',
      message: 'Bienvenue dans l’espace gestionnaire MusaTech.',
    })
    navigateTo('admin-dashboard')
  }, [navigateTo, showToast])

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false)
    StorageService.setAdminAuthenticated(false)
    showToast({
      type: 'info',
      title: 'Session terminée',
      message: 'Vous avez quitté l’espace administration.',
    })
    navigateTo('home')
  }, [navigateTo, showToast])

  const submitVisitRequest = useCallback(
    async (
      data: Omit<VisitRequest, 'id' | 'createdAt' | 'updatedAt' | 'status'>
    ): Promise<{ success: boolean; request?: VisitRequest; error?: string }> => {
      try {
        // Small realistic network delay simulation (300ms)
        await new Promise((resolve) => setTimeout(resolve, 300))

        const created = StorageService.addVisitRequest(data)
        setRequests((prev) => [created, ...prev])

        showToast({
          type: 'success',
          title: 'Demande de visite transmise !',
          message: `Votre demande pour « ${data.propertyTitle} » a bien été enregistrée (Réf. : ${created.id}). Notre conseiller vous contactera sous 2h ouvrées.`,
        })

        return { success: true, request: created }
      } catch (err) {
        console.error('[submitVisitRequest] Erreur', err)
        showToast({
          type: 'error',
          title: 'Erreur d’envoi',
          message: 'Une erreur est survenue lors de l’envoi. Veuillez réessayer.',
        })
        return { success: false, error: 'Erreur lors de l’envoi' }
      }
    },
    [showToast]
  )

  const updateRequestStatus = useCallback(
    (id: string, status: VisitRequestStatus, internalNotes?: string) => {
      const existing = requests.find((r) => r.id === id)
      if (!existing) return

      const now = new Date().toISOString()
      const existingHistory = existing.statusHistory || [
        {
          status: existing.status,
          changedAt: existing.createdAt,
          changedBy: 'Visiteur (Formulaire initial)',
        },
      ]

      const newHistoryEntry: StatusHistoryEntry = {
        status,
        changedAt: now,
        changedBy: adminUser.name,
        note: internalNotes !== undefined ? internalNotes : existing.internalAdminNotes,
      }

      const updated: VisitRequest = {
        ...existing,
        status,
        ...(internalNotes !== undefined ? { internalAdminNotes: internalNotes } : {}),
        statusHistory: [...existingHistory, newHistoryEntry],
        updatedAt: now,
      }

      const saved = StorageService.updateVisitRequest(updated)
      setRequests((prev) => prev.map((r) => (r.id === id ? saved : r)))

      showToast({
        type: 'info',
        title: 'Statut de visite mis à jour',
        message: `La demande de ${existing.fullName} est désormais : « ${VISIT_STATUS_LABELS[status]} ».`,
      })
    },
    [requests, adminUser.name, showToast]
  )

  const createProperty = useCallback(
    (data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property => {
      const created = StorageService.addProperty(data)
      setProperties((prev) => [created, ...prev])

      const statusMsg =
        created.status === 'published'
          ? 'est maintenant publié en ligne sur le site public.'
          : created.status === 'draft'
          ? 'a été enregistré en brouillon (masqué du public).'
          : 'a été enregistré comme archivé.'

      showToast({
        type: 'success',
        title: 'Bien immobilier enregistré',
        message: `Le bien « ${created.title} » (${created.reference}) ${statusMsg}`,
      })
      return created
    },
    [showToast]
  )

  const editProperty = useCallback(
    (data: Property): Property => {
      const prev = properties.find((p) => p.id === data.id)
      const updated = StorageService.updateProperty(data)
      setProperties((prevList) => prevList.map((p) => (p.id === data.id ? updated : p)))

      let title = 'Bien mis à jour'
      let message = `Les modifications pour « ${updated.title} » ont été enregistrées.`

      if (prev && prev.status !== updated.status) {
        if (updated.status === 'published') {
          title = 'Annonce publiée'
          message = `« ${updated.title} » est désormais visible publiquement.`
        } else if (updated.status === 'draft') {
          title = 'Annonce dépubliée'
          message = `« ${updated.title} » est repassée en brouillon (retirée du public).`
        } else if (updated.status === 'archived') {
          title = 'Annonce archivée'
          message = `« ${updated.title} » a été archivée avec succès.`
        }
      }

      showToast({
        type: 'success',
        title,
        message,
      })
      return updated
    },
    [properties, showToast]
  )

  const removeProperty = useCallback(
    (id: string): boolean => {
      const target = properties.find((p) => p.id === id)
      const success = StorageService.deleteProperty(id)
      if (success) {
        setProperties((prev) => prev.filter((p) => p.id !== id))
        showToast({
          type: 'info',
          title: 'Bien supprimé',
          message: target ? `Le bien « ${target.title} » a été retiré.` : 'Le bien a été retiré.',
        })
      }
      return success
    },
    [properties, showToast]
  )

  const resetDemoData = useCallback(() => {
    StorageService.resetToDefaultData()
    setProperties(StorageService.getProperties())
    setRequests(StorageService.getVisitRequests())
    setFilters(DEFAULT_FILTERS)
    showToast({
      type: 'info',
      title: 'Données de démonstration réinitialisées',
      message: 'Les 19 biens immobiliers et 7 demandes de visite par défaut ont été restaurés.',
    })
  }, [showToast])

  return (
    <AppContext.Provider
      value={{
        properties,
        requests,
        isLoadingData,
        activeView,
        selectedPropertyId,
        selectedRequestId,
        navigateTo,
        filters,
        setFilters,
        resetFilters,
        favorites,
        toggleFavorite,
        isFavorite,
        isAdminAuthenticated,
        isAuthModalOpen,
        adminUser,
        openAuthModal,
        closeAuthModal,
        loginAdmin,
        logoutAdmin,
        submitVisitRequest,
        updateRequestStatus,
        createProperty,
        editProperty,
        removeProperty,
        resetDemoData,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
