import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  ArrowLeft,
  MapPin,
  Heart,
  Share2,
  Printer,
  Bed,
  Bath,
  Maximize2,
  CalendarCheck,
  Phone,
  MessageCircle,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Car,
  Home,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Building,
  ShieldAlert,
  Copy,
  Calculator,
  HelpCircle,
  BadgeCheck,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import { formatCFA } from '../../services/storageService'
import { DAKAR_NEIGHBORHOODS_DATA } from '../../data/mockData'
import { PropertyCard } from './PropertyCard'
import { Button } from '../ui/Button'
import { EmptyState } from '../ui/EmptyState'
import { TransactionBadge, PropertyStatusBadge } from '../ui/StatusBadge'
import type { Property } from '../../types'
import { PROPERTY_TYPE_LABELS } from '../../types'

interface PropertyDetailViewProps {
  propertyId: string
  onBookVisit: (property: Property) => void
  onOpenAdvisorModal?: () => void
}

export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  propertyId,
  onBookVisit,
  onOpenAdvisorModal,
}) => {
  const { properties, navigateTo, isFavorite, toggleFavorite, showToast } = useApp()

  const property = properties.find((p) => p.id === propertyId)

  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [prevPropertyId, setPrevPropertyId] = useState(propertyId)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'location' | 'legal' | 'simulator'>('overview')

  // Financial simulator state
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20)
  const [loanDurationYears, setLoanDurationYears] = useState<number>(15)
  const [interestRatePercent] = useState<number>(7.5) // Indicative bank rate in Senegal / WAEMU

  // Adjust state during render if propertyId changed
  if (propertyId !== prevPropertyId) {
    setPrevPropertyId(propertyId)
    setSelectedImageIndex(0)
    setIsLightboxOpen(false)
  }

  const activeImageIndex = Math.min(
    selectedImageIndex,
    Math.max(0, (property?.images.length ?? 1) - 1)
  )

  // Keyboard navigation for Lightbox
  const handleNextImage = useCallback(() => {
    if (!property || property.images.length <= 1) return
    setSelectedImageIndex((prev) => (prev + 1) % property.images.length)
  }, [property])

  const handlePrevImage = useCallback(() => {
    if (!property || property.images.length <= 1) return
    setSelectedImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
  }, [property])

  useEffect(() => {
    if (!isLightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false)
      } else if (e.key === 'ArrowRight') {
        handleNextImage()
      } else if (e.key === 'ArrowLeft') {
        handlePrevImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, handleNextImage, handlePrevImage])

  // Mortgage simulation calculations (unconditional hooks)
  const propertyPrice = property?.price ?? 0
  const downPaymentAmount = (propertyPrice * downPaymentPercent) / 100
  const loanAmount = Math.max(0, propertyPrice - downPaymentAmount)
  const monthlyRate = interestRatePercent / 100 / 12
  const totalMonths = loanDurationYears * 12

  const estimatedMonthlyPayment = useMemo(() => {
    if (loanAmount <= 0) return 0
    if (monthlyRate === 0) return Math.round(loanAmount / totalMonths)
    const factor = Math.pow(1 + monthlyRate, totalMonths)
    return Math.round((loanAmount * (monthlyRate * factor)) / (factor - 1))
  }, [loanAmount, monthlyRate, totalMonths])

  // Safeguard: Property not found
  if (!property) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <EmptyState
          icon={<Building className="w-8 h-8 text-slate-400" />}
          title="Propriété introuvable"
          description="L'annonce immobilière que vous recherchez n'existe pas ou la référence est incorrecte."
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigateTo('catalog')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Retourner au catalogue
            </Button>
          }
        />
      </div>
    )
  }

  // Safeguard: Draft or Archived property (Strict business rule: public users cannot view unpublished listings)
  if (property.status !== 'published') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <EmptyState
          icon={<ShieldAlert className="w-8 h-8 text-amber-500" />}
          title="Annonce non disponible"
          description={`Ce bien (${property.reference}) est actuellement au statut « ${
            property.status === 'draft' ? 'Brouillon' : 'Archivé'
          } » et n'est pas accessible au public.`}
          action={
            <Button
              variant="primary"
              size="md"
              onClick={() => navigateTo('catalog')}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Découvrir les biens disponibles
            </Button>
          }
        />
      </div>
    )
  }

  const isRental = property.transactionType === 'rent'
  const reference = property.reference || 'MT-DKR'
  const addressLabel = property.addressLabel || ''
  const favorited = isFavorite(property.id)

  // Similar properties: same neighborhood or transaction type, strictly published, excluding current
  const similarProperties = properties
    .filter(
      (p) =>
        p.id !== property.id &&
        p.status === 'published' &&
        (p.neighborhood === property.neighborhood || p.transactionType === property.transactionType)
    )
    .slice(0, 3)

  // Neighborhood information from curated Dakar market data
  const neighborhoodData = DAKAR_NEIGHBORHOODS_DATA.find(
    (n) => n.name === property.neighborhood
  )

  const handleShare = async () => {
    const url = window.location.href
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
        showToast({
          type: 'success',
          title: 'Lien copié !',
          message: 'L’adresse de cette annonce a été copiée dans votre presse-papiers.',
        })
      } else {
        showToast({
          type: 'info',
          title: 'Partage',
          message: `Lien de l’annonce : ${url}`,
        })
      }
    } catch {
      showToast({
        type: 'info',
        title: 'Lien',
        message: url,
      })
    }
  }

  const handleCopyReference = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(reference)
        showToast({
          type: 'success',
          title: 'Référence copiée',
          message: `La référence ${reference} a été copiée.`,
        })
      }
    } catch {
      // ignore
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Estimated notarial and registration fees in Senegal (~7.5% for real estate)
  const estimatedNotaryFees = Math.round(propertyPrice * 0.075)

  // WhatsApp pre-filled message URL
  const whatsappText = encodeURIComponent(
    `Bonjour MusaTech, je souhaite des informations et planifier une visite pour le bien ${reference} : "${property.title}" (${property.neighborhood}, ${formatCFA(property.price)}).`
  )
  const whatsappUrl = `https://wa.me/221774501234?text=${whatsappText}`

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateTo('catalog')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Retour au catalogue
          </Button>

          <nav
            aria-label="Fil d'Ariane"
            className="flex items-center gap-2 text-xs text-slate-500 overflow-x-auto py-1"
          >
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-[#0B1730] transition-colors cursor-pointer"
            >
              Accueil
            </button>
            <span className="text-slate-300">/</span>
            <button
              onClick={() => navigateTo('catalog')}
              className="hover:text-[#0B1730] transition-colors cursor-pointer"
            >
              Catalogue
            </button>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-700">{property.neighborhood}</span>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded text-[11px]">
              {reference}
            </span>
          </nav>
        </div>

        {/* Title, Badges & Price Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <TransactionBadge type={property.transactionType} />
                <PropertyStatusBadge status={property.status} />
                {property.featured && (
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Coup de cœur
                  </span>
                )}
                <button
                  onClick={handleCopyReference}
                  title="Cliquer pour copier la référence"
                  className="group inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  <span>Réf. {reference}</span>
                  <Copy className="w-3 h-3 text-slate-400 group-hover:text-slate-700" />
                </button>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-[#0B1730] tracking-tight leading-tight">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
                <MapPin className="w-4 h-4 text-[#19B8CD] shrink-0" />
                <span>
                  {addressLabel ? `${addressLabel} • ` : ''}
                  <strong className="text-slate-800">{property.neighborhood}</strong>,{' '}
                  {property.city || 'Dakar'}, Sénégal
                </span>
              </div>
            </div>

            {/* Price & Primary Interactive Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0">
              <div className="lg:text-right">
                <span className="text-[11px] text-slate-400 block uppercase font-bold tracking-wider">
                  {isRental ? 'Loyer mensuel' : 'Prix de commercialisation'}
                </span>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-[#0B1730]">
                  {formatCFA(property.price)}
                  {isRental && <span className="text-sm font-normal text-slate-500"> /mois</span>}
                </div>
                {property.chargesMonthly && (
                  <span className="text-xs text-slate-500 block mt-0.5">
                    + {formatCFA(property.chargesMonthly)}/mois de charges de copropriété
                  </span>
                )}
              </div>

              {/* Action buttons: Favorite, Share, Print */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFavorite(property.id)}
                  aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  className={`px-3.5 py-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold cursor-pointer ${
                    favorited
                      ? 'border-rose-200 bg-rose-50 text-rose-600 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorited ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                    }`}
                  />
                  <span>{favorited ? 'Enregistré' : 'Sauvegarder'}</span>
                </button>

                <button
                  onClick={handleShare}
                  aria-label="Partager cette annonce"
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all flex items-center gap-2 text-xs font-bold cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-slate-400" />
                  <span>Partager</span>
                </button>

                <button
                  onClick={handlePrint}
                  aria-label="Imprimer la fiche"
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all hidden sm:flex items-center justify-center cursor-pointer"
                  title="Imprimer cette fiche descriptive"
                >
                  <Printer className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Key specs row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-2 text-slate-700 text-xs">
            {property.surface !== undefined && property.surface > 0 && (
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#19B8CD] shadow-xs shrink-0 border border-slate-100">
                  <Maximize2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Surface
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {property.surface} m²
                  </span>
                </div>
              </div>
            )}

            {property.bedrooms > 0 && (
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#19B8CD] shadow-xs shrink-0 border border-slate-100">
                  <Bed className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Chambres
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {property.bedrooms} ch.
                  </span>
                </div>
              </div>
            )}

            {property.bathrooms > 0 && (
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#19B8CD] shadow-xs shrink-0 border border-slate-100">
                  <Bath className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Salles d’eau
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {property.bathrooms} sdb
                  </span>
                </div>
              </div>
            )}

            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#19B8CD] shadow-xs shrink-0 border border-slate-100">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Stationnement
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {property.parkingSpots
                    ? `${property.parkingSpots} place${property.parkingSpots > 1 ? 's' : ''}`
                    : 'Inclus'}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#19B8CD] shadow-xs shrink-0 border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Sécurité Foncière
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  Titre Foncier
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-[#19B8CD] shadow-xs shrink-0 border border-slate-100">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">
                  Type de bien
                </span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {PROPERTY_TYPE_LABELS[property.propertyType] || 'Villa'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Photo Gallery */}
        <section aria-label="Galerie photos de la propriété" className="space-y-4">
          <div className="relative h-80 sm:h-[500px] lg:h-[560px] w-full rounded-3xl overflow-hidden shadow-lg bg-[#0B1730] group">
            <img
              src={property.images[activeImageIndex] || property.images[0]}
              alt={`${property.title} - Photo vue ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            />

            {/* Top Overlay Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
              <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                {isRental ? 'À Louer' : 'À Vendre'}
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-950/70 backdrop-blur-md text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Titre Foncier Vérifié
              </span>
            </div>

            {/* Navigation arrows (if multiple images) */}
            {property.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevImage()
                  }}
                  aria-label="Photo précédente"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-md"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNextImage()
                  }}
                  aria-label="Photo suivante"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 hover:scale-105 cursor-pointer shadow-md"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Bottom Controls: Counter & Fullscreen Zoom Button */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Maximize2 className="w-3.5 h-3.5 text-[#19B8CD]" />
                <span className="hidden sm:inline">Plein écran</span>
              </button>

              <div className="bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-white text-xs font-semibold">
                Photo {activeImageIndex + 1} / {property.images.length}
              </div>
            </div>
          </div>

          {/* Thumbnails Bar */}
          {property.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scroll-smooth">
              {property.images.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  aria-label={`Afficher la photo ${idx + 1}`}
                  className={`relative w-24 sm:w-28 h-16 sm:h-18 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    activeImageIndex === idx
                      ? 'border-[#19B8CD] ring-4 ring-[#19B8CD]/20 scale-102 shadow-md'
                      : 'border-transparent opacity-65 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Miniature ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {activeImageIndex === idx && (
                    <div className="absolute inset-0 bg-[#19B8CD]/10 pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Fullscreen Lightbox Modal */}
        {isLightboxOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Visionneuse photo en plein écran"
            className="fixed inset-0 z-50 bg-[#0B1730]/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6"
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between text-white pb-4 border-b border-white/10">
              <div className="space-y-0.5 max-w-xl truncate">
                <h3 className="font-heading font-bold text-sm sm:text-base text-white truncate">
                  {property.title}
                </h3>
                <p className="text-xs text-slate-300">
                  {property.neighborhood} • Réf. {reference}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-300 font-medium">
                  {activeImageIndex + 1} sur {property.images.length}
                </span>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label="Fermer la vue plein écran"
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Main Lightbox Image Viewport */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
              <img
                src={property.images[activeImageIndex]}
                alt={`${property.title} - Zoom photo ${activeImageIndex + 1}`}
                className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-300 select-none"
              />

              {property.images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Photo précédente"
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-xl border border-white/10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Photo suivante"
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer shadow-xl border border-white/10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox Bottom Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto pt-2 pb-1">
                {property.images.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 sm:w-20 h-11 sm:h-13 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-[#19B8CD] ring-2 ring-[#19B8CD]'
                        : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Aperçu miniature ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Structure: Left Details vs Right Sticky Booking Aside */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Tabbed Content (Description, Legal, Simulator) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs Selector */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-[#0B1730] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Présentation & Prestations
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('location')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'location'
                    ? 'bg-[#0B1730] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#19B8CD]" />
                <span>Localisation & Quartier</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('legal')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'legal'
                    ? 'bg-[#0B1730] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-[#19B8CD]" />
                <span>Sécurité Juridique & Frais</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('simulator')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'simulator'
                    ? 'bg-[#0B1730] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calculator className="w-4 h-4 text-[#19B8CD]" />
                <span>Simulateur Financier</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW & AMENITIES */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Full Description */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <h2 className="text-xl font-heading font-extrabold text-[#0B1730]">
                    Description du bien
                  </h2>
                  <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3">
                    {property.description}
                  </div>
                </div>

                {/* Highlights */}
                {property.highlights && property.highlights.length > 0 && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#19B8CD]/10 text-[#19B8CD] flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <h2 className="text-xl font-heading font-extrabold text-[#0B1730]">
                        Points forts & prestations d’exception
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      {property.highlights.map((highlight, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-start gap-3"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Amenities Grid */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                  <h2 className="text-xl font-heading font-extrabold text-[#0B1730]">
                    Équipements & Prestations incluses
                  </h2>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                    {property.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center gap-2.5 text-xs font-bold text-slate-700"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-[#19B8CD] shrink-0" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LOCATION & NEIGHBORHOOD */}
            {activeTab === 'location' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0B1730] text-[#19B8CD] flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-extrabold text-[#0B1730]">
                        Localisation & Cadre de vie ({property.neighborhood})
                      </h2>
                      <p className="text-xs text-slate-500">
                        Repère géographique illustratif au sein de la presqu’île dakaroise.
                      </p>
                    </div>
                  </div>

                  {/* Illustrative Map Widget with clear non-misleading notice */}
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-[#0B1730] to-[#172A46] p-6 text-white space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#19B8CD] animate-ping" />
                        <span className="font-bold text-xs uppercase tracking-wider text-[#19B8CD]">
                          Repère de quartier illustratif
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2.5 py-1 rounded-md">
                        Secteur {property.neighborhood} • Dakar
                      </span>
                    </div>

                    {/* Stylized Dakar Peninsula Graphic */}
                    <div className="relative h-44 sm:h-52 w-full rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-center overflow-hidden p-4">
                      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#19B8CD_1px,transparent_1px)] [background-size:16px_16px]" />

                      {/* Stylized Dakar bay lines */}
                      <svg
                        className="w-full h-full max-w-md text-white/10 pointer-events-none"
                        viewBox="0 0 400 200"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M20 180 Q80 160 140 130 T240 70 T320 40 T380 20"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                        />
                        <path
                          d="M50 190 Q120 150 180 120 T280 60 T350 30"
                          stroke="#19B8CD"
                          strokeWidth="1.5"
                          opacity="0.3"
                        />
                      </svg>

                      {/* Pulsing Pin for property */}
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-[#19B8CD] text-slate-950 flex items-center justify-center shadow-lg ring-8 ring-[#19B8CD]/20">
                          <MapPin className="w-5 h-5 fill-slate-950" />
                        </div>
                        <span className="font-heading font-extrabold text-xs text-white bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                          {property.neighborhood}
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 font-mono">
                        Océan Atlantique • Corniche Dakaroise
                      </div>
                    </div>

                    {/* Clear mandatory disclaimer notice */}
                    <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-300 space-y-1">
                      <span className="font-bold text-white block">
                        Discrétion & Sécurité des propriétaires :
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Par mesure de confidentialité et de sécurité, l'emplacement affiché correspond au centre du quartier ({property.neighborhood}). Les coordonnées cadastrales exactes et le plan d'accès officiel vous seront remis en mains propres lors de la visite privée avec notre conseiller.
                      </p>
                    </div>
                  </div>

                  {/* Neighborhood info & accessibility */}
                  {neighborhoodData && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                        <span className="text-slate-400 block uppercase font-bold text-[10px]">
                          Atout phare du quartier
                        </span>
                        <span className="font-extrabold text-slate-900 text-sm block">
                          {neighborhoodData.highlight}
                        </span>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          {neighborhoodData.description}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                        <span className="text-slate-400 block uppercase font-bold text-[10px]">
                          Valeur vénale moyenne constatée
                        </span>
                        <span className="font-extrabold text-[#0B1730] text-sm block">
                          ~{neighborhoodData.averagePriceM2}
                        </span>
                        <p className="text-slate-500 text-[11px] leading-relaxed">
                          Fourchette indicative constatée sur les transactions immobilières récentes dans ce secteur de la capitale.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Proximity benchmarks */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
                    <h4 className="font-bold text-slate-900">Temps de trajet & Accessibilité :</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Corniche / VDN</span>
                        <span className="font-extrabold text-slate-900">~5 à 10 min</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Écoles d'élite</span>
                        <span className="font-extrabold text-slate-900">~5 min</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Plateau Affaires</span>
                        <span className="font-extrabold text-slate-900">~15 à 20 min</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Aéroport AIBD</span>
                        <span className="font-extrabold text-slate-900">~45 min (péage)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LEGAL & FINANCIAL DETAILS */}
            {activeTab === 'legal' && (
              <div className="space-y-8">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-extrabold text-[#0B1730]">
                        Garanties juridiques & sécurisation des transactions
                      </h2>
                      <p className="text-xs text-slate-500">
                        Processus notarial conforme à la législation foncière de la République du Sénégal.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                      <span className="text-slate-400 block uppercase font-bold text-[10px]">
                        Régime foncier vérifié
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm block">
                        Titre Foncier individuel (TF)
                      </span>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        État des droits réels délivré par le Conservateur de la Propriété Foncière de Dakar.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                      <span className="text-slate-400 block uppercase font-bold text-[10px]">
                        Sécurité des règlements
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm block text-emerald-700">
                        Compte Séquestre Notarié Agréé
                      </span>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Aucun acompte direct versé au propriétaire. Les fonds sont consignés chez le Notaire.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                      <span className="text-slate-400 block uppercase font-bold text-[10px]">
                        Délai de jouissance / Clés
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm block">
                        Immédiate après réitération
                      </span>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Remise des clés et procès-verbal contradictoire à la signature de l’acte authentique.
                      </p>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                      <span className="text-slate-400 block uppercase font-bold text-[10px]">
                        Accompagnement MusaTech
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm block">
                        Assistance bilingue et diaspora
                      </span>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        Prise en charge des procurations notariées pour les acquéreurs résidant à l’étranger.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial overview */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                  <h2 className="text-xl font-heading font-extrabold text-[#0B1730]">
                    Conditions financières détaillées
                  </h2>

                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="py-3 flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Prix de transaction :</span>
                      <span className="font-extrabold text-slate-900 text-sm">
                        {formatCFA(property.price)} {isRental ? '/mois' : ''}
                      </span>
                    </div>

                    {property.chargesMonthly && (
                      <div className="py-3 flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Charges mensuelles estimées :</span>
                        <span className="font-bold text-slate-800 text-sm">
                          {formatCFA(property.chargesMonthly)} /mois
                        </span>
                      </div>
                    )}

                    {property.agencyFees && (
                      <div className="py-3 flex items-center justify-between">
                        <span className="text-slate-600 font-medium">Honoraires d’agence MusaTech :</span>
                        <span className="font-bold text-slate-800 text-sm">
                          {formatCFA(property.agencyFees)}
                        </span>
                      </div>
                    )}

                    {!isRental && (
                      <div className="py-3 flex items-center justify-between">
                        <span className="text-slate-600 font-medium">
                          Droits d’enregistrement & émoluments notaire (est. ~7.5%) :
                        </span>
                        <span className="font-bold text-slate-800 text-sm">
                          {formatCFA(estimatedNotaryFees)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: FINANCIAL & MORTGAGE SIMULATOR */}
            {activeTab === 'simulator' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0B1730] text-[#19B8CD] flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-extrabold text-[#0B1730]">
                      Simulateur d’emprunt & plan de financement
                    </h2>
                    <p className="text-xs text-slate-500">
                      Estimez vos mensualités indicatives pour l’acquisition de ce bien à Dakar.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Controls */}
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Apport personnel : {downPaymentPercent}% ({formatCFA(downPaymentAmount)})
                      </label>
                      <div className="flex items-center gap-2">
                        {[10, 20, 30, 40].map((pct) => (
                          <button
                            type="button"
                            key={pct}
                            onClick={() => setDownPaymentPercent(pct)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              downPaymentPercent === pct
                                ? 'bg-[#0B1730] text-white border-[#0B1730] shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1.5">
                        Durée du prêt : {loanDurationYears} ans ({totalMonths} mois)
                      </label>
                      <div className="flex items-center gap-2">
                        {[5, 10, 15, 20].map((years) => (
                          <button
                            type="button"
                            key={years}
                            onClick={() => setLoanDurationYears(years)}
                            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              loanDurationYears === years
                                ? 'bg-[#0B1730] text-white border-[#0B1730] shadow-xs'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {years} ans
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-500 space-y-1">
                      <div className="flex items-center justify-between font-medium">
                        <span>Taux d’intérêt bancaire indicatif (UEMOA) :</span>
                        <span className="font-bold text-slate-800">{interestRatePercent}% /an</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Basé sur les barèmes moyens des banques partenaires de la place dakaroise (SGBS, CBAO, BOA, Ecobank).
                      </p>
                    </div>
                  </div>

                  {/* Results box */}
                  <div className="bg-[#0B1730] text-white rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-xl">
                    <div className="space-y-4">
                      <span className="text-[11px] uppercase tracking-wider text-[#19B8CD] font-bold">
                        Résultats de la simulation
                      </span>

                      <div>
                        <span className="text-xs text-slate-400 block font-medium">
                          Mensualité estimée :
                        </span>
                        <div className="text-2xl sm:text-3xl font-heading font-extrabold text-[#19B8CD] mt-1">
                          {formatCFA(estimatedMonthlyPayment)}
                          <span className="text-xs font-normal text-slate-300"> /mois</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-700/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Montant emprunté :</span>
                          <span className="font-bold text-white">{formatCFA(loanAmount)}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Apport personnel :</span>
                          <span className="font-bold text-white">{formatCFA(downPaymentAmount)}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Frais de notaire estimés (~7.5%) :</span>
                          <span className="font-bold text-[#19B8CD]">{formatCFA(estimatedNotaryFees)}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 italic">
                      * Calcul indicatif sans valeur contractuelle fourni à titre d’exemple de simulation pour la démonstration MusaTech.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Booking Card & Real Estate Advisor */}
          <aside className="lg:col-span-1 space-y-6 lg:sticky lg:top-28">
            {/* Main Visit Booking Conversion Card */}
            <div className="bg-[#0B1730] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#19B8CD] flex items-center gap-1.5">
                  <CalendarCheck className="w-4 h-4" />
                  Service Visite Privée
                </span>
                <h3 className="text-xl font-heading font-extrabold text-white">
                  Intéressé par ce bien ?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Planifiez une visite exclusive avec notre conseiller référent à votre meilleure convenance.
                </p>
              </div>

              <div className="p-4 bg-[#172A46] rounded-2xl border border-slate-700/80 space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#19B8CD] shrink-0" />
                  <span>Visite physique sur place à Dakar</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#19B8CD] shrink-0" />
                  <span>Visite vidéo WhatsApp pour la diaspora</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#19B8CD] shrink-0" />
                  <span>Dossier cadastral complet fourni</span>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <Button
                  variant="cyan"
                  size="lg"
                  className="w-full font-extrabold shadow-lg hover:shadow-cyan-500/20"
                  onClick={() => onBookVisit(property)}
                  leftIcon={<CalendarCheck className="w-4 h-4 text-slate-950" />}
                >
                  Demander une visite
                </Button>

                {onOpenAdvisorModal && (
                  <Button
                    variant="outline-dark"
                    size="md"
                    className="w-full"
                    onClick={onOpenAdvisorModal}
                    leftIcon={<HelpCircle className="w-4 h-4 text-[#19B8CD]" />}
                  >
                    Parler à un conseiller
                  </Button>
                )}
              </div>
            </div>

            {/* Dedicated Real Estate Advisor Card */}
            {property.agent && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Conseiller Immobilier Dédié
                  </span>
                  <BadgeCheck className="w-4 h-4 text-[#19B8CD]" />
                </div>

                <div className="flex items-center gap-3.5">
                  <img
                    src={property.agent.avatar}
                    alt={property.agent.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
                  />
                  <div>
                    <h4 className="font-heading font-extrabold text-base text-slate-900">
                      {property.agent.name}
                    </h4>
                    <p className="text-xs text-slate-500">{property.agent.title}</p>
                    <p className="text-[11px] text-[#19B8CD] font-bold mt-0.5">
                      MusaTech Prestige Dakar
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 text-xs font-bold">
                  {/* WhatsApp Direct CTA */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp direct</span>
                  </a>

                  {/* Phone Call */}
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#19B8CD]" />
                    <span>{property.agent.phone}</span>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${property.agent.email}?subject=Demande d'informations concernant le bien ${reference}`}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{property.agent.email}</span>
                  </a>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Inline Visit Booking Callout */}
        <section
          aria-label="Planifier une visite"
          className="bg-gradient-to-br from-[#0B1730] to-[#172A46] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#19B8CD] flex items-center justify-center md:justify-start gap-1.5">
              <CalendarCheck className="w-4 h-4" />
              Rendez-vous de visite personnalisé
            </span>
            <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
              Souhaitez-vous visiter ce bien d’exception ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Planifiez une visite privée sur place à Dakar ou une visite guidée en direct vidéo WhatsApp pour les acquéreurs de la diaspora. Dossier cadastral remis lors du rendez-vous.
            </p>
          </div>
          <Button
            variant="cyan"
            size="lg"
            className="font-extrabold shrink-0 shadow-lg hover:shadow-cyan-500/20"
            onClick={() => onBookVisit(property)}
            leftIcon={<CalendarCheck className="w-4 h-4 text-slate-950" />}
          >
            Demander une visite
          </Button>
        </section>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <section
            aria-label="Biens immobiliers similaires à Dakar"
            className="pt-12 border-t border-slate-200 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#19B8CD]">
                  Opportunités associées
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#0B1730]">
                  Biens similaires à Dakar
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Découvrez d’autres propriétés de prestige situées à {property.neighborhood} ou aux caractéristiques comparables.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateTo('catalog')}
                rightIcon={<ArrowLeft className="w-3.5 h-3.5 rotate-180" />}
              >
                Explorer tout le catalogue
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  onBookVisit={onBookVisit}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
