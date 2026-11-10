import React, { useState } from 'react'
import {
  PhoneCall,
  MessageCircle,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { useApp } from '../../context/useApp'

interface AdvisorContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AdvisorContactModal: React.FC<AdvisorContactModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useApp()

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [projectType, setProjectType] = useState('achat')
  const [timeSlot, setTimeSlot] = useState('matin')
  const [message, setMessage] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
      showToast({
        type: 'success',
        title: 'Demande de rappel transmise',
        message: 'Un conseiller commercial vous recontactera sur votre créneau sélectionné.',
      })
      setTimeout(() => {
        setIsSubmitted(false)
        onClose()
      }, 1500)
    }, 500)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Parler à un Conseiller Immobilier"
      description="Échangez avec nos spécialistes du marché dakarois et de l'investissement au Sénégal."
    >
      {isSubmitted ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="font-heading font-extrabold text-lg text-[#0B1730]">
            Votre demande a bien été enregistrée
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Dans le cadre de cette démonstration MusaTech, cette demande simule l’affectation d’un lead qualifié à un agent dédié.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#19B8CD] shrink-0" />
              <span>Service de démonstration MusaTech Real Estate</span>
            </div>
            <a
              href="https://wa.me/221770000000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Direct
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Nom complet *"
              placeholder="Ex: Cheikh Ndiaye"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Numéro de téléphone *"
              placeholder="+221 77 000 00 00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Adresse e-mail *"
              type="email"
              placeholder="cheikh.ndiaye@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Select
              label="Type de projet *"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              options={[
                { value: 'achat', label: 'Acquisition d’une propriété' },
                { value: 'location', label: 'Recherche d’une location haut standing' },
                { value: 'vente', label: 'Estimation / Vente d’un bien à Dakar' },
                { value: 'diaspora', label: 'Investissement Diaspora (Accompagnement)' },
              ]}
            />
          </div>

          <Select
            label="Créneau de rappel souhaité"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            options={[
              { value: 'matin', label: 'Matinée (09h00 - 12h00 GMT)' },
              { value: 'apres-midi', label: 'Après-midi (14h00 - 18h00 GMT)' },
              { value: 'soir', label: 'Fin de journée (18h00 - 20h00 GMT)' },
            ]}
          />

          <Textarea
            label="Précisions sur vos critères de recherche (Optionnel)"
            rows={2}
            placeholder="Ex: Villa contemporaine avec piscine aux Almadies ou Ngor, budget de 300 à 600 millions FCFA..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Rappel sous 2h ouvrées (Démo)</span>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="cyan"
                size="sm"
                isLoading={isLoading}
                leftIcon={<PhoneCall className="w-3.5 h-3.5" />}
              >
                Être rappelé
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  )
}
