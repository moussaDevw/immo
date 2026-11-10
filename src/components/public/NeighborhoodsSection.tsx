import React from 'react'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { DAKAR_NEIGHBORHOODS_DATA } from '../../data/mockData'
import { useApp } from '../../context/useApp'
import type { DakarNeighborhood } from '../../types'
import { Container } from '../ui/Container'

export const NeighborhoodsSection: React.FC = () => {
  const { setFilters, navigateTo, properties } = useApp()

  const handleSelectNeighborhood = (neighborhood: DakarNeighborhood) => {
    setFilters((prev) => ({ ...prev, neighborhood }))
    navigateTo('catalog')
  }

  const handleKeyDownNeighborhood = (e: React.KeyboardEvent, neighborhood: DakarNeighborhood) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelectNeighborhood(neighborhood)
    }
  }

  return (
    <section
      id="quartiers-dakar"
      aria-labelledby="neighborhoods-section-title"
      className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200"
    >
      <Container size="lg">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1499ab] mb-2">
              <MapPin className="w-3.5 h-3.5" />
              Géographie Immobilière de Dakar
            </div>
            <h2
              id="neighborhoods-section-title"
              className="text-2xl sm:text-4xl font-heading font-extrabold text-[#0B1730] tracking-tight"
            >
              Les Quartiers Prisés de la Capitale
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Des Almadies au Plateau en passant par Ngor et Mamelles : découvrez les micromarchés résidentiels et d'affaires les plus recherchés du Sénégal.
            </p>
          </div>

          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, neighborhood: 'all' }))
              navigateTo('catalog')
            }}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0B1730] hover:text-[#1499ab] transition-colors self-start md:self-auto cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] rounded-lg p-1"
          >
            <span>Voir tous les quartiers</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Neighborhoods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DAKAR_NEIGHBORHOODS_DATA.map((quartier, index) => {
            const count = properties.filter((p) => p.neighborhood === quartier.name).length

            return (
              <div
                key={quartier.name}
                role="button"
                tabIndex={0}
                onClick={() => handleSelectNeighborhood(quartier.name)}
                onKeyDown={(e) => handleKeyDownNeighborhood(e, quartier.name)}
                aria-label={`Découvrir les biens immobiliers à ${quartier.name} (${count} bien${count > 1 ? 's' : ''})`}
                className={`group cursor-pointer rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] ${
                  index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Image */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={quartier.imageUrl}
                    alt={quartier.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Neighborhood badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0B1730]/90 text-white backdrop-blur-xs border border-white/20">
                      {quartier.name}
                    </span>
                  </div>

                  {/* Count */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 shadow-sm">
                      {count} bien{count > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Bottom title */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs text-slate-200 line-clamp-1">
                      {quartier.highlight}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {quartier.description}
                  </p>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">
                        Prix moyen m²
                      </span>
                      <span className="font-bold text-slate-800">
                        {quartier.averagePriceM2}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#19B8CD] group-hover:text-white transition-colors flex items-center justify-center text-slate-600">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
