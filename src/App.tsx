import React, { useState, useEffect } from 'react'
import { AppProvider } from './context/AppContext'
import { useApp } from './context/useApp'
import { StorageService } from './services/storageService'
import { Navbar } from './components/common/Navbar'
import { Footer } from './components/common/Footer'
import { Toast } from './components/common/Toast'
import { AdminAuthModal } from './components/common/AdminAuthModal'
import { AdvisorContactModal } from './components/common/AdvisorContactModal'
import { HomeView } from './components/public/HomeView'
import { CatalogView } from './components/public/CatalogView'
import { PropertyDetailView } from './components/public/PropertyDetailView'
import { AboutView } from './components/public/AboutView'
import { FavoritesView } from './components/public/FavoritesView'
import { VisitBookingModal } from './components/public/VisitBookingModal'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminDashboard } from './components/admin/AdminDashboard'
import { AdminProperties } from './components/admin/AdminProperties'
import { AdminRequests } from './components/admin/AdminRequests'
import { AdminDemoSettings } from './components/admin/AdminDemoSettings'
import { PropertyFormModal } from './components/admin/PropertyFormModal'
import { RequestDetailModal } from './components/admin/RequestDetailModal'
import type { Property, VisitRequest } from './types'
import { ShieldCheck } from 'lucide-react'

