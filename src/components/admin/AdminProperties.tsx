import React, { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Building2,
  Edit,
  Trash2,
  Eye,
  Archive,
  UploadCloud,
  CheckCircle2,
  Calendar,
  RotateCcw,
} from 'lucide-react'
import { useApp } from '../../context/useApp'
import { formatCFA, formatDateFR } from '../../services/storageService'
import type { DakarNeighborhood, Property, PropertyStatus, TransactionType } from '../../types'
import { PROPERTY_TYPE_LABELS, TRANSACTION_LABELS } from '../../types'
import { Button } from '../ui/Button'
import { PropertyStatusBadge } from '../ui/StatusBadge'

interface AdminPropertiesProps {
  onAddNew: () => void
  onEdit: (property: Property) => void
}

export const AdminProperties: React.FC<AdminPropertiesProps> = ({
  onAddNew,
  onEdit,
}) => {
  const { properties, editProperty, removeProperty, navigateTo } = useApp()

  const [search, setSearch] = useState('')
  const [filterNeighborhood, setFilterNeighborhood] = useState<'all' | DakarNeighborhood>('all')
  const [filterTransaction, setFilterTransaction] = useState<'all' | TransactionType>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | PropertyStatus>('all')

  const hasActiveFilters =
    search.trim() !== '' ||
    filterNeighborhood !== 'all' ||
    filterTransaction !== 'all' ||
    filterStatus !== 'all'

  const resetFilters = () => {
    setSearch('')
    setFilterNeighborhood('all')
    setFilterTransaction('all')
    setFilterStatus('all')
  }

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        const matchTitle = p.title.toLowerCase().includes(q)
        const matchRef = p.reference.toLowerCase().includes(q)
        const matchAddr = p.addressLabel.toLowerCase().includes(q)
        if (!matchTitle && !matchRef && !matchAddr) return false
      }
      if (filterNeighborhood !== 'all' && p.neighborhood !== filterNeighborhood) {
        return false
      }
      if (filterTransaction !== 'all' && p.transactionType !== filterTransaction) {
        return false
      }
      if (filterStatus !== 'all' && p.status !== filterStatus) {
        return false
      }
      return true
    })
  }, [properties, search, filterNeighborhood, filterTransaction, filterStatus])

  // Direct status change
  const handleStatusChange = (property: Property, newStatus: PropertyStatus) => {
    editProperty({ ...property, status: newStatus })
  }

  // Toggle publish / unpublish
  const handleTogglePublish = (property: Property) => {
    const nextStatus: PropertyStatus = property.status === 'published' ? 'draft' : 'published'
    handleStatusChange(property, nextStatus)
  }

  // Archive with explicit confirmation
  const handleArchive = (property: Property) => {
    const confirmed = window.confirm(
      `Confirmez-vous l’archivage de l’annonce « ${property.title} » (${property.reference}) ?\n\nElle sera masquée du site public mais restera dans l’historique administratif de l’agence.`
    )
    if (confirmed) {
      handleStatusChange(property, 'archived')
    }
  }

  // Delete with confirmation
  const handleDelete = (property: Property) => {
    const confirmed = window.confirm(
      `Êtes-vous sûr de vouloir supprimer définitivement le bien « ${property.title} » (${property.reference}) ?\n\nCette action est irréversible dans la session locale.`
    )
    if (confirmed) {
      removeProperty(property.id)
    }
  }

  const publishedCount = properties.filter((p) => p.status === 'published').length
  const draftCount = properties.filter((p) => p.status === 'draft').length
  const archivedCount = properties.filter((p) => p.status === 'archived').length

  return (
    <div className="space-y-6">
      {/* ── Action Header & Portfolio Summary ── */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-extrabold text-xl text-[#0B1730]">
              Portefeuille d’Annonces ({properties.length} biens)
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
              {publishedCount} en ligne
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gérez vos publications, modifiez les caractéristiques ou archivez les transactions conclues à Dakar.
          </p>
          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <strong>{publishedCount}</strong> publiés
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <strong>{draftCount}</strong> brouillon{draftCount > 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <strong>{archivedCount}</strong> archivé{archivedCount > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <Button
          variant="cyan"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={onAddNew}
        >
          Publier un nouveau bien
        </Button>
      </div>

      {/* ── Search and Filters Bar ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search by title / reference */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher par titre ou référence..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#19B8CD] outline-none"
            />
          </div>

          {/* Filter Quartier */}
          <div>
            <select
              aria-label="Filtrer par quartier"
              value={filterNeighborhood}
              onChange={(e) =>
                setFilterNeighborhood(e.target.value as 'all' | DakarNeighborhood)
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#19B8CD] outline-none cursor-pointer"
            >
              <option value="all">Tous les quartiers ({properties.length})</option>
              <option value="Almadies">Almadies</option>
              <option value="Ngor">Ngor</option>
              <option value="Mamelles">Mamelles</option>
              <option value="Point E">Point E</option>
              <option value="Mermoz">Mermoz</option>
              <option value="Plateau">Plateau</option>
              <option value="Sacré-Cœur">Sacré-Cœur</option>
            </select>
          </div>

          {/* Filter Transaction */}
          <div>
            <select
              aria-label="Filtrer par transaction"
              value={filterTransaction}
              onChange={(e) =>
                setFilterTransaction(e.target.value as 'all' | TransactionType)
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#19B8CD] outline-none cursor-pointer"
            >
              <option value="all">Toutes transactions</option>
              <option value="sale">Vente</option>
              <option value="rent">Location</option>
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              aria-label="Filtrer par statut"
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as 'all' | PropertyStatus)
              }
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#19B8CD] outline-none cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="published">Publiés ({publishedCount})</option>
              <option value="draft">Brouillons ({draftCount})</option>
              <option value="archived">Archivés ({archivedCount})</option>
            </select>
          </div>
        </div>

        {/* Counter & Reset Filter Link */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Affichage de <strong>{filtered.length}</strong> bien{filtered.length > 1 ? 's' : ''} sur{' '}
            <strong>{properties.length}</strong>
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-[#1499ab] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser les critères</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Desktop Properties Table (≥ 768px) ── */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Bien immobilier</th>
                <th className="py-3.5 px-4">Quartier & Type</th>
                <th className="py-3.5 px-4">Surface / Détails</th>
                <th className="py-3.5 px-4">Prix (FCFA)</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700">
                      Aucun bien ne correspond aux filtres appliqués.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Modifiez vos critères ou réinitialisez la recherche.
                    </p>
                    {hasActiveFilters && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={resetFilters}
                        className="mt-3"
                      >
                        Réinitialiser les filtres
                      </Button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isPublished = p.status === 'published'
                  const isArchived = p.status === 'archived'

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* 1. Thumbnail, Reference & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                            alt={p.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0 max-w-xs">
                            <span className="font-mono text-[10px] text-slate-400 block uppercase">
                              {p.reference}
                            </span>
                            <span
                              onClick={() => navigateTo('property-detail', p.id)}
                              className="font-bold text-slate-900 hover:text-[#1499ab] cursor-pointer truncate block"
                              title={p.title}
                            >
                              {p.title}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Neighborhood & Type */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {p.neighborhood}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {PROPERTY_TYPE_LABELS[p.propertyType]} • {TRANSACTION_LABELS[p.transactionType]}
                        </span>
                      </td>

                      {/* 3. Surface & Specs */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800 block">
                          {p.surface} m²
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {p.propertyType === 'land'
                            ? 'Parcelle foncière'
                            : p.bedrooms > 0
                            ? `${p.bedrooms} ch. • ${p.bathrooms} sdb`
                            : `${p.bathrooms} salle(s) d’eau`}
                        </span>
                      </td>

                      {/* 4. Price in FCFA */}
                      <td className="py-3 px-4">
                        <span className="font-heading font-extrabold text-slate-900 block text-xs sm:text-sm">
                          {formatCFA(p.price)}
                        </span>
                        {p.transactionType === 'rent' && (
                          <span className="text-[10px] text-slate-400">par mois</span>
                        )}
                      </td>

                      {/* 5. Status with Badge */}
                      <td className="py-3 px-4">
                        <PropertyStatusBadge status={p.status} />
                      </td>

                      {/* 6. Date */}
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {formatDateFR(p.createdAt)}
                      </td>

                      {/* 7. Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Consulter */}
                          <button
                            onClick={() => navigateTo('property-detail', p.id)}
                            title="Consulter la fiche"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#0B1730] hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label={`Consulter ${p.reference}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Modifier */}
                          <button
                            onClick={() => onEdit(p)}
                            title="Modifier l’annonce"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-[#1499ab] hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label={`Modifier ${p.reference}`}
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Publier / Dépublier */}
                          <button
                            onClick={() => handleTogglePublish(p)}
                            title={isPublished ? 'Dépublier (passer en brouillon)' : 'Publier en ligne'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isPublished
                                ? 'text-emerald-700 hover:bg-emerald-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-slate-100'
                            }`}
                            aria-label={isPublished ? `Dépublier ${p.reference}` : `Publier ${p.reference}`}
                          >
                            {isPublished ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <UploadCloud className="w-4 h-4" />
                            )}
                          </button>

                          {/* Archiver */}
                          {!isArchived && (
                            <button
                              onClick={() => handleArchive(p)}
                              title="Archiver l’annonce"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                              aria-label={`Archiver ${p.reference}`}
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          )}

                          {/* Supprimer */}
                          <button
                            onClick={() => handleDelete(p)}
                            title="Supprimer définitivement"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            aria-label={`Supprimer ${p.reference}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Responsive Cards (< 768px) ── */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400">
            <Building2 className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
            <p className="text-sm font-semibold text-slate-700">Aucun bien ne correspond aux filtres.</p>
            {hasActiveFilters && (
              <Button size="sm" variant="outline" onClick={resetFilters} className="mt-3">
                Réinitialiser les filtres
              </Button>
            )}
          </div>
        ) : (
          filtered.map((p) => {
            const isPublished = p.status === 'published'
            const isArchived = p.status === 'archived'

            return (
              <div
                key={p.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={p.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                    alt={p.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-slate-400 uppercase">
                        {p.reference}
                      </span>
                      <PropertyStatusBadge status={p.status} />
                    </div>
                    <h3
                      onClick={() => navigateTo('property-detail', p.id)}
                      className="font-bold text-xs text-slate-900 hover:text-[#1499ab] truncate mt-0.5 cursor-pointer"
                    >
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {p.neighborhood} • {PROPERTY_TYPE_LABELS[p.propertyType]} • {TRANSACTION_LABELS[p.transactionType]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <div>
                    <span className="font-heading font-extrabold text-sm text-[#0B1730]">
                      {formatCFA(p.price)}
                    </span>
                    {p.transactionType === 'rent' && (
                      <span className="text-[10px] text-slate-400 block">/mois</span>
                    )}
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <span>{p.surface} m²</span>
                    <span className="block text-[10px] text-slate-400 flex items-center justify-end gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateFR(p.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => navigateTo('property-detail', p.id)}
                    className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#1499ab]" />
                    <span>Voir</span>
                  </button>

                  <button
                    onClick={() => onEdit(p)}
                    className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-600" />
                    <span>Éditer</span>
                  </button>

                  <button
                    onClick={() => handleTogglePublish(p)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer ${
                      isPublished
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-emerald-50 text-emerald-800'
                    }`}
                  >
                    {isPublished ? (
                      <>
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>Dépublier</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Publier</span>
                      </>
                    )}
                  </button>

                  {!isArchived ? (
                    <button
                      onClick={() => handleArchive(p)}
                      className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-amber-50 text-xs font-semibold text-slate-600 hover:text-amber-800 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>Archiver</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(p)}
                      className="py-1.5 px-2 rounded-lg bg-rose-50 text-xs font-semibold text-rose-700 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Retirer</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
