import React from 'react'
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  CalendarCheck,
  Eye,
  Car,
} from 'lucide-react'
import type { Property } from '../../types'
import { formatCFA } from '../../services/storageService'
import { useApp } from '../../context/useApp'
import { Button } from '../ui/Button'
import { TransactionBadge, PropertyStatusBadge } from '../ui/StatusBadge'
import { PROPERTY_TYPE_LABELS } from '../../types'

interface PropertyCardProps {
  property: Property
  onBookVisit?: (property: Property) => void
  viewMode?: 'grid' | 'list'
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onBookVisit,
  viewMode = 'grid',
}) => {
  const { navigateTo, isFavorite, toggleFavorite } = useApp()
  const favorited = isFavorite(property.id)

  const isRental = property.transactionType === 'rent'
  const reference = property.reference || 'MT-DKR'
  const propertyType = property.propertyType

  if (viewMode === 'list') {
    return (
      <article className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col md:flex-row">
        {/* Image container */}
        <div className="relative md:w-80 h-56 md:h-auto shrink-0 overflow-hidden bg-slate-100">
          <img
            src={property.images[0]}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent md:hidden" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <TransactionBadge type={property.transactionType} />
            <PropertyStatusBadge status={property.status} />
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(property.id)
            }}
            aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 hover:text-rose-500 hover:bg-white transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
              }`}
            />
          </button>

          {/* Reference pill */}
          <div className="absolute bottom-3 left-3">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
              {reference}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#1499ab]">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                {property.neighborhood}, {property.city || 'Dakar'}
              </span>
              <span className="text-xs text-slate-400 capitalize">
                {PROPERTY_TYPE_LABELS[propertyType] || propertyType}
              </span>
            </div>

            <h3
              onClick={() => navigateTo('property-detail', property.id)}
              className="font-heading font-bold text-lg text-[#0B1730] group-hover:text-[#1499ab] transition-colors cursor-pointer line-clamp-1"
            >
              {property.title}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
              {property.description}
            </p>

            {/* Specs (aucune caractéristique absente inventée) */}
            <div className="flex items-center gap-4 py-3 my-3 border-y border-slate-100 text-slate-600 text-xs">
              {property.surface !== undefined && property.surface > 0 && (
                <div className="flex items-center gap-1.5" title="Surface habitable">
                  <Maximize2 className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{property.surface}</span> m²
                </div>
              )}
              {property.bedrooms > 0 && (
                <div className="flex items-center gap-1.5" title="Chambres">
                  <Bed className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{property.bedrooms}</span> ch.
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center gap-1.5" title="Salles de bain">
                  <Bath className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{property.bathrooms}</span> sdb
                </div>
              )}
              {property.parkingSpots !== undefined && property.parkingSpots > 0 && (
                <div className="flex items-center gap-1.5" title="Places de parking">
                  <Car className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{property.parkingSpots}</span> pk
                </div>
              )}
            </div>
          </div>

          {/* Bottom row: Price and CTA */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">
                {isRental ? 'Loyer mensuel' : 'Prix de vente'}
              </span>
              <div className="font-heading font-extrabold text-xl text-[#0B1730]">
                {formatCFA(property.price)}
                {isRental && (
                  <span className="text-xs font-normal text-slate-500"> /mois</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigateTo('property-detail', property.id)}
                leftIcon={<Eye className="w-3.5 h-3.5" />}
              >
                Consulter
              </Button>
              {onBookVisit && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onBookVisit(property)}
                  leftIcon={<CalendarCheck className="w-3.5 h-3.5 text-[#19B8CD]" />}
                >
                  Visiter
                </Button>
              )}
            </div>
          </div>
        </div>
      </article>
    )
  }

  // Grid view (default)
  return (
    <article className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Image wrapper */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-100">
          <img
            src={property.images[0]}
            alt={property.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />

          {/* Badges */}
          <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5">
            <TransactionBadge type={property.transactionType} />
            <PropertyStatusBadge status={property.status} />
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(property.id)
            }}
            aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-700 hover:text-rose-500 hover:bg-white transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
              }`}
            />
          </button>

          {/* Bottom image overlay: Ref & Neighborhood */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
            <span className="inline-flex items-center gap-1 font-semibold drop-shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-[#19B8CD]" />
              {property.neighborhood}, {property.city || 'Dakar'}
            </span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-black/50 backdrop-blur-xs">
              {reference}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 capitalize mb-1.5">
            <span>
              {PROPERTY_TYPE_LABELS[propertyType] || propertyType}
            </span>
            <span>{property.city || 'Dakar'}</span>
          </div>

          <h3
            onClick={() => navigateTo('property-detail', property.id)}
            className="font-heading font-bold text-base text-[#0B1730] group-hover:text-[#1499ab] transition-colors cursor-pointer line-clamp-1"
          >
            {property.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
            {property.description}
          </p>

          {/* Specs (aucune caractéristique absente inventée) */}
          <div className="flex items-center justify-between py-3 my-3 border-y border-slate-100 text-slate-600 text-xs">
            {property.surface !== undefined && property.surface > 0 && (
              <div className="flex items-center gap-1" title="Surface habitable">
                <Maximize2 className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800">{property.surface}</span> m²
              </div>
            )}
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1" title="Chambres">
                <Bed className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800">{property.bedrooms}</span> ch.
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1" title="Salles de bain">
                <Bath className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800">{property.bathrooms}</span> sdb
              </div>
            )}
            {property.parkingSpots !== undefined && property.parkingSpots > 0 && (
              <div className="flex items-center gap-1" title="Places de parking">
                <Car className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800">{property.parkingSpots}</span> pk
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Price & CTA */}
      <div className="px-5 pb-5 pt-0">
        <div className="flex items-end justify-between gap-2 mb-3">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
              {isRental ? 'Loyer mensuel' : 'Prix de vente'}
            </span>
            <div className="font-heading font-extrabold text-lg sm:text-xl text-[#0B1730]">
              {formatCFA(property.price)}
              {isRental && (
                <span className="text-xs font-normal text-slate-500"> /mois</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigateTo('property-detail', property.id)}
            leftIcon={<Eye className="w-3.5 h-3.5" />}
          >
            Consulter
          </Button>
          {onBookVisit && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onBookVisit(property)}
              leftIcon={<CalendarCheck className="w-3.5 h-3.5 text-[#19B8CD]" />}
            >
              Visiter
            </Button>
          )}
        </div>
      </div>
    </article>
  )
}
