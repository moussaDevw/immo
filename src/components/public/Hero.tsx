import React, { useState } from 'react'
import {
  Search,
  MapPin,
  Home,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import type { DakarNeighborhood, PropertyType, TransactionType } from '../../types'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

const POPULAR_NEIGHBORHOODS: DakarNeighborhood[] = [
  'Almadies',
  'Ngor',
  'Mamelles',
  'Point E',
  'Mermoz',
  'Plateau',
  'Sacré-Cœur',
]

export const Hero: React.FC = () => {
  const { setFilters, navigateTo, properties } = useApp()

  const [transaction, setTransaction] = useState<'all' | TransactionType>('all')
  const [neighborhood, setNeighborhood] = useState<'all' | DakarNeighborhood>('all')
  const [propertyType, setPropertyType] = useState<'all' | PropertyType>('all')
  const [minPrice, setMinPrice] = useState<string>('')
  const [maxPrice, setMaxPrice] = useState<string>('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters((prev) => ({
      ...prev,
      transaction,
      neighborhood,
      type: propertyType,
      minPrice: minPrice ? Number(minPrice) : '',
      maxPrice: maxPrice ? Number(maxPrice) : '',
    }))
    navigateTo('catalog')
  }

  return (
    <section
      aria-label="Recherche de biens immobiliers à Dakar"
      className="relative bg-[#0B1730] text-white overflow-hidden py-16 sm:py-20 lg:py-24"
    >
      {/* Background Image with optimized dark gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt="Propriété de prestige à Dakar"
          className="w-full h-full object-cover object-center opacity-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1730] via-[#0B1730]/90 to-[#0B1730]/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1730] via-transparent to-transparent" />
      </div>

      <Container size="lg" className="relative z-10">
        <div className="max-w-3xl space-y-5">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#19B8CD]/15 text-[#19B8CD] border border-[#19B8CD]/30 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Démonstration commerciale conçue par MusaTech</span>
          </div>

          {/* Main Title (conforme à l'exigence formelle) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-white leading-tight">
            Trouvez le bien immobilier <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-[#19B8CD]">
              qui vous correspond
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
            Découvrez notre sélection exclusive de villas, appartements de standing, bureaux et terrains certifiés dans les quartiers les plus recherchés de Dakar.
          </p>

          {/* Quick neighborhood filters pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-300">
            <span className="text-slate-400 font-medium">Secteurs phares :</span>
            {POPULAR_NEIGHBORHOODS.slice(0, 5).map((n) => (
              <button
                key={n}
                onClick={() => {
                  setFilters((prev) => ({ ...prev, neighborhood: n }))
                  navigateTo('catalog')
                }}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-[#19B8CD]/20 hover:text-[#19B8CD] border border-slate-700 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD]"
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Moteur de recherche rapide complet */}
        <div className="mt-8 lg:mt-10 max-w-5xl bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-slate-800 border border-slate-200">
          {/* Transaction Tabs */}
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <button
              type="button"
              onClick={() => setTransaction('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] ${
                transaction === 'all'
                  ? 'bg-[#0B1730] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tous les biens ({properties.length})
            </button>
            <button
              type="button"
              onClick={() => setTransaction('sale')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] ${
                transaction === 'sale'
                  ? 'bg-[#0B1730] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              À Vendre
            </button>
            <button
              type="button"
              onClick={() => setTransaction('rent')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] ${
                transaction === 'rent'
                  ? 'bg-[#0B1730] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              À Louer
            </button>
          </div>

          {/* Form Fields: Quartier, Type, Budget Min, Budget Max, Bouton */}
          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4 items-end"
          >
            {/* Quartier */}
            <div>
              <label
                htmlFor="hero-neighborhood"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-[#1499ab]" />
                Quartier
              </label>
              <select
                id="hero-neighborhood"
                value={neighborhood}
                onChange={(e) =>
                  setNeighborhood(e.target.value as 'all' | DakarNeighborhood)
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#19B8CD] focus:outline-none cursor-pointer"
              >
                <option value="all">Tous les quartiers</option>
                <option value="Almadies">Almadies</option>
                <option value="Mermoz">Mermoz</option>
                <option value="Ngor">Ngor</option>
                <option value="Plateau">Plateau</option>
                <option value="Point E">Point E</option>
                <option value="Sacré-Cœur">Sacré-Cœur</option>
                <option value="Mamelles">Mamelles</option>
              </select>
            </div>

            {/* Type de bien */}
            <div>
              <label
                htmlFor="hero-type"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5 text-[#1499ab]" />
                Type de bien
              </label>
              <select
                id="hero-type"
                value={propertyType}
                onChange={(e) =>
                  setPropertyType(e.target.value as 'all' | PropertyType)
                }
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#19B8CD] focus:outline-none cursor-pointer"
              >
                <option value="all">Tous les types</option>
                <option value="villa">Villas d’architecte</option>
                <option value="apartment">Appartements & Penthouses</option>
                <option value="office">Bureaux / Espaces Pro</option>
                <option value="land">Terrains</option>
              </select>
            </div>

            {/* Budget Min (FCFA) */}
            <div>
              <label
                htmlFor="hero-min-budget"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Budget min (FCFA)
              </label>
              <input
                id="hero-min-budget"
                type="number"
                placeholder={transaction === 'rent' ? 'Ex: 1 000 000' : 'Ex: 150 000 000'}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#19B8CD] focus:outline-none"
              />
            </div>

            {/* Budget Max (FCFA) */}
            <div>
              <label
                htmlFor="hero-max-budget"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
              >
                Budget max (FCFA)
              </label>
              <input
                id="hero-max-budget"
                type="number"
                placeholder={transaction === 'rent' ? 'Ex: 4 500 000' : 'Ex: 850 000 000'}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:ring-2 focus:ring-[#19B8CD] focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <div>
              <Button
                type="submit"
                variant="cyan"
                size="md"
                fullWidth={true}
                leftIcon={<Search className="w-4 h-4" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Rechercher
              </Button>
            </div>
          </form>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/60 max-w-4xl text-slate-300 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#19B8CD]/15 flex items-center justify-center text-[#19B8CD] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Sécurité Juridique</span>
              <span className="text-slate-400">Titres fonciers vérifiés & conformité notariée</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#19B8CD]/15 flex items-center justify-center text-[#19B8CD] shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Visites Hybrides</span>
              <span className="text-slate-400">Sur place à Dakar ou en visio WhatsApp diaspora</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#19B8CD]/15 flex items-center justify-center text-[#19B8CD] shrink-0">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-white block">Transparence Prix FCFA</span>
              <span className="text-slate-400">Tarifs certifiés sans frais intermédiaires occultes</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
