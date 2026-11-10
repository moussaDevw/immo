import React, { useEffect, useRef, useState } from 'react'
import {
  Building2,
  Sparkles,
  Check,
  Star,
  CloudUpload,
  AlertCircle,
  MapPin,
  Coins,
  Image as ImageIcon,
  FileText,
  BedDouble,
  Bath,
  Car,
  Maximize2,
  Eye,
  ArrowRight,
  ArrowLeft,
  Waves,
  Compass,
  Zap,
  ShieldCheck,
  Wind,
  ArrowUpDown,
  Wifi,
  Trees,
  Sun,
  Cpu,
  FileCheck2,
  Plus,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import type { DakarNeighborhood, Property, PropertyStatus, PropertyType, TransactionType } from '../../types'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'

interface PropertyFormModalProps {
  propertyToEdit?: Property | null
  onClose: () => void
}

const PRESET_IMAGES = [
  {
    label: 'Villa de prestige avec piscine',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
    type: 'villa',
  },
  {
    label: 'Villa contemporaine avec jardin',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    type: 'villa',
  },
  {
    label: 'Penthouse panoramique vue mer',
    url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
    type: 'apartment',
  },
  {
    label: 'Appartement standing lumineux',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
    type: 'apartment',
  },
  {
    label: 'Plateau de bureaux corporate',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    type: 'office',
  },
  {
    label: 'Parcelle foncière viabilisée',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    type: 'land',
  },
]

const ALL_AMENITIES = [
  'Piscine',
  'Vue mer',
  'Groupe électrogène',
  'Gardiennage 24/7',
  'Climatisation centrale',
  'Parking sous-sol',
  'Ascenseur',
  'Fibre optique',
  'Jardin paysager',
  'Terrasse panoramique',
  'Domotique',
  'Titre Foncier individuel',
]

const AMENITY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Piscine: Waves,
  'Vue mer': Compass,
  'Groupe électrogène': Zap,
  'Gardiennage 24/7': ShieldCheck,
  'Climatisation centrale': Wind,
  'Parking sous-sol': Car,
  Ascenseur: ArrowUpDown,
  'Fibre optique': Wifi,
  'Jardin paysager': Trees,
  'Terrasse panoramique': Sun,
  Domotique: Cpu,
  'Titre Foncier individuel': FileCheck2,
}

const SUGGESTED_HIGHLIGHTS = [
  'Titre Foncier individuel net de toute charge',
  'Groupe électrogène automatique 60 kVA',
  'Piscine miroir en pierre naturelle',
  'Quartier diplomatique ultra-sécurisé',
  'Finitions marbre & menuiserie aluminium double vitrage',
]

