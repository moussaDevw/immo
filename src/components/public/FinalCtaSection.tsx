import React from 'react'
import { ArrowRight, Building2, Sparkles, LayoutDashboard } from 'lucide-react'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'
import { useApp } from '../../context/useApp'

interface FinalCtaSectionProps {
  onOpenAdvisorModal: () => void
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onOpenAdvisorModal,
}) => {
  const { navigateTo, openAuthModal, properties } = useApp()

  return (
    <section aria-labelledby="final-cta-title" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <Container size="lg">
        <div className="bg-[#0B1730] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-slate-800">
          {/* Subtle background glow effect */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#19B8CD]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#19B8CD]/20 text-[#19B8CD] border border-[#19B8CD]/30 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Votre Projet Immobilier à Dakar Démarre Ici</span>
            </div>

            <h2
              id="final-cta-title"
              className="text-2xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white leading-tight"
            >
              Prêt à Concrétiser Votre Acquisition ou Location à Dakar ?
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
              Consultez nos <strong>{properties.length} biens certifiés</strong> ou prenez contact avec nos conseillers pour définir vos critères et organiser votre première visite.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Button
                variant="cyan"
                size="lg"
                leftIcon={<Building2 className="w-5 h-5" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => navigateTo('catalog')}
              >
                Explorer tout le catalogue
              </Button>

              <Button
                variant="outline-dark"
                size="lg"
                onClick={onOpenAdvisorModal}
              >
                Être recontacté par un conseiller
              </Button>

              <button
                onClick={openAuthModal}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
                title="Tester le tableau de bord agence"
              >
                <LayoutDashboard className="w-4 h-4 text-[#19B8CD]" />
                <span>Espace Démo Agence</span>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

