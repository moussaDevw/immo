import React, { useState, useMemo, useEffect } from 'react'
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  LayoutGrid,
  List,
  RotateCcw,
  Building,
  Check,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import { PropertyCard } from './PropertyCard'
import type { DakarNeighborhood, FilterState, Property, PropertyType, TransactionType } from '../../types'
import { PROPERTY_TYPE_LABELS, TRANSACTION_LABELS } from '../../types'
import { EmptyState } from '../ui/EmptyState'
import { PropertyCardSkeleton } from '../ui/Skeleton'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

interface CatalogViewProps {
  onBookVisit: (property: Property) => void
}

const ITEMS_PER_PAGE = 6

const AVAILABLE_AMENITIES = [
  'Piscine',
  'Vue mer',
  'Groupe électrogène',
  'Gardiennage 24/7',
  'Climatisation centrale',
  'Parking sous-sol',
  'Ascenseur',
  'Fibre optique',
  'Jardin paysager',
  'Terrasse panoramique',
  'Domotique',
  'Buanderie',
]

const DAKAR_NEIGHBORHOODS_LIST: DakarNeighborhood[] = [
  'Almadies',
  'Mermoz',
  'Ngor',
  'Plateau',
  'Point E',
  'Sacré-Cœur',
  'Mamelles',
]

