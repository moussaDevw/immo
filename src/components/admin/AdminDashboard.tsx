import React from 'react'
import {
  Building2,
  CalendarCheck,
  Clock,
  Plus,
  ArrowRight,
  MapPin,
  Sparkles,
  FileEdit,
  Eye,
  CheckCircle2,
  AlertCircle,
  Inbox,
  FolderOpen,
  Compass,
  RotateCcw,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import { formatCFA, formatDateFR } from '../../services/storageService'
import type { Property, VisitRequest } from '../../types'
import { TRANSACTION_LABELS } from '../../types'
import { Button } from '../ui/Button'
import { VisitStatusBadge, PropertyStatusBadge } from '../ui/StatusBadge'

interface AdminDashboardProps {
  onAddNewProperty: () => void
  onInspectRequest: (request: VisitRequest) => void
  onEditProperty?: (property: Property) => void
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onAddNewProperty,
  onInspectRequest,
  onEditProperty,
}) => {
  const { properties, requests, navigateTo } = useApp()

  // ─── 6 Official Required Indicators (Computed from real data) ───
  const totalProperties = properties.length
  const publishedProperties = properties.filter((p) => p.status === 'published').length
  const draftProperties = properties.filter((p) => p.status === 'draft').length
  const archivedProperties = properties.filter((p) => p.status === 'archived').length

  const totalRequests = requests.length
  const newRequests = requests.filter((r) => r.status === 'new').length
  const toContactRequests = requests.filter((r) => r.status === 'to_contact').length
  const toProcessRequests = newRequests + toContactRequests
  const scheduledRequests = requests.filter((r) => r.status === 'scheduled').length
  const completedRequests = requests.filter((r) => r.status === 'completed').length
  const cancelledRequests = requests.filter((r) => r.status === 'cancelled').length

  // Supplementary business breakdown
  const saleProperties = properties.filter((p) => p.transactionType === 'sale')
  const rentalProperties = properties.filter((p) => p.transactionType === 'rent')
  const totalSaleValue = saleProperties.reduce((acc, p) => acc + p.price, 0)
  const totalRentalMonthlyValue = rentalProperties.reduce((acc, p) => acc + p.price, 0)

  // Neighborhood breakdown
  const neighborhoodCounts: Record<string, number> = {}
  properties.forEach((p) => {
    neighborhoodCounts[p.neighborhood] = (neighborhoodCounts[p.neighborhood] || 0) + 1
  })

  // Recent visit requests (sorted by createdAt desc, latest 5)
  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // Recently added properties (sorted by createdAt desc, latest 4)
  const recentProperties = [...properties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  return (
    <div className="space-y-8">
      {/* ─── Welcome & Quick Actions Hero ─── */}
      <div className="bg-[#0B1730] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#19B8CD]/20 text-[#19B8CD] border border-[#19B8CD]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MusaTech Real Estate • Cockpit Agence</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Mode démonstration
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight">
            Vue d’ensemble de votre portefeuille & prospects
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Pilotez l’activité de votre agence à Dakar : consultez les métriques réelles, qualifiez les nouvelles demandes de visite et gérez le cycle de vie de vos annonces.
          </p>

          {/* Quick Action Links Bar */}
          <div className="pt-3 flex flex-wrap gap-2.5">
            <Button
              variant="cyan"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={onAddNewProperty}
            >
              Publier un nouveau bien
            </Button>
            <Button
              variant="outline-dark"
              size="md"
              leftIcon={<CalendarCheck className="w-4 h-4 text-[#19B8CD]" />}
              onClick={() => navigateTo('admin-requests')}
            >
              Traiter les demandes ({toProcessRequests})
            </Button>
            <Button
              variant="outline-dark"
              size="md"
              leftIcon={<Building2 className="w-4 h-4 text-slate-300" />}
              onClick={() => navigateTo('admin-properties')}
            >
              Gérer le catalogue ({totalProperties})
            </Button>
            <Button
              variant="outline-dark"
              size="md"
              leftIcon={<Eye className="w-4 h-4 text-emerald-400" />}
              onClick={() => navigateTo('home')}
            >
              Voir la vitrine publique
            </Button>
          </div>
        </div>
      </div>

      {/* ─── 6 Required Key Performance Indicators (Real Data) ─── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#0B1730]">
              Indicateurs Clés de l’Agence
            </h3>
            <p className="text-xs text-slate-500">
              Données calculées en temps réel depuis le portefeuille et le pipeline client
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {totalProperties} biens • {totalRequests} demandes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* KPI 1: Total des biens */}
          <div
            onClick={() => navigateTo('admin-properties')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-[#19B8CD] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total des Biens
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#0B1730]">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-heading font-extrabold text-[#0B1730]">
                {totalProperties}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {saleProperties.length} vente • {rentalProperties.length} loc.
              </p>
            </div>
            <span className="text-[11px] font-bold text-[#1499ab] flex items-center gap-1">
              <span>Voir inventaire</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* KPI 2: Biens publiés */}
          <div
            onClick={() => navigateTo('admin-properties')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Biens Publiés
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-heading font-extrabold text-emerald-600">
                {publishedProperties}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Visibles sur le catalogue
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <span>En ligne public</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* KPI 3: Brouillons */}
          <div
            onClick={() => navigateTo('admin-properties')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Brouillons
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <FileEdit className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-heading font-extrabold text-slate-700">
                {draftProperties}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {archivedProperties} archivé{archivedProperties > 1 ? 's' : ''}
              </p>
            </div>
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
              <span>Éditer annonces</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* KPI 4: Demandes reçues */}
          <div
            onClick={() => navigateTo('admin-requests')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Demandes Reçues
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                <Inbox className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-heading font-extrabold text-[#0B1730]">
                {totalRequests}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Total formulaires reçus
              </p>
            </div>
            <span className="text-[11px] font-bold text-sky-700 flex items-center gap-1">
              <span>Voir pipeline</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* KPI 5: Demandes nouvelles */}
          <div
            onClick={() => navigateTo('admin-requests')}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Nouvelles
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-heading font-extrabold text-emerald-600">
                {newRequests}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Arrivées récemment
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
              <span>À qualifier</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* KPI 6: Demandes à traiter */}
          <div
            onClick={() => navigateTo('admin-requests')}
            className="bg-white p-4 rounded-2xl border border-amber-300 shadow-xs hover:border-amber-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between bg-amber-50/20"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                À Traiter
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-heading font-extrabold text-amber-600">
                {toProcessRequests}
              </div>
              <p className="text-[11px] text-amber-700/80 mt-0.5">
                {newRequests} new • {toContactRequests} à contacter
              </p>
            </div>
            <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
              <span>Priorité d’action</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* ─── Status Distribution Section (Real percentages) ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Breakdown 1: Statuts du Portefeuille Immobilier */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-sm text-[#0B1730] flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#19B8CD]" />
              Répartition des Biens par Statut
            </h4>
            <span className="text-xs font-semibold text-slate-400">
              {totalProperties} au total
            </span>
          </div>

          <div className="space-y-3">
            {/* Publiés */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Publiés (en ligne)</span>
                <span className="font-bold text-slate-900">
                  {publishedProperties} ({totalProperties > 0 ? Math.round((publishedProperties / totalProperties) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${totalProperties > 0 ? (publishedProperties / totalProperties) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Brouillons */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Brouillons (hors ligne)</span>
                <span className="font-bold text-slate-900">
                  {draftProperties} ({totalProperties > 0 ? Math.round((draftProperties / totalProperties) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${totalProperties > 0 ? (draftProperties / totalProperties) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Archivés */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700">Archivés (vendus / retirés)</span>
                <span className="font-bold text-slate-900">
                  {archivedProperties} ({totalProperties > 0 ? Math.round((archivedProperties / totalProperties) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-slate-400 h-full rounded-full transition-all"
                  style={{ width: `${totalProperties > 0 ? (archivedProperties / totalProperties) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown 2: Statuts des Demandes de Visite */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-sm text-[#0B1730] flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-[#19B8CD]" />
              Répartition des Demandes par Statut
            </h4>
            <span className="text-xs font-semibold text-slate-400">
              {totalRequests} au total
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="block text-lg font-heading font-extrabold text-emerald-700">
                {newRequests}
              </span>
              <span className="text-[10px] font-semibold text-emerald-800 uppercase">
                Nouvelles
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100">
              <span className="block text-lg font-heading font-extrabold text-amber-700">
                {toContactRequests}
              </span>
              <span className="text-[10px] font-semibold text-amber-800 uppercase">
                À contacter
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-100">
              <span className="block text-lg font-heading font-extrabold text-sky-700">
                {scheduledRequests}
              </span>
              <span className="text-[10px] font-semibold text-sky-800 uppercase">
                Planifiées
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
              <span className="block text-lg font-heading font-extrabold text-indigo-700">
                {completedRequests}
              </span>
              <span className="text-[10px] font-semibold text-indigo-800 uppercase">
                Réalisées
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 col-span-2 sm:col-span-1">
              <span className="block text-lg font-heading font-extrabold text-slate-700">
                {cancelledRequests}
              </span>
              <span className="text-[10px] font-semibold text-slate-600 uppercase">
                Annulées
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Valeur estimée ventes : <strong className="text-slate-800">{formatCFA(totalSaleValue)}</strong></span>
            <span>Loyers : <strong className="text-slate-800">{formatCFA(totalRentalMonthlyValue)}/m</strong></span>
          </div>
        </div>
      </div>

      {/* ─── Main Content Grid: Demandes Récentes & Biens Récents ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── Left Column: Dernières Demandes Reçues ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-[#0B1730]">
                Dernières demandes reçues
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Prospects ayant demandé une visite via le site public
              </p>
            </div>
            <button
              onClick={() => navigateTo('admin-requests')}
              className="text-xs font-bold text-[#1499ab] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Voir tout ({totalRequests})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentRequests.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  Aucune demande de visite enregistrée.
                </p>
                <p className="text-[11px] text-slate-400">
                  Les demandes envoyées depuis les fiches de biens apparaîtront ici.
                </p>
              </div>
            ) : (
              recentRequests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => onInspectRequest(req)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {req.propertyImage ? (
                      <img
                        src={req.propertyImage}
                        alt={req.propertyTitle || 'Propriété'}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 text-slate-400">
                        <Building2 className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {req.fullName}
                        </span>
                        <VisitStatusBadge status={req.status} />
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {req.propertyTitle || 'Bien immobilier'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatDateFR(req.createdAt)} • {req.visitType === 'video' ? 'Visio WhatsApp' : 'Présentiel'}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 flex items-center gap-2 self-end sm:self-auto">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">
                        Créneau
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        {req.preferredDate} ({req.preferredTime})
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onInspectRequest(req)
                      }}
                      className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-[#0B1730] hover:text-white text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      Traiter
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => navigateTo('admin-requests')}
              className="text-xs font-semibold text-slate-600 hover:text-[#0B1730] transition-colors cursor-pointer"
            >
              Accéder au module complet des demandes & prospects →
            </button>
          </div>
        </div>

        {/* ── Right Column: Biens Récemment Ajoutés ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-[#0B1730]">
                Biens récemment ajoutés
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dernières références enregistrées dans le portefeuille
              </p>
            </div>
            <button
              onClick={() => navigateTo('admin-properties')}
              className="text-xs font-bold text-[#1499ab] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Gérer tout ({totalProperties})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentProperties.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">
                  Aucun bien dans le portefeuille.
                </p>
                <Button
                  size="sm"
                  variant="cyan"
                  onClick={onAddNewProperty}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="mt-2"
                >
                  Ajouter un bien
                </Button>
              </div>
            ) : (
              recentProperties.map((prop) => (
                <div
                  key={prop.id}
                  className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prop.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'}
                      alt={prop.title}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {prop.title}
                        </span>
                        <PropertyStatusBadge status={prop.status} />
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {prop.reference} • {prop.neighborhood} • {TRANSACTION_LABELS[prop.transactionType]}
                      </p>
                      <p className="text-[11px] font-bold text-[#0B1730]">
                        {formatCFA(prop.price)} {prop.transactionType === 'rent' ? '/mois' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 flex items-center gap-2 self-end sm:self-auto">
                    {onEditProperty && (
                      <button
                        onClick={() => onEditProperty(prop)}
                        className="py-1 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                        title="Modifier cette annonce"
                      >
                        Modifier
                      </button>
                    )}
                    <button
                      onClick={() => navigateTo('property-detail', prop.id)}
                      className="py-1 px-2.5 rounded-lg bg-slate-100 hover:bg-[#0B1730] hover:text-white text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      title="Consulter la fiche"
                    >
                      Voir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={onAddNewProperty}
              className="text-xs font-semibold text-[#1499ab] hover:underline transition-colors cursor-pointer flex items-center justify-center gap-1 mx-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter une nouvelle annonce au catalogue</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── Neighborhood Presence & Demonstration Tools ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Neighborhood density */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-heading font-bold text-sm text-[#0B1730] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#19B8CD]" />
              Densité du Portefeuille par Quartier (Dakar)
            </h4>
            <span className="text-xs text-slate-400">7 quartiers couverts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {Object.entries(neighborhoodCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([neighborhood, count]) => {
                const percentage = totalProperties > 0 ? Math.round((count / totalProperties) * 100) : 0
                return (
                  <div key={neighborhood} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{neighborhood}</span>
                      <span className="text-slate-500 font-medium">
                        {count} bien{count > 1 ? 's' : ''} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#19B8CD] h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>

        {/* Demo Fast Shortcuts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="font-heading font-bold text-sm text-[#0B1730] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#19B8CD]" />
              Raccourcis Démonstration
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Accès directs pour la présentation commerciale
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => navigateTo('catalog')}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Tester le catalogue avec filtres</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => navigateTo('admin-settings')}
              className="w-full p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-[#19B8CD]" />
                <span>Restaurer les données de test</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 text-[11px] text-slate-600 border border-slate-100">
            <span className="font-bold text-[#0B1730] block">
              MusaTech Real Estate PRO
            </span>
            Plateforme de démonstration pour les agences et promoteurs immobiliers du Sénégal.
          </div>
        </div>
      </div>
    </div>
  )
}