const STEPS = [
  {
    id: 1,
    title: 'Localisation',
    short: 'Lieu',
    subtitle: 'Titre & quartier',
    icon: MapPin,
  },
  {
    id: 2,
    title: 'Prix & Surfaces',
    short: 'Prix',
    subtitle: 'Tarifs & métriques',
    icon: Coins,
  },
  {
    id: 3,
    title: 'Photos & Médias',
    short: 'Photos',
    subtitle: 'Aperçu haute définition',
    icon: ImageIcon,
  },
  {
    id: 4,
    title: 'Description',
    short: 'Détails',
    subtitle: 'Équipements & texte',
    icon: FileText,
  },
]

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  propertyToEdit,
  onClose,
}) => {
  const { createProperty, editProperty, adminUser } = useApp()

  const isEditing = Boolean(propertyToEdit)

  // Step state
  const [currentStep, setCurrentStep] = useState<number>(1)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Remonte en haut de la zone défilante à chaque changement d'étape
  useEffect(() => {
    if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0
  }, [currentStep])

  // Form State (Preserved automatically across validation attempts)
  const [title, setTitle] = useState(propertyToEdit?.title || '')
  const [transactionType, setTransactionType] = useState<TransactionType>(
    propertyToEdit?.transactionType || 'sale'
  )
  const [propertyType, setPropertyType] = useState<PropertyType>(
    propertyToEdit?.propertyType || 'villa'
  )
  const [neighborhood, setNeighborhood] = useState<DakarNeighborhood>(
    propertyToEdit?.neighborhood || 'Almadies'
  )
  const [addressLabel, setAddressLabel] = useState(propertyToEdit?.addressLabel || '')
  const [price, setPrice] = useState<number | ''>(propertyToEdit?.price ?? '')
  const [surface, setSurface] = useState<number | ''>(propertyToEdit?.surface ?? '')
  const [bedrooms, setBedrooms] = useState<number | ''>(
    propertyToEdit ? propertyToEdit.bedrooms : 4
  )
  const [bathrooms, setBathrooms] = useState<number | ''>(
    propertyToEdit ? propertyToEdit.bathrooms : 3
  )
  const [parkingSpots, setParkingSpots] = useState<number | ''>(
    propertyToEdit?.parkingSpots ?? 2
  )
  const [status, setStatus] = useState<PropertyStatus>(
    propertyToEdit?.status || 'published'
  )
  const [featured, setFeatured] = useState<boolean>(
    propertyToEdit?.featured ?? false
  )
  const [imageUrl, setImageUrl] = useState(
    propertyToEdit?.images[0] || PRESET_IMAGES[0].url
  )
  const [imageError, setImageError] = useState(false)

  const [description, setDescription] = useState(
    propertyToEdit?.description || ''
  )
  const [highlightsInput, setHighlightsInput] = useState(
    propertyToEdit?.highlights?.join('\n') || ''
  )
  const [amenities, setAmenities] = useState<string[]>(
    propertyToEdit?.amenities || [
      'Piscine',
      'Groupe électrogène',
      'Gardiennage 24/7',
      'Climatisation centrale',
    ]
  )

  const [errorMessage, setErrorMessage] = useState('')

  // Handle property type changes with land consistency
  const handlePropertyTypeChange = (newType: PropertyType) => {
    setPropertyType(newType)
    if (newType === 'land') {
      setBedrooms(0)
      setBathrooms(0)
      setParkingSpots(0)
      setImageUrl(PRESET_IMAGES.find((p) => p.type === 'land')?.url || imageUrl)
      setImageError(false)
    } else if (newType === 'office') {
      setBedrooms(0)
      setBathrooms(2)
      setParkingSpots(4)
      setImageUrl(PRESET_IMAGES.find((p) => p.type === 'office')?.url || imageUrl)
      setImageError(false)
    }
  }

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    )
  }

  const handleSelectPreset = (url: string) => {
    setImageUrl(url)
    setImageError(false)
  }

  const handleGenerateDescription = () => {
    const typeLabel =
      propertyType === 'villa'
        ? 'villa contemporaine d’architecte'
        : propertyType === 'apartment'
        ? 'appartement de grand standing'
        : propertyType === 'office'
        ? 'plateau de bureaux corporate'
        : propertyType === 'land'
        ? 'parcelle foncière viabilisée'
        : 'propriété d’exception'

    const surfText = surface ? `d’une superficie de ${surface} m²` : 'aux volumes généreux'
    const roomsText =
      propertyType !== 'land' && Number(bedrooms) > 0
        ? ` comprenant ${bedrooms} chambres lumineuses et ${bathrooms || 2} salles d’eau`
        : ''

    setDescription(
      `Idéalement située dans le secteur prisé de ${neighborhood} à Dakar, cette ${typeLabel} ${surfText}${roomsText} offre des finitions haut de gamme, une sécurité optimale 24h/24 et une accessibilité immédiate aux commodités diplomatiques et commerciales.`
    )
  }

  const handleToggleHighlight = (item: string) => {
    const lines = highlightsInput
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)

    if (lines.includes(item)) {
      setHighlightsInput(lines.filter((l) => l !== item).join('\n'))
    } else {
      setHighlightsInput([...lines, item].join('\n'))
    }
  }

  const validateStep = (step: number): boolean => {
    setErrorMessage('')
    if (step === 1) {
      if (!title.trim()) {
        setErrorMessage('Le titre de l’annonce est obligatoire.')
        return false
      }
      if (!addressLabel.trim()) {
        setErrorMessage('Veuillez préciser le repère ou quartier d’implantation à Dakar.')
        return false
      }
    } else if (step === 2) {
      const numPrice = Number(price)
      if (!price || isNaN(numPrice) || numPrice <= 0) {
        setErrorMessage('Le prix doit être un nombre strictement positif en Francs CFA (XOF).')
        return false
      }
      const numSurface = Number(surface)
      if (!surface || isNaN(numSurface) || numSurface <= 0) {
        setErrorMessage('La surface doit être strictement supérieure à 0 m².')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(4, prev + 1))
    }
  }

  const handlePrev = () => {
    setErrorMessage('')
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    // Strict Validation
    if (!title.trim()) {
      setCurrentStep(1)
      setErrorMessage('Le titre de l’annonce est obligatoire.')
      return
    }

    if (!addressLabel.trim()) {
      setCurrentStep(1)
      setErrorMessage('Veuillez préciser le repère ou quartier d’implantation à Dakar.')
      return
    }

    const numPrice = Number(price)
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      setCurrentStep(2)
      setErrorMessage('Le prix doit être un nombre strictement positif en Francs CFA (XOF).')
      return
    }

    const numSurface = Number(surface)
    if (!surface || isNaN(numSurface) || numSurface <= 0) {
      setCurrentStep(2)
      setErrorMessage('La surface doit être strictement supérieure à 0 m².')
      return
    }

    const highlights = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean)

    if (isEditing && propertyToEdit) {
      editProperty({
        ...propertyToEdit,
        title: title.trim(),
        transactionType,
        propertyType,
        neighborhood,
        addressLabel: addressLabel.trim(),
        price: numPrice,
        currency: 'XOF',
        surface: numSurface,
        bedrooms: propertyType === 'land' ? 0 : bedrooms === '' ? 0 : Number(bedrooms),
        bathrooms: propertyType === 'land' ? 0 : bathrooms === '' ? 1 : Number(bathrooms),
        parkingSpots: propertyType === 'land' ? 0 : parkingSpots === '' ? 0 : Number(parkingSpots),
        status,
        featured,
        images: [imageUrl, ...(propertyToEdit.images.slice(1) || [])],
        description: description.trim() || 'Propriété de standing sélectionnée par MusaTech Real Estate à Dakar.',
        highlights: highlights.length > 0 ? highlights : propertyToEdit.highlights,
        amenities,
      })
    } else {
      const rand = Math.floor(1000 + Math.random() * 9000)
      const prefix = neighborhood.substring(0, 3).toUpperCase()
      const reference = `MT-${prefix}-2026-${rand}`
      const slug =
        title
          .trim()
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '') || `bien-${Date.now()}`

      createProperty({
        title: title.trim(),
        slug,
        reference,
        transactionType,
        propertyType,
        currency: 'XOF',
        neighborhood,
        city: 'Dakar',
        addressLabel: addressLabel.trim(),
        price: numPrice,
        surface: numSurface,
        bedrooms: propertyType === 'land' ? 0 : bedrooms === '' ? 0 : Number(bedrooms),
        bathrooms: propertyType === 'land' ? 0 : bathrooms === '' ? 1 : Number(bathrooms),
        parkingSpots: propertyType === 'land' ? 0 : parkingSpots === '' ? 0 : Number(parkingSpots),
        featured,
        status,
        images: [imageUrl],
        description:
          description.trim() || 'Superbe opportunité immobilière à Dakar, présentée par MusaTech Real Estate.',
        highlights:
          highlights.length > 0
            ? highlights
            : ['Localisation prestigieuse', 'Prestations soignées', 'Titre foncier vérifié'],
        amenities,
        agent: {
          name: adminUser.name,
          title: adminUser.role,
          phone: '+221 77 450 12 34',
          email: adminUser.email,
          avatar: adminUser.avatar,
        },
      })
    }

    onClose()
  }

  // Formatted price for live preview
  const formattedPrice =
    typeof price === 'number' && price > 0
      ? `${new Intl.NumberFormat('fr-FR').format(price)} FCFA${
          transactionType === 'rent' ? ' / mois' : ''
        }`
      : 'Prix sur demande'

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      size="xl"
      layout="panel"
      title={isEditing ? `Modifier l’annonce : ${propertyToEdit?.reference}` : 'Publier une nouvelle annonce'}
      description="Renseignez les caractéristiques techniques, financières et juridiques du bien immobilier."
    >
      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0" noValidate={false}>
        {/* ============================================================== */}
        {/* EN-TÊTE FIXE : MENU DES ÉTAPES + BARRE DE PROGRESSION           */}
        {/* ============================================================== */}
        <div className="shrink-0 px-4 sm:px-6 pt-3 pb-3 border-b border-slate-100 bg-white">
          <nav aria-label="Étapes de saisie du bien">
            <ol className="grid grid-cols-4 gap-1 sm:gap-2">
              {STEPS.map((step) => {
                const Icon = step.icon
                const isActive = currentStep === step.id
                const isCompleted =
                  (step.id === 1 && Boolean(title.trim() && addressLabel.trim())) ||
                  (step.id === 2 && Boolean(price && Number(price) > 0 && surface && Number(surface) > 0)) ||
                  (step.id === 3 && Boolean(imageUrl)) ||
                  (step.id === 4 && Boolean(description.trim()))

                return (
                  <li key={step.id} className="min-w-0">
                    <button
                      type="button"
                      aria-current={isActive ? 'step' : undefined}
                      onClick={() => {
                        setErrorMessage('')
                        setCurrentStep(step.id)
                      }}
                      className={`w-full flex flex-col sm:flex-row items-center gap-1 sm:gap-2.5 px-1 py-1.5 sm:px-2.5 sm:py-2 rounded-xl text-center sm:text-left transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#19B8CD] ${
                        isActive
                          ? 'bg-slate-50 text-slate-900 ring-1 ring-[#19B8CD]/40'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-[#0B1730] text-[#19B8CD]'
                            : isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isCompleted && !isActive ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </span>

                      <span className="min-w-0 w-full">
                        <span className="block text-[10px] sm:text-xs font-bold truncate">
                          <span className="sm:hidden">{step.short}</span>
                          <span className="hidden sm:inline">
                            {step.id}. {step.title}
                          </span>
                        </span>
                        <span className="hidden md:block text-[10px] font-medium text-slate-400 truncate">
                          {step.subtitle}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </nav>

          {/* Barre de progression */}
          <div
            className="mt-2.5 h-1 rounded-full bg-slate-100 overflow-hidden"
            role="progressbar"
            aria-label="Progression de la saisie"
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
            aria-valuenow={currentStep}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#19B8CD] to-[#0B1730] transition-all duration-300"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* CORPS DÉFILANT : CONTENU DE L'ÉTAPE ACTIVE                      */}
        {/* ============================================================== */}
        <div
          ref={scrollAreaRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 space-y-4 bg-white"
        >
        {/* Error Alert with Preservation Note */}
        {errorMessage && (
          <div
            role="alert"
            className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2.5 shadow-xs animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold">Erreur de validation :</strong>
              <span>{errorMessage} (Vos modifications ont été conservées dans le formulaire).</span>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ÉTAPE 1: LOCALISATION                                          */}
        {/* ============================================================== */}
        <div className={currentStep === 1 ? 'block' : 'hidden'}>
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3 sm:p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/80">
              <div className="w-7 h-7 rounded-lg bg-[#19B8CD]/15 text-[#0d7986] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-[#19B8CD]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  Étape 1 sur 4 : Identification & Localisation
                </h3>
                <p className="text-[11px] text-slate-500">
                  Définissez le titre de l'annonce, le type d'opération et le secteur dakarois
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Title */}
              <Input
                label="Titre de l’annonce *"
                placeholder="Ex: Villa contemporaine avec piscine miroir aux Almadies"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {/* Transaction, Property Type, Neighborhood */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                  label="Type de transaction *"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                  options={[
                    { value: 'sale', label: 'À Vendre' },
                    { value: 'rent', label: 'À Louer' },
                  ]}
                />

                <Select
                  label="Catégorie de bien *"
                  value={propertyType}
                  onChange={(e) => handlePropertyTypeChange(e.target.value as PropertyType)}
                  options={[
                    { value: 'villa', label: 'Villa' },
                    { value: 'apartment', label: 'Appartement' },
                    { value: 'office', label: 'Bureaux d’affaires' },
                    { value: 'land', label: 'Terrain constructible' },
                    { value: 'other', label: 'Autre bien' },
                  ]}
                />

                <Select
                  label="Quartier à Dakar *"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value as DakarNeighborhood)}
                  options={[
                    { value: 'Almadies', label: 'Almadies' },
                    { value: 'Ngor', label: 'Ngor' },
                    { value: 'Mamelles', label: 'Mamelles' },
                    { value: 'Point E', label: 'Point E' },
                    { value: 'Mermoz', label: 'Mermoz' },
                    { value: 'Plateau', label: 'Plateau' },
                    { value: 'Sacré-Cœur', label: 'Sacré-Cœur' },
                  ]}
                />
              </div>

              {/* Address Label */}
              <Input
                label="Emplacement / Repère géographique indicatif *"
                placeholder="Ex: Zone Résidentielle des Almadies, près de la Corniche"
                value={addressLabel}
                onChange={(e) => setAddressLabel(e.target.value)}
                helperText="Indication générale pour les acquéreurs (ne pas renseigner de numéro de parcelle privé)."
                required
              />
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ÉTAPE 2: TARIFS & SURFACES                                     */}
        {/* ============================================================== */}
        <div className={currentStep === 2 ? 'block' : 'hidden'}>
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3 sm:p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/80">
              <div className="w-7 h-7 rounded-lg bg-[#0B1730]/10 text-[#0B1730] flex items-center justify-center shrink-0">
                <Coins className="w-4 h-4 text-[#19B8CD]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  Étape 2 sur 4 : Tarification & Spécifications Clés
                </h3>
                <p className="text-[11px] text-slate-500">
                  Prix en Francs CFA, surface et caractéristiques techniques du bien
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Price & Surface */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prix en Francs CFA (XOF) * {transactionType === 'rent' ? '(par mois)' : ''}
                  </label>
                  <div className="relative rounded-xl">
                    <input
                      type="number"
                      min="1"
                      step="1000"
                      placeholder={transactionType === 'rent' ? 'Ex: 1800000' : 'Ex: 450000000'}
                      value={price}
                      onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 px-3.5 py-2.5 pr-14 focus:outline-none focus:ring-2 focus:ring-[#19B8CD] focus:border-transparent transition-all"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400 pointer-events-none">
                      FCFA
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Devise légale : Franc CFA (XOF / UEMOA)</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Surface (m²) *
                  </label>
                  <div className="relative rounded-xl">
                    <input
                      type="number"
                      min="1"
                      placeholder="Ex: 350"
                      value={surface}
                      onChange={(e) => setSurface(e.target.value === '' ? '' : Number(e.target.value))}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 px-3.5 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#19B8CD] focus:border-transparent transition-all"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400 pointer-events-none">
                      m²
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Surface brute privative ou foncière</p>
                </div>
              </div>

              {/* Structural Metrics */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap overflow-hidden">
                    <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                    Chambres {propertyType === 'land' ? '(N/A)' : ''}
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={propertyType === 'land'}
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm font-medium border outline-none transition-all ${
                      propertyType === 'land'
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-white border-slate-300 focus:ring-2 focus:ring-[#19B8CD] focus:border-transparent'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap overflow-hidden">
                    <Bath className="w-3.5 h-3.5 text-slate-400" />
                    Salles de bain {propertyType === 'land' ? '(N/A)' : ''}
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={propertyType === 'land'}
                    value={bathrooms}
                    onChange={(e) => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm font-medium border outline-none transition-all ${
                      propertyType === 'land'
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-white border-slate-300 focus:ring-2 focus:ring-[#19B8CD] focus:border-transparent'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-[11px] sm:text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap overflow-hidden">
                    <Car className="w-3.5 h-3.5 text-slate-400" />
                    Stationnements
                  </label>
                  <input
                    type="number"
                    min="0"
                    disabled={propertyType === 'land'}
                    value={parkingSpots}
                    onChange={(e) => setParkingSpots(e.target.value === '' ? '' : Number(e.target.value))}
                    className={`w-full px-3.5 py-2 rounded-xl text-sm font-medium border outline-none transition-all ${
                      propertyType === 'land'
                        ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-white border-slate-300 focus:ring-2 focus:ring-[#19B8CD] focus:border-transparent'
                    }`}
                  />
                </div>
              </div>

              {/* Publication Status & Featured Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <Select
                  label="Statut de publication"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                  options={[
                    { value: 'published', label: 'Publié (Visible sur le site public)' },
                    { value: 'draft', label: 'Brouillon (Masqué du site public)' },
                    { value: 'archived', label: 'Archivé (Retiré de la vente/location)' },
                  ]}
                />

                <div className="flex flex-col justify-end">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      featured
                        ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 mt-0.5 text-[#19B8CD] rounded focus:ring-[#19B8CD]"
                    />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Star
                          className={`w-4 h-4 ${
                            featured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
                          }`}
                        />
                        Mettre ce bien en avant (Featured)
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-tight">
                        Affiche cette annonce dans la section « Biens à la une » de l’accueil
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ÉTAPE 3: PHOTOS & MÉDIAS                                       */}
        {/* ============================================================== */}
        <div className={currentStep === 3 ? 'block' : 'hidden'}>
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3 sm:p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/80">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                  Étape 3 sur 4 : Photographie Principale & Aperçu
                </h3>
                <p className="text-[11px] text-slate-500">
                  Aperçu haute définition en direct et modèles photographiques
                </p>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Live Media Preview Card */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm group">
                {imageUrl && !imageError ? (
                  <img
                    src={imageUrl}
                    alt="Aperçu visuel du bien"
                    onError={() => setImageError(true)}
                    className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-102"
                  />
                ) : (
                  <div className="w-full h-40 sm:h-48 flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
                    <ImageIcon className="w-8 h-8 mb-2 text-slate-300" />
                    <p className="text-xs font-medium text-slate-600">Aperçu photographique non disponible</p>
                    <p className="text-[11px] text-slate-400">Vérifiez l’URL ou sélectionnez un modèle ci-dessous</p>
                  </div>
                )}

                {/* Live Overlay Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#0B1730]/85 text-white backdrop-blur-xs text-[10px] font-bold tracking-wide flex items-center gap-1.5 shadow-xs">
                    <Eye className="w-3 h-3 text-[#19B8CD]" />
                    Aperçu en direct
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#19B8CD] text-white text-[10px] font-bold shadow-xs">
                    {transactionType === 'sale' ? 'À Vendre' : 'À Louer'}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 pointer-events-none">
                  <div className="px-3 py-1.5 rounded-lg bg-[#0B1730]/90 text-white backdrop-blur-xs shadow-md">
                    <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                      {neighborhood} • Dakar
                    </div>
                    <div className="text-sm font-extrabold text-[#19B8CD]">{formattedPrice}</div>
                  </div>

                  {surface && (
                    <div className="px-2.5 py-1.5 rounded-lg bg-black/70 text-white backdrop-blur-xs text-xs font-bold flex items-center gap-1">
                      <Maximize2 className="w-3 h-3 text-[#19B8CD]" />
                      {surface} m²
                    </div>
                  )}
                </div>
              </div>

              {/* Image URL Input */}
              <Input
                label="Image principale (URL haute définition)"
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value)
                  setImageError(false)
                }}
              />

              {/* Presets Chips */}
              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#19B8CD]" />
                  Galerie modèle :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_IMAGES.map((preset, idx) => {
                    const isSelected = imageUrl === preset.url
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#0B1730] text-white border-[#0B1730] font-semibold shadow-xs ring-2 ring-[#19B8CD]/30'
                            : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {preset.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Transparent Demonstration Disclaimer Note */}
              <div className="p-3 bg-sky-50/80 border border-sky-200/70 rounded-xl text-xs text-sky-950 flex items-start gap-2.5 leading-relaxed">
                <CloudUpload className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold text-sky-950 block mb-0.5">
                    Gestion des médias en démonstration commerciale :
                  </strong>
                  Cette version utilise des images haute résolution hébergées sur CDN pour simuler fidèlement le rendu.
                  En production, ce sélecteur est relié à une API de téléversement cloud (ex. AWS S3, Cloudinary ou Supabase Storage) avec compression WebP et sécurisation des accès.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* ÉTAPE 4: DESCRIPTION & ÉQUIPEMENTS                             */}
        {/* ============================================================== */}
        <div className={currentStep === 4 ? 'block' : 'hidden'}>
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3 sm:p-5 space-y-4">
            <div className="flex items-center justify-between gap-2.5 pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0B1730] text-[#19B8CD] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 tracking-wide uppercase">
                    Étape 4 sur 4 : Descriptif Commercial & Équipements
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Argumentaire de vente, points forts juridiques et commodités certifiées
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-600">
                <Check className="w-3 h-3 text-[#19B8CD]" />
                {amenities.length} prestation{amenities.length > 1 ? 's' : ''} active{amenities.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Side-by-Side: Description & Commercial Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Card: Description détaillée */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex flex-col justify-between space-y-2 shadow-2xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="property-description-textarea"
                      className="text-xs font-bold text-slate-800"
                    >
                      Description détaillée
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateDescription}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#19B8CD]/10 hover:bg-[#19B8CD]/20 text-[#0d7986] text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-[#19B8CD]" />
                      Générer un descriptif
                    </button>
                  </div>

                  <Textarea
                    id="property-description-textarea"
                    rows={4}
                    placeholder="Décrivez l’agencement des pièces, les finitions, l’exposition, la sécurité et l’environnement immédiat à Dakar..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-slate-50/70"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Texte affiché sur la fiche publique</span>
                  <span>{description.trim().length} caractères</span>
                </div>
              </div>

              {/* Right Card: Points forts commerciaux */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 shadow-2xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="property-highlights-textarea"
                      className="text-xs font-bold text-slate-800"
                    >
                      Points forts commerciaux (un par ligne)
                    </label>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {
                        highlightsInput
                          .split('\n')
                          .map((h) => h.trim())
                          .filter(Boolean).length
                      }{' '}
                      atout(s)
                    </span>
                  </div>

                  <Textarea
                    id="property-highlights-textarea"
                    rows={3}
                    placeholder="Titre Foncier individuel net de toute charge&#10;Piscine miroir en pierre naturelle&#10;Groupe électrogène automatique 60 kVA"
                    value={highlightsInput}
                    onChange={(e) => setHighlightsInput(e.target.value)}
                    className="bg-slate-50/70"
                  />
                </div>

                {/* Quick-add Highlight Chips */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-semibold text-slate-400">
                    Ajout rapide d’arguments clés :
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {SUGGESTED_HIGHLIGHTS.map((item) => {
                      const activeLines = highlightsInput
                        .split('\n')
                        .map((l) => l.trim())
                        .filter(Boolean)
                      const isAdded = activeLines.includes(item)
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => handleToggleHighlight(item)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-[#0B1730] text-white border-[#0B1730]'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {isAdded ? (
                            <Check className="w-2.5 h-2.5 text-[#19B8CD]" />
                          ) : (
                            <Plus className="w-2.5 h-2.5 text-slate-400" />
                          )}
                          <span className="truncate max-w-[190px]">{item}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Upgraded Amenities Grid */}
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 space-y-2.5 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="block text-xs font-bold text-slate-800">
                    Équipements & Prestations certifiées
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Sélectionnez les équipements vérifiés disponibles sur ce bien
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setAmenities(
                        amenities.length === ALL_AMENITIES.length ? [] : [...ALL_AMENITIES]
                      )
                    }
                    className="text-[11px] font-semibold text-[#0d7986] hover:text-[#0B1730] px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    {amenities.length === ALL_AMENITIES.length
                      ? 'Tout désélectionner'
                      : 'Tout sélectionner'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {ALL_AMENITIES.map((amenity) => {
                  const checked = amenities.includes(amenity)
                  const IconComponent = AMENITY_ICONS[amenity] || Check
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-2 rounded-xl border text-left text-xs flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        checked
                          ? 'bg-[#0B1730] border-[#0B1730] text-white font-semibold shadow-xs ring-2 ring-[#19B8CD]/25'
                          : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            checked
                              ? 'bg-[#19B8CD]/20 text-[#19B8CD]'
                              : 'bg-white text-slate-400 border border-slate-200/80'
                          }`}
                        >
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate text-[11px]">{amenity}</span>
                      </div>

                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          checked
                            ? 'bg-[#19B8CD] text-[#0B1730]'
                            : 'border border-slate-300 bg-white'
                        }`}
                      >
                        {checked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        </div>
        {/* Fin du corps défilant */}

        {/* ============================================================== */}
        {/* PIED FIXE : NAVIGATION MULTI-ÉTAPES (toujours visible)         */}
        {/* ============================================================== */}
        <div className="shrink-0 px-4 sm:px-6 py-3 border-t border-slate-200 bg-slate-50/90 backdrop-blur-xs pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between gap-2">
            {/* Gauche : Précédent ou Annuler */}
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handlePrev}
                aria-label="Étape précédente"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="shrink-0"
              >
                <span className="hidden sm:inline">Précédent</span>
              </Button>
            ) : (
              <Button type="button" variant="outline" size="md" onClick={onClose} className="shrink-0">
                Annuler
              </Button>
            )}

            {/* Centre : indicateur d'étape (desktop) */}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 font-medium min-w-0">
              <span className="shrink-0">Étape {currentStep} sur 4 :</span>
              <strong className="text-slate-800 truncate">{STEPS[currentStep - 1].title}</strong>
            </div>

            {/* Droite : Enregistrer / Suivant / Créer */}
            <div className="flex items-center gap-2 justify-end min-w-0">
              {isEditing && (
                <Button
                  type="submit"
                  variant={currentStep < 4 ? 'outline' : 'primary'}
                  size="md"
                  leftIcon={<Check className="w-4 h-4 text-emerald-600" />}
                  className="min-w-0"
                >
                  <span className="sm:hidden">Enregistrer</span>
                  <span className="hidden sm:inline">Enregistrer les modifications</span>
                </Button>
              )}

              {currentStep < 4 && (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="min-w-0"
                >
                  <span className="sm:hidden">Suivant</span>
                  <span className="hidden sm:inline">Suivant : {STEPS[currentStep].title}</span>
                </Button>
              )}

              {!isEditing && (
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className={currentStep === 4 ? 'min-w-0' : 'hidden'}
                  leftIcon={<Building2 className="w-4 h-4 text-[#19B8CD]" />}
                >
                  <span className="sm:hidden">Publier le bien</span>
                  <span className="hidden sm:inline">Créer et publier le bien</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}