const AppContent: React.FC = () => {
  const {
    activeView,
    selectedPropertyId,
    isAdminAuthenticated,
    openAuthModal,
    navigateTo,
  } = useApp()

  // Booking modal state
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null)

  // Advisor contact modal state
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false)

  // Admin property modal state
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false)
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null)

  // Admin request modal state
  const [inspectingRequest, setInspectingRequest] = useState<VisitRequest | null>(null)

  // Dynamic SEO, Title & Robots meta management per active view
  useEffect(() => {
    let title = 'MusaTech Real Estate | Vente, Location & Visites Immobilières à Dakar'
    let isNoIndex = false

    if (activeView === 'catalog') {
      title = 'Catalogue Immobilier Dakar | MusaTech Real Estate'
    } else if (activeView === 'about') {
      title = 'À Propos & Démonstration Commerciale | MusaTech Real Estate'
    } else if (activeView === 'favorites') {
      title = 'Mes Favoris | MusaTech Real Estate Dakar'
    } else if (activeView === 'property-detail' && selectedPropertyId) {
      const prop = StorageService.getPropertyById(selectedPropertyId)
      if (prop) {
        title = `${prop.title} • ${prop.neighborhood} | MusaTech Real Estate`
      }
    } else if (activeView.startsWith('admin')) {
      title = 'Cockpit Gestionnaire Agence | MusaTech Real Estate PRO'
      isNoIndex = true
    }

    if (typeof document !== 'undefined') {
      document.title = title

      let robotsMeta = document.querySelector('meta[name="robots"]')
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta')
        robotsMeta.setAttribute('name', 'robots')
        document.head.appendChild(robotsMeta)
      }
      robotsMeta.setAttribute('content', isNoIndex ? 'noindex, nofollow' : 'index, follow')
    }
  }, [activeView, selectedPropertyId])

  const handleOpenBooking = (property: Property) => {
    setBookingProperty(property)
  }

  const handleCloseBooking = () => {
    setBookingProperty(null)
  }

  const handleOpenAdvisorModal = () => {
    setIsAdvisorModalOpen(true)
  }

  const handleCloseAdvisorModal = () => {
    setIsAdvisorModalOpen(false)
  }

  const handleAddNewProperty = () => {
    setPropertyToEdit(null)
    setIsPropertyModalOpen(true)
  }

  const handleEditProperty = (property: Property) => {
    setPropertyToEdit(property)
    setIsPropertyModalOpen(true)
  }

  const handleClosePropertyModal = () => {
    setIsPropertyModalOpen(false)
    setPropertyToEdit(null)
  }

  const handleInspectRequest = (request: VisitRequest) => {
    setInspectingRequest(request)
  }

  const handleCloseRequestModal = () => {
    setInspectingRequest(null)
  }

  const isAdminView = activeView.startsWith('admin')

  // If user requests admin view while unauthenticated, trigger auth modal and fallback
  if (isAdminView && !isAdminAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        {/* <DemoBanner /> */}
        <Navbar onOpenAdvisorModal={handleOpenAdvisorModal} />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0B1730] text-[#19B8CD] flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="font-heading font-extrabold text-xl text-[#0B1730]">
              Espace Gestionnaire Agence
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Veuillez vous identifier pour accéder au tableau de bord, au traitement des demandes de visite et à la gestion du portefeuille.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={openAuthModal}
                className="w-full py-3 px-4 rounded-xl font-heading font-bold text-xs uppercase tracking-wider text-slate-950 bg-[#19B8CD] hover:bg-[#1499ab] transition-all shadow-md cursor-pointer"
              >
                Accéder avec le compte démo
              </button>
              <button
                onClick={() => navigateTo('home')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Retourner à l’accueil public
              </button>
            </div>
          </div>
        </main>
        <Footer onOpenAdvisorModal={handleOpenAdvisorModal} />
        <AdminAuthModal />
        <AdvisorContactModal
          isOpen={isAdvisorModalOpen}
          onClose={handleCloseAdvisorModal}
        />
        <Toast />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Demo Banner */}
      {/* <DemoBanner /> */}

      {/* Admin Space or Public Site Switcher */}
      {isAdminView ? (
        <AdminLayout>
          {activeView === 'admin-dashboard' && (
            <AdminDashboard
              onAddNewProperty={handleAddNewProperty}
              onInspectRequest={handleInspectRequest}
              onEditProperty={handleEditProperty}
            />
          )}
          {activeView === 'admin-properties' && (
            <AdminProperties
              onAddNew={handleAddNewProperty}
              onEdit={handleEditProperty}
            />
          )}
          {activeView === 'admin-requests' && (
            <AdminRequests onInspectRequest={handleInspectRequest} />
          )}
          {activeView === 'admin-settings' && <AdminDemoSettings />}
        </AdminLayout>
      ) : (
        <>
          <Navbar onOpenAdvisorModal={handleOpenAdvisorModal} />

          <main className="flex-1">
            {/* View Switcher */}
            {activeView === 'home' && (
              <HomeView
                onBookVisit={handleOpenBooking}
                onOpenAdvisorModal={handleOpenAdvisorModal}
              />
            )}

            {activeView === 'catalog' && (
              <CatalogView onBookVisit={handleOpenBooking} />
            )}

            {activeView === 'property-detail' && selectedPropertyId && (
              <PropertyDetailView
                propertyId={selectedPropertyId}
                onBookVisit={handleOpenBooking}
                onOpenAdvisorModal={handleOpenAdvisorModal}
              />
            )}

            {activeView === 'about' && (
              <AboutView onOpenAdvisorModal={handleOpenAdvisorModal} />
            )}

            {activeView === 'favorites' && (
              <FavoritesView
                onBookVisit={handleOpenBooking}
                onOpenAdvisorModal={handleOpenAdvisorModal}
              />
            )}
          </main>

          <Footer onOpenAdvisorModal={handleOpenAdvisorModal} />
        </>
      )}

      {/* Global Interactive Modals */}
      <VisitBookingModal
        property={bookingProperty}
        onClose={handleCloseBooking}
      />

      <AdvisorContactModal
        isOpen={isAdvisorModalOpen}
        onClose={handleCloseAdvisorModal}
      />

      <AdminAuthModal />

      {isPropertyModalOpen && (
        <PropertyFormModal
          propertyToEdit={propertyToEdit}
          onClose={handleClosePropertyModal}
        />
      )}

      {inspectingRequest && (
        <RequestDetailModal
          request={inspectingRequest}
          onClose={handleCloseRequestModal}
        />
      )}

      {/* Notifications Toast */}
      <Toast />
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
