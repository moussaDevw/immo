import React, { useState } from 'react'
import { PhoneCall, MessageCircle, Clock, UserCheck } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'

interface AdvisorAssistanceSectionProps {
  onOpenAdvisorModal: () => void
}

export const AdvisorAssistanceSection: React.FC<AdvisorAssistanceSectionProps> = ({
  onOpenAdvisorModal,
}) => {
  const [imgError, setImgError] = useState(false)

  return (
    <section
      aria-labelledby="advisor-assistance-title"
      className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200"
    >
      <Container size="lg">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column: Visual & Advisor Badge */}
          <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-full bg-gradient-to-br from-[#0B1730] via-[#0E2042] to-[#081124] flex flex-col justify-end overflow-hidden">
            {!imgError ? (
              <img
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80"
                alt="Fatou Binetou Diallo - Conseillère immobilière MusaTech Dakar"
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-top opacity-90"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#0B1730] to-[#12284c]">
                <div className="w-20 h-20 rounded-full bg-[#19B8CD]/20 border-2 border-[#19B8CD] flex items-center justify-center mb-3">
                  <UserCheck className="w-10 h-10 text-[#19B8CD]" />
                </div>
                <div className="text-white text-base font-heading font-bold">MusaTech Real Estate</div>
                <div className="text-slate-300 text-xs mt-1">Pôle Conseil & Accompagnement Dakar</div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1730] via-[#0B1730]/40 to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#19B8CD] text-slate-950 uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5" />
                Interlocuteur Dédié
              </span>
              <p className="font-heading font-extrabold text-base">
                Fatou Binetou Diallo
              </p>
              <p className="text-xs text-slate-300">
                Responsable Clientèle Privée & Diaspora • MusaTech Real Estate
              </p>
            </div>
          </div>

          {/* Right Column: Content and CTA */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1499ab]">
                <Clock className="w-3.5 h-3.5" />
                Accompagnement Sur-Mesure
              </div>
              <h2
                id="advisor-assistance-title"
                className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0B1730] tracking-tight"
              >
                Un Conseiller Privé pour Guider Votre Projet
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Trouver le bien parfait à Dakar nécessite une compréhension fine des quartiers, du cadastre et des formalités d'acquisition. Nos conseillers vous assistent à chaque étape, de la pré-sélection jusqu'à la signature chez le notaire.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="font-bold text-[#0B1730] block">
                    Orientation Quartier
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Almadies, Ngor, Mamelles ou Plateau : aide au ciblage selon votre mode de vie et vos objectifs.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="font-bold text-[#0B1730] block">
                    Assistance Diaspora
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Visites guidées en direct sur WhatsApp et coordination des vérifications à distance.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <Button
                variant="cyan"
                size="md"
                leftIcon={<PhoneCall className="w-4 h-4" />}
                onClick={onOpenAdvisorModal}
              >
                Demander un rappel gratuit
              </Button>

              <a
                href="https://wa.me/221770000000"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-bold transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Conseiller (Démo)</span>
              </a>

              <span className="text-[11px] text-slate-400 block sm:inline">
                Disponibilité : Lun - Sam 08h30 - 19h00 GMT
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
