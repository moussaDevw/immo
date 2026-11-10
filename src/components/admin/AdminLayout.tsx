import React, { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Settings,
  Eye,
  LogOut,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import type { ActiveView } from '../../types'

interface AdminLayoutProps {
  children: React.ReactNode
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const {
    activeView,
    navigateTo,
    adminUser,
    logoutAdmin,
    requests,
    properties,
  } = useApp()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [prevView, setPrevView] = useState(activeView)

  // Adjust state during render when activeView changes (React recommended pattern)
  if (prevView !== activeView) {
    setPrevView(activeView)
    setIsMobileMenuOpen(false)
  }

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const pendingRequestsCount = requests.filter(
    (r) => r.status === 'new' || r.status === 'to_contact'
  ).length

  const navItems: {
    id: ActiveView
    label: string
    shortLabel: string
    icon: React.ReactNode
    badge?: number
    badgeColor?: string
  }[] = [
    {
      id: 'admin-dashboard',
      label: 'Vue d’ensemble',
      shortLabel: 'Vue d’ensemble',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'admin-properties',
      label: 'Biens immobiliers',
      shortLabel: 'Biens',
      icon: <Building2 className="w-4 h-4" />,
      badge: properties.length,
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'admin-requests',
      label: 'Demandes de visite',
      shortLabel: 'Demandes',
      icon: <CalendarCheck className="w-4 h-4" />,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
      badgeColor: 'bg-amber-500 text-slate-950 font-bold',
    },
    {
      id: 'admin-settings',
      label: 'Paramètres démo',
      shortLabel: 'Paramètres',
      icon: <Settings className="w-4 h-4" />,
    },
  ]

  const getPageTitle = () => {
    switch (activeView) {
      case 'admin-dashboard':
        return 'Vue d’ensemble de l’Agence'
      case 'admin-properties':
        return 'Gestion du Portefeuille Immobilier'
      case 'admin-requests':
        return 'Traitement des Demandes & Prospects'
      case 'admin-settings':
        return 'Paramètres de la Démonstration'
      default:
        return 'Espace d’Administration'
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* ─── Mobile Sticky Top Header ─── */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0B1730] text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            aria-label="Ouvrir le menu d'administration"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold text-base text-white">
              MusaTech
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#19B8CD]/20 text-[#19B8CD] font-bold">
              PRO
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>Mode démonstration</span>
          </span>
          <img
            src={adminUser.avatar}
            alt={adminUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
        </div>
      </header>

      {/* ─── Mobile Slide-out Drawer ─── */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation d'administration mobile"
          className="fixed inset-0 z-50 md:hidden bg-slate-950/70 backdrop-blur-xs flex"
        >
          {/* Backdrop click area */}
          <div
            className="flex-1"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div className="w-72 max-w-[85vw] bg-[#0B1730] text-slate-300 h-full flex flex-col justify-between shadow-2xl border-l border-slate-800 animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#172A46] flex items-center justify-center text-[#19B8CD]">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-heading font-extrabold text-base text-white">
                      MusaTech
                    </span>
                    <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-[#19B8CD]/20 text-[#19B8CD] font-bold">
                      PRO
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Fermer le menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mode démonstration pill */}
              <div className="p-3">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-amber-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <strong className="block text-white font-semibold">Mode démonstration</strong>
                    <span className="text-slate-400 text-[10px]">Session locale MusaTech</span>
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <nav className="px-3 space-y-1">
                {navItems.map((item) => {
                  const isActive = activeView === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigateTo(item.id)
                        setIsMobileMenuOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#19B8CD] text-slate-950 font-bold shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-slate-950 text-white'
                              : item.badgeColor || 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Mobile Drawer Bottom User & Actions */}
            <div className="p-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={adminUser.avatar}
                  alt={adminUser.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">
                    {adminUser.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {adminUser.role}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    navigateTo('home')
                    setIsMobileMenuOpen(false)
                  }}
                  className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#19B8CD]" />
                  <span>Site public</span>
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    logoutAdmin()
                  }}
                  className="py-2 px-2.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-rose-900/60 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Quitter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Desktop Sidebar (Hidden on mobile) ─── */}
      <aside className="hidden md:flex w-64 bg-[#0B1730] text-slate-300 shrink-0 flex-col justify-between border-r border-slate-800 min-h-screen sticky top-0 h-screen overflow-y-auto">
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#172A46] flex items-center justify-center text-[#19B8CD] shadow-inner">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-lg text-white">
                  MusaTech
                </span>
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-[#19B8CD]/20 text-[#19B8CD] font-bold">
                  PRO
                </span>
                <p className="text-[10px] text-slate-400">Cockpit Gestionnaire</p>
              </div>
            </div>

            <div className="mt-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-amber-300 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <strong className="block text-white font-semibold leading-tight">
                  Mode démonstration
                </strong>
                <span className="text-[10px] text-slate-400">Données locales actives</span>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeView === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#19B8CD] text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-slate-950 text-white'
                          : item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Desktop Sidebar Bottom Profile & Exit */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={adminUser.avatar}
              alt={adminUser.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-700"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                {adminUser.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {adminUser.role}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => navigateTo('home')}
              className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              title="Consulter le site public"
            >
              <Eye className="w-3.5 h-3.5 text-[#19B8CD]" />
              <span>Site public</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="py-2 px-2.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
              title="Déconnexion"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Quitter</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Area ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-xl text-[#0B1730]">
                {getPageTitle()}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <ShieldAlert className="w-3 h-3 text-amber-600" />
                Mode démonstration
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Agence MusaTech Real Estate • Dakar, Sénégal
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => navigateTo('home')}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#1499ab]" />
              <span>Voir le site public</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold text-slate-600 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Se déconnecter"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
