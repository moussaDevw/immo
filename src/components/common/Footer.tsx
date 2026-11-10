import React, { useState } from 'react'
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import type { DakarNeighborhood, TransactionType } from '../../types'
import { LegalNoticeModal } from './LegalNoticeModal'

const CURRENT_YEAR = new Date().getFullYear()

interface FooterProps {
  onOpenAdvisorModal?: () => void
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdvisorModal }) => {
  const { navigateTo, setFilters } = useApp()

  const [legalModalOpen, setLegalModalOpen] = useState(false)
  const [legalModalType, setLegalModalType] = useState<'legal' | 'privacy' | 'terms'>('legal')

  const handleOpenLegalModal = (type: 'legal' | 'privacy' | 'terms') => {
    setLegalModalType(type)
    setLegalModalOpen(true)
  }

  const handleFilterNeighborhood = (neighborhood: DakarNeighborhood) => {
    setFilters((prev) => ({ ...prev, neighborhood }))
    navigateTo('catalog')
  }

  const handleFilterTransaction = (transaction: TransactionType) => {
    setFilters((prev) => ({ ...prev, transaction }))
    navigateTo('catalog')
  }

  return (
    <footer className="bg-[#0B1730] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand info & Demo disclaimer */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] rounded-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-[#172A46] flex items-center justify-center text-[#19B8CD] shadow-inner">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                  MusaTech
                </span>
                <span className="ml-1 text-xs px-2 py-0.5 rounded-sm bg-[#19B8CD]/20 text-[#19B8CD] font-bold uppercase">
                  Immo
                </span>
              </div>
            </button>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Plateforme immobilière digitale d’excellence pour le Sénégal. Démonstration commerciale conçue par MusaTech pour digitaliser les vitrines d'annonces et la relation acquéreurs des agences de Dakar.
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#19B8CD]">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Démonstration conçue par MusaTech</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Solution technologique sur-mesure développée pour digitaliser les transactions et la relation client des agences immobilières sénégalaises.
              </p>
            </div>
          </div>

          {/* Navigation & Transactions */}
          <div>
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#19B8CD]" />
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => navigateTo('home')}
                  className="hover:text-white hover:translate-x-1 transition-all text-left flex items-center gap-1.5 py-0.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleFilterTransaction('sale')}
                  className="hover:text-white hover:translate-x-1 transition-all text-left flex items-center gap-1.5 py-0.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  Acheter (Biens en vente)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleFilterTransaction('rent')}
                  className="hover:text-white hover:translate-x-1 transition-all text-left flex items-center gap-1.5 py-0.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  Louer (Locations standing)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('catalog')}
                  className="hover:text-white hover:translate-x-1 transition-all text-left flex items-center gap-1.5 py-0.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  Catalogue complet
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-white hover:translate-x-1 transition-all text-left flex items-center gap-1.5 py-0.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-slate-600" />
                  À propos de la plateforme
                </button>
              </li>
            </ul>
          </div>

          {/* Quartiers de Dakar */}
          <div>
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#19B8CD]" />
              Quartiers Dakar
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {(
                [
                  'Almadies',
                  'Ngor',
                  'Mamelles',
                  'Point E',
                  'Mermoz',
                  'Plateau',
                  'Sacré-Cœur',
                ] as DakarNeighborhood[]
              ).map((q) => (
                <li key={q}>
                  <button
                    onClick={() => handleFilterNeighborhood(q)}
                    className="hover:text-white hover:translate-x-1 transition-all text-left flex items-center gap-1.5 py-0.5 cursor-pointer"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    Biens à {q}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Démonstration Fictive */}
          <div>
            <h4 className="font-heading font-bold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-[#19B8CD]" />
              Coordonnées Démo
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#19B8CD] shrink-0 mt-0.5" />
                <span>Zone Ambassades, Almadies, Dakar (Fictif)</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#19B8CD] shrink-0" />
                <span>+221 33 800 00 00 (Numéro démo)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#19B8CD] shrink-0" />
                <span>contact@musatech-demo.sn</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#19B8CD] shrink-0" />
                <span>Lun - Sam : 08h30 - 19h00 GMT</span>
              </p>
              {onOpenAdvisorModal && (
                <div className="pt-2">
                  <button
                    onClick={onOpenAdvisorModal}
                    className="text-xs font-bold text-[#19B8CD] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Demander à être rappelé</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar & Legal Modals */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {CURRENT_YEAR} MusaTech Real Estate • Démonstration commerciale conçue par MusaTech.
          </p>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-slate-400">
            <button
              onClick={() => handleOpenLegalModal('legal')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Mentions Légales (Démo)
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenLegalModal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Protection des données
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenLegalModal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Conditions d'utilisation
            </button>
            <span>•</span>
            <span className="text-[#19B8CD] font-semibold">Dakar, Sénégal</span>
          </div>
        </div>
      </div>

      {/* Global Interactive Legal Notice Modal */}
      <LegalNoticeModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        type={legalModalType}
      />
    </footer>
  )
}
