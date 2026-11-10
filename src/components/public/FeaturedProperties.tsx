import React from 'react'
import { Sparkles, ArrowRight, Building2 } from 'lucide-react'
import { useApp } from '../../context/useApp'
import { PropertyCard } from './PropertyCard'
import type { Property } from '../../types'
import { Container } from '../ui/Container'
import { Button } from '../ui/Button'

interface FeaturedPropertiesProps {
  onBookVisit: (property: Property) => void
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
  onBookVisit,
}) => {
  const { properties, navigateTo } = useApp()

  const featured = properties.filter((p) => p.featured)

  return (
    <section className="py-16 sm:py-24 bg-white" aria-labelledby="featured-properties-title">
      <Container size="lg">
        {/* Section title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1499ab] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Sélection Exclusive MusaTech • {featured.length} biens sélectionnés
            </div>
            <h2
              id="featured-properties-title"
              className="text-2xl sm:text-4xl font-heading font-extrabold text-[#0B1730] tracking-tight"
            >
              Biens d’Exception à la Une
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Les propriétés les plus prestigieuses actuellement disponibles à Dakar : villas pieds dans l'eau, penthouses panoramiques et résidences sécurisées.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4 text-[#19B8CD]" />}
            onClick={() => navigateTo('catalog')}
            className="self-start md:self-auto shrink-0"
          >
            Explorer tout le catalogue ({properties.length})
          </Button>
        </div>

        {/* Grid of featured properties */}
        {featured.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-500">
            <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-400" />
            <p className="font-semibold text-sm">Tous les biens sont consultables dans le catalogue complet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onBookVisit={onBookVisit}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
