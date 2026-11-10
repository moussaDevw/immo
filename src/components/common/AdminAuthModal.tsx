import React, { useState } from 'react'
import {
  ShieldAlert,
  Lock,
  Mail,
  Key,
  X,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Info,
} from 'lucide-react'
import { useApp } from '../../context/useApp'

export const AdminAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginAdmin } = useApp()
  const [email, setEmail] = useState('admin@musatech.sn')
  const [password, setPassword] = useState('••••••••••••')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isAuthModalOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      loginAdmin()
    }, 300)
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        {/* Header decoration */}
        <div className="bg-[#0B1730] p-6 text-white relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-[#19B8CD] cursor-pointer"
            aria-label="Fermer la fenêtre d'authentification"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#19B8CD]/20 text-[#19B8CD] border border-[#19B8CD]/40">
              <Sparkles className="w-3.5 h-3.5" />
              Accès Démonstration Agence
            </span>
          </div>

          <h3
            id="auth-modal-title"
            className="text-xl font-heading font-extrabold tracking-tight"
          >
            Espace d’Administration
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            MusaTech Real Estate • Cockpit de pilotage & traitement des prospects
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-amber-50 border-b border-amber-200/80 p-3.5 flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 leading-relaxed">
            <strong className="font-semibold block text-amber-900">
              Mode démonstration local & temporaire
            </strong>
            Cette authentification est simulée côté navigateur pour permettre aux évaluateurs de tester l’espace d’administration sans création de compte externe. Aucun mot de passe réel n'est stocké dans le dépôt.
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Compte de démonstration
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#19B8CD] focus:border-transparent outline-none bg-slate-50 font-medium"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1"
            >
              Clé d’accès de test
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#19B8CD] focus:border-transparent outline-none bg-slate-50 font-medium"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 text-[#19B8CD]" />
              En mode démo, cliquez directement sur le bouton pour vous connecter.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Profil gestionnaire pré-configuré :</span>
            </div>
            <p className="text-[11px] text-slate-500 pl-5">
              Conseiller : <strong>Cheikh Amadou Sall</strong> (Responsable d’Agence Dakar)
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={closeAuthModal}
              className="w-1/3 py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-2.5 px-4 rounded-xl bg-[#0B1730] hover:bg-[#172A46] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#19B8CD] cursor-pointer"
            >
              {isSubmitting ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#19B8CD]" />
                  <span>Accéder à la démo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
