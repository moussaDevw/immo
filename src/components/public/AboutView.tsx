import React from 'react'
import {
  Building2,
  Sparkles,
  Video,
  Database,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'

interface AboutViewProps {
  onOpenAdvisorModal: () => void
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenAdvisorModal }) => {
  const { navigateTo, openAuthModal } = useApp()

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-20">
      <Container size="lg" className="space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="cyan" dot={true}>
            Démonstration Conçue par MusaTech
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-[#0B1730] tracking-tight">
            La Plateforme Immobilière Digitale de Référence au Sénégal
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            MusaTech Real Estate est une démonstration commerciale conçue pour présenter aux agences immobilières, promoteurs et gestionnaires de patrimoine de Dakar une solution complète de valorisation de biens d'exception et de conversion des prospects.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="cyan"
              size="md"
              leftIcon={<Building2 className="w-4 h-4" />}
              onClick={() => navigateTo('catalog')}
            >
              Explorer les biens
            </Button>
            <Button
              variant="outline"
              size="md"
              leftIcon={<Sparkles className="w-4 h-4 text-[#19B8CD]" />}
              onClick={onOpenAdvisorModal}
            >
              Parler à un conseiller
            </Button>
          </div>
        </div>

        {/* 3 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#0B1730] text-[#19B8CD] flex items-center justify-center">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#0B1730]">
              Parcours Acquéreur & Diaspora
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Expérience sur-mesure combinant visites en présentiel à Dakar et visites virtuelles en direct via WhatsApp pour les acquéreurs de la diaspora (Europe, Amérique, sous-région).
            </p>
            <ul className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#19B8CD]" />
                Réservation de créneaux en temps réel
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#19B8CD]" />
                Confirmation instantanée du rendez-vous
              </li>
            </ul>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#0B1730] text-[#19B8CD] flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#0B1730]">
              Cartographie des Quartiers de Dakar
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Segmentation fine des micromarchés de la capitale sénégalaise : Almadies, Mermoz, Ngor, Plateau, Point E, Sacré-Cœur et Mamelles, avec prix au m² et commodités certifiées.
            </p>
            <ul className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#19B8CD]" />
                Filtres multicritères instantanés
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#19B8CD]" />
                Titre foncier et statut juridique explicite
              </li>
            </ul>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-[#0B1730] text-[#19B8CD] flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-extrabold text-lg text-[#0B1730]">
              Cockpit Gestionnaire Intégré
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Espace d'administration complet permettant à l'agence de suivre les leads qualifiés, d'éditer les annonces, de qualifier les statuts de visite et d'annoter les dossiers.
            </p>
            <ul className="space-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#19B8CD]" />
                Pipeline des demandes (Nouvelle, Planifiée...)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#19B8CD]" />
                Persistance locale offline-first
              </li>
            </ul>
          </div>
        </div>

        {/* Commercial Pitch Banner */}
        <div className="bg-[#0B1730] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden border border-slate-800 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#19B8CD]/20 text-[#19B8CD] border border-[#19B8CD]/30">
              <Database className="w-3.5 h-3.5" />
              Architecture Moderne & Évolutive
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
              Vous représentez une agence immobilière ou un promoteur à Dakar ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              MusaTech déploie cette application en marque blanche, personnalisée selon votre charte graphique, interconnectée à votre base de données et sécurisée selon les plus hauts standards.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button
                variant="cyan"
                size="md"
                leftIcon={<Sparkles className="w-4 h-4" />}
                onClick={openAuthModal}
              >
                Accéder au cockpit gestionnaire
              </Button>
              <Button
                variant="outline"
                size="md"
                className="text-white border-slate-700 bg-slate-800 hover:bg-slate-700"
                onClick={onOpenAdvisorModal}
              >
                Programmer une présentation
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
