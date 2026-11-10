import React, { useState } from 'react'
import {
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Save,
  Clock,
  Archive,
  History,
  CheckCircle2,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import { formatCFA, formatDateFR } from '../../services/storageService'
import type { VisitRequest, VisitRequestStatus } from '../../types'
import { VISIT_STATUS_LABELS } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Textarea } from '../ui/Textarea'
import { VisitStatusBadge } from '../ui/StatusBadge'

interface RequestDetailModalProps {
  request: VisitRequest | null
  onClose: () => void
}

export const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  onClose,
}) => {
  const { properties, updateRequestStatus, navigateTo } = useApp()

  const [status, setStatus] = useState<VisitRequestStatus>(
    request?.status || 'new'
  )
  const [internalNotes, setInternalNotes] = useState(
    request?.internalAdminNotes || ''
  )
  const [isSaved, setIsSaved] = useState(false)

  if (!request) return null

  // Cross-reference target property in storage
  const targetProperty = properties.find((p) => p.id === request.propertyId)
  const isPropertyArchived = targetProperty?.status === 'archived'

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateRequestStatus(request.id, status, internalNotes.trim())
    setIsSaved(true)
    setTimeout(() => {
      setIsSaved(false)
      onClose()
    }, 350)
  }

  const statusOptions: { id: VisitRequestStatus; label: string }[] = [
    { id: 'new', label: VISIT_STATUS_LABELS.new },
    { id: 'to_contact', label: VISIT_STATUS_LABELS.to_contact },
    { id: 'scheduled', label: VISIT_STATUS_LABELS.scheduled },
    { id: 'completed', label: VISIT_STATUS_LABELS.completed },
    { id: 'cancelled', label: VISIT_STATUS_LABELS.cancelled },
  ]

  // History timeline (or fallback to creation event)
  const historyEntries = request.statusHistory && request.statusHistory.length > 0
    ? request.statusHistory
    : [
        {
          status: request.status,
          changedAt: request.createdAt,
          changedBy: 'Visiteur (Formulaire en ligne)',
          note: request.internalAdminNotes || undefined,
        },
      ]

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="lg"
      title={`Dossier de Visite : ${request.fullName}`}
      description={`Réf. ${request.id} • Reçu le ${formatDateFR(request.createdAt)}`}
    >
      <form onSubmit={handleSave} className="space-y-6">
        {/* ── 1. Client Contact Details Box ── */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Coordonnées du Prospect
            </span>
            <VisitStatusBadge status={request.status} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Nom */}
            <div>
              <span className="text-slate-400 block text-[11px]">Nom complet :</span>
              <span className="font-bold text-slate-900 text-sm">
                {request.fullName}
              </span>
            </div>

            {/* Email avec lien mailto: */}
            <div>
              <span className="text-slate-400 block text-[11px]">Adresse e-mail :</span>
              <a
                href={`mailto:${request.email}`}
                className="font-medium text-[#1499ab] hover:underline flex items-center gap-1.5"
                title="Envoyer un courriel"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{request.email}</span>
              </a>
            </div>

            {/* Téléphone avec lien tel: et bouton WhatsApp */}
            <div>
              <span className="text-slate-400 block text-[11px]">Numéro de téléphone :</span>
              <div className="flex items-center gap-2 mt-0.5">
                <a
                  href={`tel:${request.phone}`}
                  className="font-bold text-slate-900 hover:text-[#1499ab] flex items-center gap-1"
                  title="Appeler par téléphone"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{request.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${request.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 transition-colors"
                  title="Contacter sur WhatsApp"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Mode de visite */}
            <div>
              <span className="text-slate-400 block text-[11px]">Modalité souhaitée :</span>
              <span className="font-bold text-slate-800">
                {request.visitType === 'video'
                  ? 'Visio WhatsApp (Diaspora / Distance)'
                  : 'Visite présentielle à Dakar'}
              </span>
            </div>
          </div>
        </div>

        {/* ── 2. Requested Slot & Visitor Message ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Date & Créneau demandés
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-[#19B8CD]" />
              <span className="text-sm font-bold text-slate-900">
                {request.preferredDate} ({request.preferredTime})
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Consentement RGPD / Démo
            </span>
            <div className="flex items-center gap-1.5 mt-1 text-emerald-700 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Consentement accordé pour être recontacté</span>
            </div>
          </div>
        </div>

        {/* Visitor Message */}
        {request.message && (
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Message du prospect
            </span>
            <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-200">
              « {request.message} »
            </p>
          </div>
        )}

        {/* ── 3. Target Property Summary & Archived Safeguard ── */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            {request.propertyImage && (
              <img
                src={request.propertyImage}
                alt={request.propertyTitle || 'Bien'}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
              />
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-400 uppercase">
                  {request.propertyReference || ''}
                </span>
                {isPropertyArchived && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Archive className="w-3 h-3 text-amber-600" />
                    Bien actuellement archivé
                  </span>
                )}
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                {request.propertyTitle || 'Bien immobilier'}
              </h4>
              <p className="text-[11px] text-slate-500">
                {request.propertyNeighborhood} •{' '}
                {request.propertyPrice !== undefined ? formatCFA(request.propertyPrice) : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose()
              navigateTo('property-detail', request.propertyId)
            }}
            className="p-2 rounded-xl text-slate-600 hover:text-[#0B1730] hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Consulter la fiche du bien"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* ── 4. Status Update Selector ── */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Mettre à jour le statut du prospect *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            {statusOptions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatus(s.id)}
                className={`py-2 px-2 rounded-xl font-bold border transition-all cursor-pointer text-center ${
                  status === s.id
                    ? 'bg-[#0B1730] text-white border-[#0B1730] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 5. Internal Manager Notes ── */}
        <Textarea
          label="Notes internes d’agence (Non visibles par le prospect)"
          rows={3}
          placeholder="Ex: Client contacté par téléphone ce matin. Budget confirmé, accord pour visite samedi 10h avec Babacar Sy..."
          value={internalNotes}
          onChange={(e) => setInternalNotes(e.target.value)}
          helperText="Conservez ici les comptes-rendus d’échanges, coordonnées de notaire ou critères spécifiques."
        />

        {/* ── 6. Status History & Audit Log ── */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-bold uppercase tracking-wider">
            <History className="w-3.5 h-3.5 text-[#19B8CD]" />
            <span>Historique des changements de statut</span>
          </div>

          <div className="space-y-2 pt-1 divide-y divide-slate-200/60">
            {historyEntries.map((entry, idx) => (
              <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">
                      {VISIT_STATUS_LABELS[entry.status]}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      par {entry.changedBy}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-[11px] text-slate-600 italic mt-0.5">
                      « {entry.note} »
                    </p>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {formatDateFR(entry.changedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. Modal Actions ── */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Fermer
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<Save className="w-4 h-4 text-[#19B8CD]" />}
          >
            {isSaved ? 'Dossier sauvegardé !' : 'Enregistrer le statut'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
