import React from 'react'
import { Hero } from './Hero'
import { FeaturedProperties } from './FeaturedProperties'
import { NeighborhoodsSection } from './NeighborhoodsSection'
import { WhyPlatformSection } from './WhyPlatformSection'
import { AdvisorAssistanceSection } from './AdvisorAssistanceSection'
import { FinalCtaSection } from './FinalCtaSection'
import type { Property } from '../../types'
import { useApp } from '../../context/useApp'
import { Container } from '../ui/Container'
import { PropertyCardSkeleton } from '../ui/Skeleton'

interface HomeViewProps {
  onBookVisit: (property: Property) => void
  onOpenAdvisorModal: () => void
}

export const HomeView: React.FC<HomeViewProps> = ({
  onBookVisit,
  onOpenAdvisorModal,
}) => {
  const { isLoadingData } = useApp()

  return (
    <div className="bg-white">
      {/* 1. Hero & 2. Moteur de Recherche Rapide */}
      <Hero />

      {/* 3. Biens à la une avec gestion état de chargement */}
      {isLoadingData ? (
        <section className="py-16 sm:py-24 bg-white">
          <Container size="lg">
            <div className="h-8 w-64 bg-slate-200 rounded-md animate-pulse mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </div>
          </Container>
        </section>
      ) : (
        <FeaturedProperties onBookVisit={onBookVisit} />
      )}

      {/* 4. Quartiers populaires de Dakar */}
      <NeighborhoodsSection />

      {/* 5. Pourquoi utiliser cette plateforme (Bénéfices concrets) */}
      <WhyPlatformSection />

      {/* 6. Section accompagnement / contact */}
      <AdvisorAssistanceSection onOpenAdvisorModal={onOpenAdvisorModal} />

      {/* 7. CTA final */}
      <FinalCtaSection onOpenAdvisorModal={onOpenAdvisorModal} />
    </div>
  )
}

