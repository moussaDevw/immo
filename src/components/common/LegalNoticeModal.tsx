import React from 'react'
import { ShieldCheck, Sparkles, Database, FileText } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface LegalNoticeModalProps {
  isOpen: boolean
  onClose: () => void
  type?: 'legal' | 'privacy' | 'terms'
}

export const LegalNoticeModal: React.FC<LegalNoticeModalProps> = ({
  isOpen,
  onClose,
  type = 'legal',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        type === 'privacy'
          ? 'Politique de Confidentialité (Cadre Démonstration)'
          : type === 'terms'
          ? 'Conditions Générales d’Utilisation (Démo)'
          : 'Mentions Légales & Cadre Démonstration'
      }
      description="Informations relatives au statut prototype et commercial de cette application."
    >
      <div className="space-y-4 text-xs text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
        <div className="p-3 bg-[#0B1730] text-white rounded-xl flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#172A46] flex items-center justify-center text-[#19B8CD] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-sm block">
              Démonstration conçue par MusaTech
            </span>
            <p className="text-[11px] text-slate-300">
              Prototype commercial destiné à illustrer le savoir-faire technologique de MusaTech pour les professionnels de l'immobilier au Sénégal.
            </p>
          </div>
        </div>

        <section className="space-y-2">
          <h4 className="font-heading font-bold text-sm text-[#0B1730] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#19B8CD]" />
            1. Statut de Démonstration & Données Fictives
          </h4>
          <p>
            L’application <strong>MusaTech Real Estate</strong> est un environnement de démonstration interactif. Toutes les informations présentées (biens immobiliers, photographies, prix en FCFA, coordonnées, adresses à Dakar, conseillers et profils) sont <strong>strictement fictives</strong> ou utilisées à titre d'illustration technologique.
          </p>
          <p>
            Aucune vente réelle, acte notarié, mandat de gestion ou réservation juridique ne peut être contracté via cette interface.
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-heading font-bold text-sm text-[#0B1730] flex items-center gap-1.5">
            <Database className="w-4 h-4 text-[#19B8CD]" />
            2. Confidentialité & Persistance Locale (Offline-first)
          </h4>
          <p>
            Cette application ne requiert aucun compte distant et ne collecte aucune donnée personnelle sur des serveurs externes sans votre consentement. Les formulaires de demande de visite, les favoris et les filtres de recherche sont persistés localement dans le stockage de votre navigateur (<code>localStorage</code>) à des fins de simulation.
          </p>
          <p>
            Vous pouvez à tout moment réinitialiser l’ensemble des données depuis l’espace d'administration via la fonction « Réinitialiser les données démo ».
          </p>
        </section>

        <section className="space-y-2">
          <h4 className="font-heading font-bold text-sm text-[#0B1730] flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#19B8CD]" />
            3. Propriété Intellectuelle & Droits
          </h4>
          <p>
            L'architecture, le design system, les parcours utilisateurs et les développements frontend/backend de cette démonstration sont la propriété de <strong>MusaTech</strong>. Toute reproduction ou adaptation pour un déploiement en production nécessite un accord contractuel explicite.
          </p>
        </section>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-200 flex justify-end">
        <Button variant="primary" size="sm" onClick={onClose}>
          Compris, fermer
        </Button>
      </div>
    </Modal>
  )
}

