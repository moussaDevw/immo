import React, { useState } from 'react'
import {
  X,
  CalendarCheck,
  Video,
  UserCheck,
  CheckCircle2,
  LayoutDashboard,
  ShieldCheck,
  AlertCircle,
  Phone,
  Mail,
  Clock,
  Calendar,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import { formatCFA } from '../../services/storageService'
import type { Property, VisitRequest, VisitType } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { Checkbox } from '../ui/Checkbox'

interface VisitBookingModalProps {
  property: Property | null
  onClose: () => void
}

const TODAY_STRING = new Date().toISOString().split('T')[0]

// Flexible phone validator that does NOT block Senegalese numbers (+221 77/78/76/75/70/33... or 9 digits) nor international diaspora numbers
function isValidPhoneNumber(phone: string): boolean {
  const digits = phone.replace(/\D/g, '')
  // Valid phone numbers must contain between 8 and 15 digits
  return digits.length >= 8 && digits.length <= 15
}

// RFC-compliant basic email format check
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export const VisitBookingModal: React.FC<VisitBookingModalProps> = ({
  property,
  onClose,
}) => {
  const { submitVisitRequest, navigateTo, loginAdmin } = useApp()

  const [visitType, setVisitType] = useState<VisitType>('presentiel')
  const [preferredDate, setPreferredDate] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  })
  const [timeSlot, setTimeSlot] = useState<string>('09h - 12h')
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientPhone, setClientPhone] = useState('+221 ')
  const [notes, setNotes] = useState('')
  const [consentAccepted, setConsentAccepted] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [createdRequest, setCreatedRequest] = useState<VisitRequest | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  if (!property) return null

  const reference = property.reference || (property as unknown as { ref: string }).ref || 'MT-DKR'
  const isRental = property.transactionType === 'rent'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (isSubmitting) return

    // 1. Validation du nom complet
    const trimmedName = clientName.trim()
    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage('Veuillez renseigner votre nom et prénom (au moins 2 caractères).')
      return
    }

    // 2. Validation du numéro de téléphone (adapté Sénégal & international)
    const trimmedPhone = clientPhone.trim()
    if (!trimmedPhone || trimmedPhone === '+221' || !isValidPhoneNumber(trimmedPhone)) {
      setErrorMessage(
        'Veuillez renseigner un numéro de téléphone valide (ex : +221 77 123 45 67, 771234567 ou format international).'
      )
      return
    }

    // 3. Validation de l'adresse email (décision documentée : obligatoire pour recevoir la confirmation de visite et le dossier cadastral)
    const trimmedEmail = clientEmail.trim()
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      setErrorMessage('Veuillez renseigner une adresse email valide (ex : contact@exemple.sn).')
      return
    }

    // 4. Validation de la date
    if (!preferredDate) {
      setErrorMessage('Veuillez sélectionner une date souhaitée pour votre visite.')
      return
    }

    // 5. Validation du consentement obligatoire
    if (!consentAccepted) {
      setErrorMessage(
        'Veuillez accepter d’être recontacté(e) par l’agence pour confirmer votre demande de visite.'
      )
      return
    }

    setIsSubmitting(true)

    try {
      const res = await submitVisitRequest({
        propertyId: property.id,
        propertyTitle: property.title,
        propertyReference: reference,
        propertyNeighborhood: property.neighborhood,
        propertyPrice: property.price,
        propertyTransaction: property.transactionType,
        propertyImage: property.images[0],
        fullName: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        preferredDate,
        preferredTime: timeSlot,
        visitType,
        message: notes.trim() || undefined,
      })

      if (res.success && res.request) {
        setCreatedRequest(res.request)
      } else {
        setErrorMessage(res.error || 'Erreur lors de la prise de rendez-vous. Veuillez réessayer.')
      }
    } catch {
      setErrorMessage('Une erreur est survenue lors de l’envoi. Veuillez vérifier votre connexion.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#0B1730]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden my-8">
        {/* Top Header */}
        <div className="bg-[#0B1730] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] cursor-pointer"
            aria-label="Fermer la modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#19B8CD]/20 text-[#19B8CD] border border-[#19B8CD]/40">
              <CalendarCheck className="w-3.5 h-3.5" />
              Service de Visite MusaTech
            </span>
          </div>

          <h3
            id="booking-modal-title"
            className="text-xl font-heading font-extrabold tracking-tight text-white"
          >
            {createdRequest ? 'Visite Enregistrée !' : 'Demander une visite'}
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {createdRequest
              ? 'Votre demande est confirmée et transmise au conseiller référent de l’agence.'
              : 'Planifiez une visite guidée privée pour découvrir ce bien d’exception à Dakar.'}
          </p>
        </div>

        {/* Property mini recap */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-2xs"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">
              {reference} • {property.neighborhood}
            </span>
            <h4 className="text-xs font-heading font-bold text-slate-900 truncate">
              {property.title}
            </h4>
            <span className="text-xs font-extrabold text-[#0B1730]">
              {formatCFA(property.price)}
              {isRental && (
                <span className="font-normal text-[11px] text-slate-500"> /mois</span>
              )}
            </span>
          </div>
        </div>

        {/* Success View */}
        {createdRequest ? (
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xl font-heading font-extrabold text-slate-900">
                Demande transmise avec succès !
              </h4>
              <p className="text-xs text-slate-500">
                Numéro de dossier :{' '}
                <span className="font-mono font-bold text-[#0B1730] bg-slate-100 px-2 py-0.5 rounded-md">
                  {createdRequest.id}
                </span>
              </p>
            </div>

            {/* Recap Card */}
            <div className="bg-slate-50 rounded-2xl p-4.5 text-left text-xs space-y-2.5 border border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Demandeur :</span>
                <span className="font-bold text-slate-800">{createdRequest.fullName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Contact :</span>
                <span className="font-semibold text-slate-800">
                  {createdRequest.phone} • {createdRequest.email}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Date & Créneau :</span>
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#19B8CD]" />
                  {createdRequest.preferredDate} ({createdRequest.preferredTime})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Modalité :</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {createdRequest.visitType === 'video'
                    ? 'Vidéo WhatsApp (Diaspora)'
                    : 'Présentiel sur place à Dakar'}
                </span>
              </div>
            </div>

            {/* Next steps guidance */}
            <div className="p-4 rounded-2xl bg-[#19B8CD]/10 border border-[#19B8CD]/30 text-left space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f8291]">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Prochaine étape :</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Notre conseiller référent pour le secteur de {property.neighborhood} prendra contact avec vous par téléphone ou WhatsApp dans les 2 heures ouvrées pour confirmer les accès et vous remettre le plan de situation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" fullWidth onClick={onClose}>
                Terminer
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => {
                  onClose()
                  loginAdmin()
                  navigateTo('admin-requests')
                }}
                leftIcon={<LayoutDashboard className="w-4 h-4 text-slate-950" />}
              >
                Inspecter dans l’Admin (Démo)
              </Button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMessage && (
              <div
                role="alert"
                className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5 animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Visit Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Type de visite souhaité
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVisitType('presentiel')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    visitType === 'presentiel'
                      ? 'border-[#0B1730] bg-slate-50 ring-2 ring-[#0B1730]/15 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <UserCheck
                    className={`w-4 h-4 mt-0.5 ${
                      visitType === 'presentiel' ? 'text-[#19B8CD]' : 'text-slate-400'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">
                      En présentiel
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Sur place à Dakar
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisitType('video')}
                  className={`p-3.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    visitType === 'video'
                      ? 'border-[#0B1730] bg-slate-50 ring-2 ring-[#0B1730]/15 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Video
                    className={`w-4 h-4 mt-0.5 ${
                      visitType === 'video' ? 'text-[#19B8CD]' : 'text-slate-400'
                    }`}
                  />
                  <div>
                    <span className="font-bold text-xs text-slate-800 block">
                      Visite vidéo
                    </span>
                    <span className="text-[10px] text-slate-500">
                      WhatsApp / Diaspora
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Date & Time Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Date souhaitée *"
                type="date"
                min={TODAY_STRING}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                required
              />

              <Select
                label="Créneau horaire *"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                options={[
                  { value: '09h - 12h', label: 'Matinée (09h - 12h)' },
                  { value: '14h - 17h', label: 'Après-midi (14h - 17h)' },
                  { value: '17h - 19h', label: 'Fin de journée (17h - 19h)' },
                ]}
              />
            </div>

            {/* Client Full Name */}
            <Input
              label="Nom complet *"
              placeholder="Ex : Mariama Diallo ou Moussa Diop"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Email (confirmation) *"
                type="email"
                placeholder="nom@exemple.sn"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                required
              />

              <Input
                label="Téléphone / WhatsApp *"
                type="tel"
                placeholder="+221 77 123 45 67"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                required
              />
            </div>

            {/* Optional notes */}
            <Textarea
              label="Message facultatif"
              placeholder="Précisions utiles, questions sur le titre foncier ou contraintes horaires..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />

            {/* Explicit consent checkbox (Mandatory requirement) */}
            <div className="pt-1">
              <Checkbox
                id="consent-booking-checkbox"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                label="Consentement à être recontacté(e) *"
                description="J'accepte d'être recontacté(e) par téléphone ou WhatsApp par l'agence MusaTech dans le cadre exclusif de ma demande de visite."
              />
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Données strictement confidentielles
              </span>
              <span className="text-slate-400">* Champs obligatoires</span>
            </div>

            {/* Action buttons with anti-double submission */}
            <div className="pt-2 flex items-center gap-3">
              <Button
                variant="outline"
                className="w-1/3"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button
                variant="cyan"
                type="submit"
                className="w-2/3 font-extrabold"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                leftIcon={<CalendarCheck className="w-4 h-4 text-slate-950" />}
              >
                Confirmer la demande
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