export const CatalogView: React.FC<CatalogViewProps> = ({ onBookVisit }) => {
  const { properties, filters, setFilters, resetFilters, isLoadingData } = useApp()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  // Règle métier stricte : Ne retenir QUE les biens au statut 'published'.
  // Les annonces en 'draft' ou 'archived' ne sont jamais visibles publiquement.
  const publishedProperties = useMemo(() => {
    return properties.filter((p) => p.status === 'published')
  }, [properties])

  // Validation du budget : min ne peut pas dépasser max
  const isBudgetInvalid = useMemo(() => {
    if (filters.minPrice !== '' && filters.maxPrice !== '') {
      return Number(filters.minPrice) > Number(filters.maxPrice)
    }
    return false
  }, [filters.minPrice, filters.maxPrice])

  // Synchronisation avec l'URL (sans rechargement de page)
  useEffect(() => {
    try {
      const params = new URLSearchParams()
      if (filters.searchQuery.trim()) params.set('q', filters.searchQuery.trim())
      if (filters.transaction !== 'all') params.set('trans', filters.transaction)
      if (filters.type !== 'all') params.set('type', filters.type)
      if (filters.neighborhood !== 'all') params.set('quartier', filters.neighborhood)
      if (filters.minPrice !== '') params.set('min', String(filters.minPrice))
      if (filters.maxPrice !== '') params.set('max', String(filters.maxPrice))
      if (filters.bedrooms !== 'all') params.set('ch', filters.bedrooms)
      if (filters.sortBy !== 'pertinence') params.set('tri', filters.sortBy)
      if (currentPage > 1) params.set('p', String(currentPage))

      const queryString = params.toString()
      const newUrl = queryString ? `?${queryString}` : window.location.pathname
      window.history.replaceState(null, '', newUrl)
    } catch {
      // Ignorer si l'environnement bloque history
    }
  }, [filters, currentPage])

  // Fermer le drawer mobile sur touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileFiltersOpen) {
        setIsMobileFiltersOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileFiltersOpen])

  // Filtrage combiné et Tri
  const filteredProperties = useMemo(() => {
    return publishedProperties
      .filter((p) => {
        // 1. Recherche textuelle par titre, référence, quartier, adresse
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim()
          const matchTitle = (p.title || '').toLowerCase().includes(q)
          const matchRef = (p.reference || '').toLowerCase().includes(q)
          const matchNeighborhood = (p.neighborhood || '').toLowerCase().includes(q)
          const matchAddress = (p.addressLabel || '').toLowerCase().includes(q)
          const matchDesc = (p.description || '').toLowerCase().includes(q)
          if (!matchTitle && !matchRef && !matchNeighborhood && !matchAddress && !matchDesc) {
            return false
          }
        }

        // 2. Filtre transaction (vente / location)
        if (filters.transaction !== 'all' && p.transactionType !== filters.transaction) {
          return false
        }

        // 3. Filtre quartier
        if (filters.neighborhood !== 'all' && p.neighborhood !== filters.neighborhood) {
          return false
        }

        // 4. Filtre type de bien
        if (filters.type !== 'all' && p.propertyType !== filters.type) {
          return false
        }

        // 5. Validation budgétaire (si valide)
        if (!isBudgetInvalid) {
          if (filters.minPrice !== '' && p.price < Number(filters.minPrice)) {
            return false
          }
          if (filters.maxPrice !== '' && p.price > Number(filters.maxPrice)) {
            return false
          }
        }

        // 6. Chambres
        if (filters.bedrooms !== 'all') {
          const nbChambres = p.bedrooms ?? 0
          if (filters.bedrooms === '4+' && nbChambres < 4) return false
          if (filters.bedrooms !== '4+' && nbChambres !== Number(filters.bedrooms)) return false
        }

        // 7. Surface minimale
        if (filters.minSurface !== '' && (p.surface ?? 0) < Number(filters.minSurface)) {
          return false
        }

        // 8. Équipements
        if (filters.amenities.length > 0) {
          const propAmenities = p.amenities || []
          const hasAll = filters.amenities.every((amenity) => propAmenities.includes(amenity))
          if (!hasAll) return false
        }

        return true
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'prix-asc':
            return a.price - b.price
          case 'prix-desc':
            return b.price - a.price
          case 'surface-desc':
            return (b.surface ?? 0) - (a.surface ?? 0)
          case 'nouveaute':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case 'pertinence':
          default: {
            // Calcul de score de pertinence : matching exact dans titre/réf + biens en avant
            let scoreA = a.featured ? 2 : 0
            let scoreB = b.featured ? 2 : 0
            const q = filters.searchQuery.toLowerCase().trim()
            if (q) {
              if (a.reference.toLowerCase().includes(q)) scoreA += 5
              if (b.reference.toLowerCase().includes(q)) scoreB += 5
              if (a.title.toLowerCase().includes(q)) scoreA += 3
              if (b.title.toLowerCase().includes(q)) scoreB += 3
            }
            if (scoreA !== scoreB) return scoreB - scoreA
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          }
        }
      })
  }, [publishedProperties, filters, isBudgetInvalid])

  // Pagination calculée
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE) || 1
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages)
  const paginatedProperties = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredProperties, safeCurrentPage])

  // Décompte des filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.transaction !== 'all') count++
    if (filters.neighborhood !== 'all') count++
    if (filters.type !== 'all') count++
    if (filters.minPrice !== '') count++
    if (filters.maxPrice !== '') count++
    if (filters.bedrooms !== 'all') count++
    if (filters.minSurface !== '') count++
    if (filters.amenities.length > 0) count += filters.amenities.length
    if (filters.searchQuery.trim() !== '') count++
    return count
  }, [filters])

  const toggleAmenity = (amenity: string) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(amenity)
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      }
    })
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-14">
      <Container size="lg">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#19B8CD]/15 text-[#1499ab] mb-2">
            Portefeuille Immobilier Dakar
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#0B1730] tracking-tight">
            Catalogue des Annonces Immobilières
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Consultez nos villas d’architecte, appartements haut standing, bureaux et terrains certifiés aux Almadies, Ngor, Mamelles, Point E, Plateau, Mermoz et Sacré-Cœur.
          </p>
        </div>

        {/* Top Control Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                placeholder="Rechercher par titre, référence (ex: MT-ALM), quartier..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#19B8CD] focus:outline-none"
              />
              {filters.searchQuery && (
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, searchQuery: '' }))
                  }
                  aria-label="Effacer la recherche textuelle"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick transaction tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, transaction: 'all' }))
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filters.transaction === 'all'
                    ? 'bg-white text-[#0B1730] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, transaction: 'sale' }))
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filters.transaction === 'sale'
                    ? 'bg-white text-[#0B1730] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vente
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, transaction: 'rent' }))
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filters.transaction === 'rent'
                    ? 'bg-white text-[#0B1730] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Location
              </button>
            </div>

            {/* Mobile Filter Button */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD]"
              >
                <Filter className="w-4 h-4 text-[#19B8CD]" />
                <span>Filtres</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#0B1730] text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* View Mode & Sort Dropdown (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Trier par :</span>
              </div>
              <select
                aria-label="Trier les annonces immobilières"
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: e.target.value as FilterState['sortBy'],
                  }))
                }
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#19B8CD] focus:outline-none cursor-pointer"
              >
                <option value="pertinence">Pertinence</option>
                <option value="nouveaute">Plus récent</option>
                <option value="prix-asc">Prix croissant</option>
                <option value="prix-desc">Prix décroissant</option>
                <option value="surface-desc">Surface décroissante</option>
              </select>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  aria-label="Affichage en grille"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#0B1730] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  aria-label="Affichage en liste"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-white text-[#0B1730] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active filters pills */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-3 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-medium">Filtres actifs :</span>

              {filters.neighborhood !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
                  Quartier : {filters.neighborhood}
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, neighborhood: 'all' }))
                    }
                    aria-label={`Retirer le filtre quartier ${filters.neighborhood}`}
                    className="hover:text-rose-500 cursor-pointer ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.type !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
                  Type : {PROPERTY_TYPE_LABELS[filters.type] || filters.type}
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, type: 'all' }))
                    }
                    aria-label="Retirer le filtre type de bien"
                    className="hover:text-rose-500 cursor-pointer ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.transaction !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
                  Transaction : {TRANSACTION_LABELS[filters.transaction]}
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, transaction: 'all' }))
                    }
                    aria-label="Retirer le filtre transaction"
                    className="hover:text-rose-500 cursor-pointer ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.bedrooms !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
                  {filters.bedrooms} chambre(s)
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, bedrooms: 'all' }))
                    }
                    aria-label="Retirer le filtre chambres"
                    className="hover:text-rose-500 cursor-pointer ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.minPrice !== '' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
                  Min : {filters.minPrice} FCFA
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, minPrice: '' }))
                    }
                    aria-label="Retirer le budget minimum"
                    className="hover:text-rose-500 cursor-pointer ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.maxPrice !== '' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium">
                  Max : {filters.maxPrice} FCFA
                  <button
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, maxPrice: '' }))
                    }
                    aria-label="Retirer le budget maximum"
                    className="hover:text-rose-500 cursor-pointer ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#19B8CD]/15 text-[#0f8291] font-medium"
                >
                  {amenity}
                  <button
                    onClick={() => toggleAmenity(amenity)}
                    aria-label={`Retirer le filtre ${amenity}`}
                    className="hover:text-rose-500 cursor-pointer ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-[#1499ab] hover:underline font-bold ml-auto cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Effacer tous les filtres
              </button>
            </div>
          )}
        </div>

        {/* Main Content: Sidebar filters + Property List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-heading font-bold text-base text-[#0B1730] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#19B8CD]" />
                  Affiner la recherche
                </h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Effacer
                  </button>
                )}
              </div>

              {/* Quartier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Quartier de Dakar
                </label>
                <select
                  aria-label="Filtrer par quartier"
                  value={filters.neighborhood}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      neighborhood: e.target.value as 'all' | DakarNeighborhood,
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#19B8CD] focus:outline-none cursor-pointer"
                >
                  <option value="all">Tous les quartiers</option>
                  {DAKAR_NEIGHBORHOODS_LIST.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type de bien */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Type de bien
                </label>
                <select
                  aria-label="Filtrer par type de bien"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: e.target.value as 'all' | PropertyType,
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-[#19B8CD] focus:outline-none cursor-pointer"
                >
                  <option value="all">Tous les types</option>
                  <option value="villa">Villas</option>
                  <option value="apartment">Appartements & Penthouses</option>
                  <option value="office">Bureaux / Pro</option>
                  <option value="land">Terrains</option>
                  <option value="other">Autres</option>
                </select>
              </div>

              {/* Fourchette de Prix avec validation min <= max */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Budget (FCFA)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    aria-label="Prix minimum en Francs CFA"
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value === '' ? '' : Number(e.target.value),
                      }))
                    }
                    className={`w-full px-2.5 py-2 bg-slate-50 border rounded-lg text-xs font-medium focus:outline-none ${
                      isBudgetInvalid
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-400'
                        : 'border-slate-200 focus:ring-2 focus:ring-[#19B8CD]'
                    }`}
                  />
                  <input
                    aria-label="Prix maximum en Francs CFA"
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value === '' ? '' : Number(e.target.value),
                      }))
                    }
                    className={`w-full px-2.5 py-2 bg-slate-50 border rounded-lg text-xs font-medium focus:outline-none ${
                      isBudgetInvalid
                        ? 'border-rose-400 focus:ring-2 focus:ring-rose-400'
                        : 'border-slate-200 focus:ring-2 focus:ring-[#19B8CD]'
                    }`}
                  />
                </div>
                {isBudgetInvalid && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    Le min ne peut pas dépasser le max.
                  </p>
                )}
              </div>

              {/* Nombre de chambres */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Chambres
                </label>
                <div className="grid grid-cols-5 gap-1 text-xs">
                  {['all', '1', '2', '3', '4+'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          bedrooms: opt as FilterState['bedrooms'],
                        }))
                      }
                      className={`py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                        filters.bedrooms === opt
                          ? 'bg-[#0B1730] text-white border-[#0B1730]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {opt === 'all' ? 'Tous' : opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Surface minimale */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Surface minimale (m²)
                </label>
                <input
                  aria-label="Surface minimale en mètres carrés"
                  type="number"
                  placeholder="Ex: 150"
                  value={filters.minSurface}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minSurface: e.target.value === '' ? '' : Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#19B8CD] focus:outline-none"
                />
              </div>

              {/* Équipements & Prestations */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Équipements clés
                </label>
                <div className="space-y-2">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const isChecked = filters.amenities.includes(amenity)
                    return (
                      <label
                        key={amenity}
                        className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer select-none hover:text-[#0B1730]"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAmenity(amenity)}
                          className="w-4 h-4 rounded-sm border-slate-300 text-[#19B8CD] focus:ring-[#19B8CD]"
                        />
                        <span>{amenity}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Property listings */}
          <main className="lg:col-span-3 space-y-6">
            {/* Results count banner */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                <span className="font-bold text-[#0B1730]">
                  {filteredProperties.length}
                </span>{' '}
                bien{filteredProperties.length > 1 ? 's' : ''} disponible
                {filteredProperties.length > 1 ? 's' : ''} à Dakar
              </p>

              {filteredProperties.length > 0 && (
                <span className="text-xs text-slate-400">
                  Affichage de {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1} à{' '}
                  {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredProperties.length)} sur{' '}
                  {filteredProperties.length}
                </span>
              )}
            </div>

            {/* Loading state with Skeletons */}
            {isLoadingData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <PropertyCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              /* Empty state utilisant le composant du design system */
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
                <EmptyState
                  icon={<Building className="w-8 h-8 text-slate-400" />}
                  title="Aucun bien ne correspond à vos critères"
                  description="Modifiez vos filtres de recherche, élargissez votre budget ou explorez d’autres quartiers de Dakar."
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={resetFilters}
                      leftIcon={<RotateCcw className="w-3.5 h-3.5 text-[#19B8CD]" />}
                    >
                      Réinitialiser tous les filtres
                    </Button>
                  }
                />
              </div>
            ) : (
              <>
                {/* Grid / List rendering */}
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                      : 'space-y-6'
                  }
                >
                  {paginatedProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onBookVisit={onBookVisit}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-8 border-t border-slate-200 flex items-center justify-between gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safeCurrentPage <= 1}
                      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                      leftIcon={<ChevronLeft className="w-4 h-4" />}
                    >
                      Précédent
                    </Button>

                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            safeCurrentPage === pageNum
                              ? 'bg-[#0B1730] text-white shadow-xs'
                              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={safeCurrentPage >= totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </Container>

      {/* Mobile Filters Drawer Modal */}
      {isMobileFiltersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filtres de recherche mobile"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
        >
          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#19B8CD]" />
                  <h3 className="font-heading font-bold text-lg text-[#0B1730]">
                    Filtres de recherche
                  </h3>
                </div>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  aria-label="Fermer les filtres"
                  className="p-1 rounded-md text-slate-400 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Transaction */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Transaction
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'all', label: 'Tous' },
                      { id: 'sale', label: 'Vente' },
                      { id: 'rent', label: 'Location' },
                    ] as { id: 'all' | TransactionType; label: string }[]
                  ).map((t) => (
                    <button
                      key={t.id}
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, transaction: t.id }))
                      }
                      className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                        filters.transaction === t.id
                          ? 'bg-[#0B1730] text-white border-[#0B1730]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quartier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Quartier de Dakar
                </label>
                <select
                  aria-label="Quartier mobile"
                  value={filters.neighborhood}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      neighborhood: e.target.value as 'all' | DakarNeighborhood,
                    }))
                  }
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="all">Tous les quartiers</option>
                  {DAKAR_NEIGHBORHOODS_LIST.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Type de bien
                </label>
                <select
                  aria-label="Type de bien mobile"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      type: e.target.value as 'all' | PropertyType,
                    }))
                  }
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="all">Tous les types</option>
                  <option value="villa">Villas</option>
                  <option value="apartment">Appartements & Penthouses</option>
                  <option value="office">Bureaux / Pro</option>
                  <option value="land">Terrains</option>
                  <option value="other">Autres</option>
                </select>
              </div>

              {/* Budget Min & Max */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Budget (FCFA)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    aria-label="Budget min mobile"
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value === '' ? '' : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <input
                    aria-label="Budget max mobile"
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value === '' ? '' : Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Chambres
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {['all', '1', '2', '3', '4+'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          bedrooms: opt as FilterState['bedrooms'],
                        }))
                      }
                      className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                        filters.bedrooms === opt
                          ? 'bg-[#0B1730] text-white border-[#0B1730]'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {opt === 'all' ? 'Tous' : opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Équipements
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {AVAILABLE_AMENITIES.map((amenity) => {
                    const isChecked = filters.amenities.includes(amenity)
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`p-2 rounded-xl border text-left flex items-center justify-between text-[11px] font-medium cursor-pointer ${
                          isChecked
                            ? 'bg-[#19B8CD]/20 border-[#19B8CD] text-[#0f8291]'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{amenity}</span>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-200 flex items-center gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={resetFilters}
                className="w-1/3"
              >
                Effacer
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-2/3"
              >
                Résultats ({filteredProperties.length})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
