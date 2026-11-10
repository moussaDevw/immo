import React, { useState, useMemo } from 'react'
import {
  Heart,
  LayoutGrid,
  List,
  Trash2,
  PhoneCall,
  ArrowRight,
  Sparkles,
  Building2,
  Compass,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import { PropertyCard } from './PropertyCard'
import type { Property, TransactionType } from '../../types'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'

interface FavoritesViewProps {
  onBookVisit: (property: Property) => void
  onOpenAdvisorModal: () => void
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  onBookVisit,
  onOpenAdvisorModal,
}) => {
  const { favorites, properties, clearFavorites, navigateTo } = useApp()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [transactionFilter, setTransactionFilter] = useState<'all' | TransactionType>('all')
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false)

  // Filter properties that match saved favorite IDs
  const favoriteProperties = useMemo(() => {
    const favSet = new Set(favorites)
    return properties.filter((p) => favSet.has(p.id) && p.status !== 'archived')
  }, [favorites, properties])

  // Count by transaction type
  const saleCount = useMemo(
    () => favoriteProperties.filter((p) => p.transactionType === 'sale').length,
    [favoriteProperties]
  )
  const rentCount = useMemo(
    () => favoriteProperties.filter((p) => p.transactionType === 'rent').length,
    [favoriteProperties]
  )

  // Apply sub-filter
  const displayedProperties = useMemo(() => {
    if (transactionFilter === 'all') return favoriteProperties
    return favoriteProperties.filter((p) => p.transactionType === transactionFilter)
  }, [favoriteProperties, transactionFilter])

  const handleClearAll = () => {
    clearFavorites()
    setIsConfirmClearOpen(false)
  }

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-[calc(100vh-140px)]">
      <Container size="xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Fil d'ariane"
          className="flex items-center gap-2 text-xs text-slate-500 mb-6"
        >
          <button
            onClick={() => navigateTo('home')}
            className="hover:text-[#0B1730] transition-colors cursor-pointer"
          >
            Accueil
          </button>
          <span>/</span>
          <span className="font-semibold text-[#0B1730]" aria-current="page">
            Mes Favoris
          </span>
        </nav>

        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Sélection Privée & Coups de Cœur</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-heading font-extrabold text-[#0B1730] tracking-tight">
                Mes Biens Immobiliers Favoris
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Retrouvez l’ensemble des villas, appartements et opportunités foncières que vous avez sauvegardés à Dakar. Vous pouvez comparer les caractéristiques, planifier vos visites ou solliciter un accompagnement dédié.
              </p>
            </div>

            {/* Quick summary card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-xl">
                {favoriteProperties.length}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Sélection
                </span>
                <span className="font-heading font-extrabold text-base text-[#0B1730]">
                  {favoriteProperties.length} bien{favoriteProperties.length > 1 ? 's' : ''} enregistré{favoriteProperties.length > 1 ? 's' : ''}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {saleCount} vente{saleCount > 1 ? 's' : ''} • {rentCount} location{rentCount > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {favoriteProperties.length === 0 ? (
          /* Empty state when user has no saved favorites */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-16 text-center shadow-xs">
            <div className="max-w-md mx-auto space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-rose-50 border-2 border-rose-100 flex items-center justify-center mx-auto text-rose-500 shadow-xs">
                <Heart className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-[#0B1730]">
                  Votre carnet de favoris est vide
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Vous n'avez pas encore ajouté de biens à votre sélection. Parcourez notre portefeuille à Dakar et cliquez sur l'icône cœur sur les annonces pour les retrouver facilement ici.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="cyan"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => navigateTo('catalog')}
                >
                  Explorer le catalogue
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Compass className="w-4 h-4 text-[#19B8CD]" />}
                  onClick={() => navigateTo('home')}
                >
                  Découvrir les quartiers
                </Button>
              </div>

              {/* Quick suggestions */}
              <div className="pt-6 border-t border-slate-100 text-left">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Suggestions populaires à Dakar :
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Almadies', 'Ngor', 'Mamelles', 'Plateau', 'Fann Résidence'].map((neighborhood) => (
                    <button
                      key={neighborhood}
                      onClick={() => navigateTo('catalog')}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-600 font-medium border border-slate-200 transition-colors cursor-pointer"
                    >
                      {neighborhood}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Favorites list with controls */
          <div className="space-y-6">
            {/* Filter and View mode control bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              {/* Transaction tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setTransactionFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    transactionFilter === 'all'
                      ? 'bg-white text-[#0B1730] shadow-xs'
                      : 'text-slate-600 hover:text-[#0B1730]'
                  }`}
                >
                  Tous ({favoriteProperties.length})
                </button>
                <button
                  onClick={() => setTransactionFilter('sale')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    transactionFilter === 'sale'
                      ? 'bg-white text-[#0B1730] shadow-xs'
                      : 'text-slate-600 hover:text-[#0B1730]'
                  }`}
                >
                  Vente ({saleCount})
                </button>
                <button
                  onClick={() => setTransactionFilter('rent')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    transactionFilter === 'rent'
                      ? 'bg-white text-[#0B1730] shadow-xs'
                      : 'text-slate-600 hover:text-[#0B1730]'
                  }`}
                >
                  Location ({rentCount})
                </button>
              </div>

              {/* View mode & Clear actions */}
              <div className="flex items-center gap-2">
                {/* View Mode Buttons */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    aria-label="Affichage grille"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white text-[#0B1730] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    aria-label="Affichage liste"
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      viewMode === 'list'
                        ? 'bg-white text-[#0B1730] shadow-xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Clear all favorites button */}
                {isConfirmClearOpen ? (
                  <div className="flex items-center gap-1.5 animate-in fade-in">
                    <button
                      onClick={handleClearAll}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      Confirmer le vidage
                    </button>
                    <button
                      onClick={() => setIsConfirmClearOpen(false)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsConfirmClearOpen(true)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Vider tous mes favoris"
                    aria-label="Vider tous mes favoris"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Properties Grid or List */}
            {displayedProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs sm:text-sm">
                Aucun bien en favoris ne correspond au filtre sélectionné.
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {displayedProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onBookVisit={onBookVisit}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Assistance banner */}
            <div className="bg-gradient-to-r from-[#0B1730] to-[#14264d] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 mt-12 shadow-lg">
              <div className="space-y-2 text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#19B8CD]">
                  <Sparkles className="w-3.5 h-3.5" />
                  Visite Groupée & Conseil Personnalisé
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold">
                  Besoin d'organiser des visites pour votre sélection ?
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                  Notre équipe planifie un itinéraire optimisé sur Dakar pour visiter plusieurs biens en une seule matinée, ou réalise une visite guidée en visio WhatsApp pour la diaspora.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Button
                  variant="cyan"
                  size="md"
                  leftIcon={<PhoneCall className="w-4 h-4" />}
                  onClick={onOpenAdvisorModal}
                >
                  Contacter un conseiller
                </Button>
                <Button
                  variant="outline-dark"
                  size="md"
                  leftIcon={<Building2 className="w-4 h-4 text-slate-200" />}
                  onClick={() => navigateTo('catalog')}
                >
                  Ajouter d'autres biens
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}

