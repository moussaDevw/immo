import React from 'react'
import { Sparkles, ShieldAlert, RotateCcw, LayoutDashboard, Eye } from 'lucide-react'
import { useApp } from '../../context/useApp'

export const DemoBanner: React.FC = () => {
  const { activeView, navigateTo, resetDemoData, isAdminAuthenticated, openAuthModal } = useApp()

  const isAdminView = activeView.startsWith('admin')

  return (
    <div className="bg-[#0B1730] text-slate-200 text-xs sm:text-sm border-b border-slate-700/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Branding notice */}
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-[#19B8CD]/20 text-[#19B8CD] border border-[#19B8CD]/40">
            <Sparkles className="w-3 h-3 animate-pulse" />
            Démonstration conçue par MusaTech
          </span>
          <span className="text-slate-300 hidden md:inline">
            Plateforme de vente, location et gestion des visites pour agences au Sénégal (Dakar)
          </span>
          <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            Données fictives
          </span>
        </div>

        {/* Right: Quick actions for the prospect/evaluator */}
        <div className="flex items-center gap-2">
          {isAdminView ? (
            <button
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-600 focus:outline-none focus:ring-2 focus:ring-[#19B8CD]"
            >
              <Eye className="w-3.5 h-3.5 text-[#19B8CD]" />
              Retour au site public
            </button>
          ) : (
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  navigateTo('admin-dashboard')
                } else {
                  openAuthModal()
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#19B8CD] hover:bg-[#1499ab] text-slate-950 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-white shadow-sm"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Tester l’espace gestionnaire
            </button>
          )}

          <button
            onClick={() => {
              if (window.confirm('Voulez-vous réinitialiser toutes les données de démonstration (biens et demandes) à leurs valeurs d’origine ?')) {
                resetDemoData()
              }
            }}
            title="Restaurer les données initiales"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#19B8CD]"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Réinitialiser démo</span>
          </button>
        </div>
      </div>
    </div>
  )
}
