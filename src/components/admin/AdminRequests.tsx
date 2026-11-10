import React, { useState, useMemo } from 'react'
import {
  CalendarCheck,
  Search,
  MessageCircle,
  Clock,
  Mail,
  Phone,
  FileText,
  RotateCcw,
  Archive,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import { formatDateFR } from '../../services/storageService'
import type { VisitRequest, VisitRequestStatus } from '../../types'
import { VISIT_STATUS_LABELS } from '../../types'
import { VisitStatusBadge } from '../ui/StatusBadge'

interface AdminRequestsProps {
  onInspectRequest: (request: VisitRequest) => void
}

type PeriodFilter = 'all' | '7d' | '30d' | 'this_month'

export const AdminRequests: React.FC<AdminRequestsProps> = ({
  onInspectRequest,
}) => {
  const { requests, properties, updateRequestStatus } = useApp()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | VisitRequestStatus>('all')
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('all')

  const [referenceDate] = useState(() => {
    const d = new Date()
    return {
      timestamp: d.getTime(),
      year: d.getFullYear(),
      month: d.getMonth(),
    }
  })

  // Real-time status counts
  const newCount = requests.filter((r) => r.status === 'new').length
  const toContactCount = requests.filter((r) => r.status === 'to_contact').length
  const scheduledCount = requests.filter((r) => r.status === 'scheduled').length
  const completedCount = requests.filter((r) => r.status === 'completed').length
  const cancelledCount = requests.filter((r) => r.status === 'cancelled').length

  const hasActiveFilters =
    search.trim() !== '' || statusFilter !== 'all' || periodFilter !== 'all'

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setPeriodFilter('all')
  }

  // Filter logic: search, status, and period
  const filtered = useMemo(() => {
    const now = referenceDate.timestamp
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

    return requests.filter((r) => {
      // 1. Search filter: name, phone, email, or property reference/title
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const matchName = r.fullName.toLowerCase().includes(q)
        const matchEmail = r.email.toLowerCase().includes(q)
        const matchPhone = r.phone.toLowerCase().includes(q)
        const matchRef = (r.propertyReference || '').toLowerCase().includes(q)
        const matchProp = (r.propertyTitle || '').toLowerCase().includes(q)
        if (!matchName && !matchEmail && !matchPhone && !matchRef && !matchProp) {
          return false
        }
      }

      // 2. Status filter
      if (statusFilter !== 'all' && r.status !== statusFilter) {
        return false
      }

      // 3. Period filter
      if (periodFilter !== 'all') {
        const reqDate = new Date(r.createdAt)
        const reqTime = reqDate.getTime()

        if (periodFilter === '7d' && now - reqTime > sevenDaysMs) {
          return false
        }
        if (periodFilter === '30d' && now - reqTime > thirtyDaysMs) {
          return false
        }
        if (
          periodFilter === 'this_month' &&
          (reqDate.getFullYear() !== referenceDate.year || reqDate.getMonth() !== referenceDate.month)
        ) {
          return false
        }
      }

      return true
    })
  }, [requests, search, statusFilter, periodFilter, referenceDate])

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    req: VisitRequest
  ) => {
    e.stopPropagation()
    updateRequestStatus(req.id, e.target.value as VisitRequestStatus)
  }

  return (
    <div className="space-y-6">
      {/* ── Action Header ── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-extrabold text-xl text-[#0B1730]">
              Gestion des Demandes de Visite ({requests.length} dossiers)
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
              Pipeline actif
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Traitez les prospects ayant manifesté leur intérêt pour un bien à Dakar, qualifiez leurs critères et planifiez les visites.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {newCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              {newCount} nouvelle{newCount > 1 ? 's' : ''} à qualifier
            </span>
          )}
          {toContactCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              {toContactCount} à contacter
            </span>
          )}
        </div>
      </div>

      {/* ── Filter Tabs, Period & Search ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-[#0B1730] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toutes ({requests.length})
            </button>
            <button
              onClick={() => setStatusFilter('new')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'new'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {VISIT_STATUS_LABELS.new} ({newCount})
            </button>
            <button
              onClick={() => setStatusFilter('to_contact')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'to_contact'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {VISIT_STATUS_LABELS.to_contact} ({toContactCount})
            </button>
            <button
              onClick={() => setStatusFilter('scheduled')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'scheduled'
                  ? 'bg-white text-sky-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {VISIT_STATUS_LABELS.scheduled} ({scheduledCount})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-white text-indigo-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {VISIT_STATUS_LABELS.completed} ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'cancelled'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {VISIT_STATUS_LABELS.cancelled} ({cancelledCount})
            </button>
          </div>

          {/* Period Filter & Search */}
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <select
              aria-label="Filtrer par période"
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value as PeriodFilter)}
              className="w-full sm:w-44 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#19B8CD] outline-none cursor-pointer"
            >
              <option value="all">Toutes les dates</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="this_month">Ce mois-ci</option>
            </select>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Nom, tél ou référence..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#19B8CD] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Counter and Filter Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Affichage de <strong>{filtered.length}</strong> demande{filtered.length > 1 ? 's' : ''} sur{' '}
            <strong>{requests.length}</strong>
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#1499ab] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser les filtres</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Desktop Requests Table (8 Required Columns) ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">1. Nom</th>
                <th className="py-3.5 px-4">2. Téléphone</th>
                <th className="py-3.5 px-4">3. E-mail</th>
                <th className="py-3.5 px-4">4. Bien demandé</th>
                <th className="py-3.5 px-4">5. Date réception</th>
                <th className="py-3.5 px-4">6. Créneau souhaité</th>
                <th className="py-3.5 px-4">7. Statut</th>
                <th className="py-3.5 px-4 text-right">8. Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <CalendarCheck className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700">Aucune demande trouvée.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Modifiez les critères ou le statut sélectionné.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((req) => {
                  const targetProp = properties.find((p) => p.id === req.propertyId)
                  const isPropArchived = targetProp?.status === 'archived'

                  return (
                    <tr
                      key={req.id}
                      onClick={() => onInspectRequest(req)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      {/* 1. Nom */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block text-xs sm:text-sm">
                          {req.fullName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {req.id}
                        </span>
                      </td>

                      {/* 2. Téléphone (clickable tel: + WhatsApp) */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${req.phone}`}
                            className="font-bold text-slate-800 hover:text-[#1499ab] flex items-center gap-1"
                            title="Appeler ce numéro"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{req.phone}</span>
                          </a>
                          <a
                            href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            title="Ouvrir WhatsApp"
                            className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>

                      {/* 3. E-mail (clickable mailto:) */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={`mailto:${req.email}`}
                          className="font-medium text-slate-600 hover:text-[#1499ab] flex items-center gap-1 truncate max-w-[160px]"
                          title={req.email}
                        >
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{req.email}</span>
                        </a>
                      </td>

                      {/* 4. Bien demandé (with thumbnail & archived indication) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {req.propertyImage && (
                            <img
                              src={req.propertyImage}
                              alt={req.propertyTitle || 'Bien'}
                              className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                            />
                          )}
                          <div className="min-w-0 max-w-xs">
                            <div className="flex items-center gap-1.5">
                              {req.propertyReference && (
                                <span className="font-mono text-[10px] text-slate-400 uppercase">
                                  {req.propertyReference}
                                </span>
                              )}
                              {isPropArchived && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-0.5">
                                  <Archive className="w-2.5 h-2.5" />
                                  Bien archivé
                                </span>
                              )}
                            </div>
                            <span className="font-semibold text-slate-800 truncate block text-xs">
                              {req.propertyTitle || 'Bien immobilier'}
                            </span>
                            {req.propertyNeighborhood && (
                              <span className="text-[10px] text-slate-400">
                                {req.propertyNeighborhood}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 5. Date de réception */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {formatDateFR(req.createdAt)}
                      </td>

                      {/* 6. Date / Créneau souhaité */}
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-800 block">
                          {req.preferredDate}
                        </span>
                        <span className="text-[11px] text-slate-500 capitalize">
                          {req.preferredTime}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {req.visitType === 'video' ? 'Vidéo WhatsApp' : 'Présentiel'}
                        </span>
                      </td>

                      {/* 7. Statut with Quick Select */}
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          aria-label={`Statut du dossier ${req.id}`}
                          value={req.status}
                          onChange={(e) => handleStatusChange(e, req)}
                          className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-white outline-none cursor-pointer hover:border-slate-300"
                        >
                          <option value="new">{VISIT_STATUS_LABELS.new}</option>
                          <option value="to_contact">{VISIT_STATUS_LABELS.to_contact}</option>
                          <option value="scheduled">{VISIT_STATUS_LABELS.scheduled}</option>
                          <option value="completed">{VISIT_STATUS_LABELS.completed}</option>
                          <option value="cancelled">{VISIT_STATUS_LABELS.cancelled}</option>
                        </select>
                      </td>

                      {/* 8. Action de consultation */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {req.internalAdminNotes && (
                            <span title="Note interne enregistrée">
                              <FileText className="w-3.5 h-3.5 text-slate-400" />
                            </span>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onInspectRequest(req)
                            }}
                            className="py-1.5 px-3 rounded-lg bg-[#0B1730] hover:bg-[#172A46] text-white text-xs font-semibold transition-colors cursor-pointer"
                          >
                            Détails
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Responsive Cards (< 768px) ── */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
            <CalendarCheck className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">Aucune demande trouvée.</p>
          </div>
        ) : (
          filtered.map((req) => {
            const targetProp = properties.find((p) => p.id === req.propertyId)
            const isPropArchived = targetProp?.status === 'archived'

            return (
              <div
                key={req.id}
                onClick={() => onInspectRequest(req)}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 cursor-pointer hover:border-[#19B8CD] transition-colors"
              >
                {/* Header: Name, ID & Status Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {req.fullName}
                    </h3>
                    <span className="font-mono text-[10px] text-slate-400">
                      Réf. {req.id} • Reçu le {formatDateFR(req.createdAt)}
                    </span>
                  </div>
                  <VisitStatusBadge status={req.status} />
                </div>

                {/* Property summary */}
                <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                  {req.propertyImage && (
                    <img
                      src={req.propertyImage}
                      alt={req.propertyTitle || 'Bien'}
                      className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] text-slate-400 uppercase">
                        {req.propertyReference || ''}
                      </span>
                      {isPropArchived && (
                        <span className="text-[9px] px-1 rounded bg-amber-100 text-amber-800 font-bold">
                          Archivé
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-xs text-slate-800 truncate">
                      {req.propertyTitle || 'Bien immobilier'}
                    </p>
                  </div>
                </div>

                {/* Contacts & Slot */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                  <div onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] text-slate-400 block uppercase">Téléphone</span>
                    <a
                      href={`tel:${req.phone}`}
                      className="font-bold text-slate-800 hover:text-[#1499ab] block"
                    >
                      {req.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Créneau souhaité</span>
                    <span className="font-bold text-slate-800 block">
                      {req.preferredDate} ({req.preferredTime})
                    </span>
                  </div>
                </div>

                {/* Card footer action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Mode : {req.visitType === 'video' ? 'Vidéo WhatsApp' : 'Présentiel'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onInspectRequest(req)
                    }}
                    className="py-1 px-3 rounded-lg bg-[#0B1730] text-white text-xs font-semibold cursor-pointer"
                  >
                    Examiner le dossier
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
