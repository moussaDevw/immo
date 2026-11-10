import React, { useState, useEffect } from 'react'
import {
  Building2,
  Heart,
  Menu,
  X,
  PhoneCall,
  LayoutDashboard,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import type { TransactionType } from '../../types'
import { Button } from '../ui/Button'

interface NavbarProps {
  onOpenAdvisorModal: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdvisorModal }) => {
  const {
    activeView,
    navigateTo,
    filters,
    setFilters,
    favorites,
    isAdminAuthenticated,
    openAuthModal,
  } = useApp()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  const handleNavToHome = () => {
    navigateTo('home')
    setMobileMenuOpen(false)
  }

  const handleNavToTransaction = (transaction: TransactionType) => {
    setFilters((prev) => ({ ...prev, transaction }))
    navigateTo('catalog')
    setMobileMenuOpen(false)
  }

  const handleNavToAbout = () => {
    navigateTo('about')
    setMobileMenuOpen(false)
  }

  const handleNavToFavorites = () => {
    navigateTo('favorites')
    setMobileMenuOpen(false)
  }

  const isSaleActive = activeView === 'catalog' && filters.transaction === 'sale'
  const isRentActive = activeView === 'catalog' && filters.transaction === 'rent'
  const isAboutActive = activeView === 'about'
  const isFavoritesActive = activeView === 'favorites'
  const isHomeActive = activeView === 'home'

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo typographique & identité de marque */}
          <button
            onClick={handleNavToHome}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] rounded-xl p-1 cursor-pointer"
            aria-label="Accueil MusaTech Real Estate"
          >
            <div className="w-11 h-11 rounded-xl bg-[#0B1730] flex items-center justify-center text-white shadow-md group-hover:bg-[#172A46] transition-colors relative overflow-hidden">
              <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#19B8CD]/30 rounded-full blur-xs" />
              <Building2 className="w-6 h-6 text-[#19B8CD]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#0B1730]">
                  MusaTech
                </span>
                <span className="font-heading font-bold text-xs px-1.5 py-0.5 rounded-sm bg-[#19B8CD]/15 text-[#0f8291] uppercase tracking-wider">
                  Immo
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 uppercase tracking-widest -mt-0.5">
                Prestige Sénégal • Dakar
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links (avec indication visuelle de la page active) */}
          <nav aria-label="Navigation principale" className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={handleNavToHome}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isHomeActive
                  ? 'text-[#0B1730] bg-slate-100 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#0B1730] hover:bg-slate-50'
                }`}
            >
              Accueil
            </button>

            <button
              onClick={() => handleNavToTransaction('sale')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isSaleActive
                  ? 'text-[#0B1730] bg-slate-100 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#0B1730] hover:bg-slate-50'
                }`}
            >
              Acheter
            </button>

            <button
              onClick={() => handleNavToTransaction('rent')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isRentActive
                  ? 'text-[#0B1730] bg-slate-100 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#0B1730] hover:bg-slate-50'
                }`}
            >
              Louer
            </button>

            <button
              onClick={handleNavToAbout}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isAboutActive
                  ? 'text-[#0B1730] bg-slate-100 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-[#0B1730] hover:bg-slate-50'
                }`}
            >
              À propos
            </button>

            {/* Accès rapide favoris */}
            <button
              onClick={handleNavToFavorites}
              title={`${favorites.length} bien(s) en favoris`}
              aria-label={`Accéder à mes favoris (${favorites.length} bien(s) enregistré(s))`}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                isFavoritesActive
                  ? 'bg-rose-50 text-rose-700 font-bold border border-rose-200'
                  : 'text-slate-600 hover:text-[#0B1730] hover:bg-slate-50'
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  favorites.length > 0
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-slate-400'
                }`}
              />
              <span className="hidden lg:inline text-xs font-semibold">Favoris</span>
              {favorites.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </button>
          </nav>

          {/* Right Header CTAs : CTA Principal & Espace Agence Démo */}
          <div className="hidden lg:flex items-center gap-3">
            {/* CTA Principal : Parler à un conseiller */}
            <Button
              variant="outline"
              size="sm"
              leftIcon={<PhoneCall className="w-3.5 h-3.5 text-[#19B8CD]" />}
              onClick={onOpenAdvisorModal}
              aria-label="Contacter un conseiller"
              className="border-slate-300 text-slate-800 hover:border-[#19B8CD] hover:text-[#0B1730]"
            >
              Parler à un conseiller
            </Button>

            {/* Accès discret cockpit gestionnaire agence */}
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  navigateTo('admin-dashboard')
                } else {
                  openAuthModal()
                }
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-heading font-bold text-xs uppercase tracking-wider text-white bg-[#0B1730] hover:bg-[#172A46] active:scale-98 transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] cursor-pointer"
              title="Accéder au tableau de bord agence de démonstration"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#19B8CD]" />
              <span>Espace Agence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#19B8CD]" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Accès direct favoris mobile */}
            <button
              onClick={handleNavToFavorites}
              className={`relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] cursor-pointer ${
                isFavoritesActive ? 'bg-rose-50 text-rose-600' : ''
              }`}
              aria-label={`Mes favoris (${favorites.length})`}
            >
              <Heart
                className={`w-5 h-5 ${
                  favorites.length > 0
                    ? 'fill-rose-500 text-rose-500'
                    : 'text-slate-500'
                }`}
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  navigateTo('admin-dashboard')
                } else {
                  openAuthModal()
                }
              }}
              className="p-2 rounded-xl bg-[#0B1730] text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] cursor-pointer"
              aria-label="Accéder à l'espace agence"
            >
              <LayoutDashboard className="w-4 h-4 text-[#19B8CD]" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] cursor-pointer"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={mobileMenuOpen ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          role="region"
          aria-label="Menu de navigation mobile"
          className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2"
        >
          <div className="px-4 py-1 text-xs font-heading font-bold text-slate-400 uppercase tracking-wider">
            Navigation
          </div>
          <button
            onClick={handleNavToHome}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${isHomeActive ? 'bg-slate-100 text-[#0B1730] font-bold' : 'text-slate-800 hover:bg-slate-50'
              }`}
          >
            <span>Accueil</span>
          </button>

          <button
            onClick={() => handleNavToTransaction('sale')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${isSaleActive ? 'bg-slate-100 text-[#0B1730] font-bold' : 'text-slate-800 hover:bg-slate-50'
              }`}
          >
            <span>Acheter (Biens en vente)</span>
          </button>

          <button
            onClick={() => handleNavToTransaction('rent')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${isRentActive ? 'bg-slate-100 text-[#0B1730] font-bold' : 'text-slate-800 hover:bg-slate-50'
              }`}
          >
            <span>Louer (Locations de prestige)</span>
          </button>

          <button
            onClick={handleNavToAbout}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${isAboutActive ? 'bg-slate-100 text-[#0B1730] font-bold' : 'text-slate-800 hover:bg-slate-50'
              }`}
          >
            <span>À propos de la plateforme</span>
          </button>

          <button
            onClick={handleNavToFavorites}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${
              isFavoritesActive ? 'bg-rose-50 text-rose-700 font-bold' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Heart
                className={`w-4 h-4 ${
                  favorites.length > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                }`}
              />
              <span>Mes Favoris</span>
            </div>
            {favorites.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                {favorites.length}
              </span>
            )}
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
            {/* CTA Parler à un conseiller */}
            <Button
              variant="cyan"
              size="md"
              fullWidth={true}
              leftIcon={<PhoneCall className="w-4 h-4" />}
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenAdvisorModal()
              }}
            >
              Parler à un conseiller
            </Button>

            {/* Espace Agence */}
            <Button
              variant="primary"
              size="md"
              fullWidth={true}
              leftIcon={<LayoutDashboard className="w-4 h-4 text-[#19B8CD]" />}
              onClick={() => {
                setMobileMenuOpen(false)
                if (isAdminAuthenticated) {
                  navigateTo('admin-dashboard')
                } else {
                  openAuthModal()
                }
              }}
            >
              Espace Gestionnaire Agence (Démo)
            </Button>

            <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#19B8CD]" />
              <span>Démonstration conçue par MusaTech</span>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
