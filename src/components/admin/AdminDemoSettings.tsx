import React from 'react'
import {
  RotateCcw,
  Database,
  ShieldAlert,
  HardDrive,
  Info,
  CheckCircle2,
  Sparkles,
  Server,
  Lock,
  FileCheck,
  Cpu,
} from 'lucide-react'
import { useApp } from '../../context/useApp'

export const AdminDemoSettings: React.FC = () => {
  const { properties, requests, resetDemoData } = useApp()

  const handleReset = () => {
    if (
      window.confirm(
        'Voulez-vous restaurer les données initiales de démonstration ?\n\nToutes les modifications, ajouts ou suppressions locales seront réinitialisés avec le jeu officiel de 19 biens et 7 demandes de visite.'
      )
    ) {
      resetDemoData()
    }
  }

  // Calculate approximate storage size in localStorage
  const storageDetails = () => {
    try {
      let totalBytes = 0
      for (const key in localStorage) {
        if (key.startsWith('musatech_')) {
          totalBytes += (localStorage.getItem(key) || '').length * 2
        }
      }
      return `${Math.round(totalBytes / 1024)} Ko`
    } catch {
      return 'N/A'
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── Intro Header ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#19B8CD]/20 text-[#0f8291]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Environnement de Démonstration MusaTech</span>
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-[#0B1730]">
          Persistance, Sécurité & Architecture de Démonstration
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl">
          Cette application fonctionne en autonomie complète côté client grâce au stockage local HTML5 (`localStorage`). Elle permet aux agences et promoteurs de manipuler l'ensemble des parcours métier (création de biens, réservation de visites, traitement de prospects) sans dépendance réseau.
        </p>
      </div>

      {/* ── Storage Metrics Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Properties */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
            <Database className="w-4 h-4 text-[#19B8CD]" />
            <span>Biens enregistrés</span>
          </div>
          <div className="text-2xl font-heading font-extrabold text-[#0B1730]">
            {properties.length}
          </div>
          <p className="text-[11px] text-slate-500 font-mono truncate">
            Clé : musatech_immo_properties_v1
          </p>
        </div>

        {/* Requests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
            <HardDrive className="w-4 h-4 text-amber-500" />
            <span>Demandes & Prospects</span>
          </div>
          <div className="text-2xl font-heading font-extrabold text-[#0B1730]">
            {requests.length}
          </div>
          <p className="text-[11px] text-slate-500 font-mono truncate">
            Clé : musatech_immo_requests_v1
          </p>
        </div>

        {/* Volume Size */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
            <Info className="w-4 h-4 text-emerald-500" />
            <span>Empreinte navigateur</span>
          </div>
          <div className="text-2xl font-heading font-extrabold text-[#0B1730]">
            {storageDetails()}
          </div>
          <p className="text-[11px] text-slate-500">
            Stockage client isolé par domaine
          </p>
        </div>
      </div>

      {/* ── Reset Demo Data Action Box ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-base text-[#0B1730] flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-500" />
              Réinitialisation des Données de Démonstration
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              Si vous avez modifié des biens, ajouté des annonces ou changé le statut de demandes lors de votre évaluation et désirez repartir sur une démonstration commerciale propre, restaurez le jeu d'essai officiel.
            </p>
          </div>
          <span className="hidden sm:inline-flex text-[11px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200 shrink-0">
            19 biens • 7 demandes
          </span>
        </div>

        <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl text-xs text-rose-900 space-y-3">
          <p className="leading-relaxed">
            <strong>Impact :</strong> Cette opération réinitialise le stockage local du navigateur et recharge les 19 biens certifiés Dakar (Almadies, Mamelles, Ngor, Point E, Mermoz, Plateau, Sacré-Cœur) et les 7 demandes de visite réparties sur les 5 statuts canoniques.
          </p>
          <button
            onClick={handleReset}
            className="py-2.5 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restaurer les données d’origine (19 biens + 7 demandes)</span>
          </button>
        </div>
      </div>

      {/* ── Comparative Architecture Matrix (Demo vs Production) ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 mb-2">
            <Cpu className="w-3.5 h-3.5 text-[#19B8CD]" />
            <span>Gouvernance & Sécurité</span>
          </div>
          <h3 className="font-heading font-bold text-lg text-[#0B1730]">
            Matrice Comparée : Démonstration Actuelle vs Déploiement Production
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Détail des composants techniques locaux et de leur équivalent sécurisé en environnement de production réelle.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Pôle Architectural</th>
                <th className="py-3 px-4">Solution en Démonstration Actuelle</th>
                <th className="py-3 px-4">Spécification pour la Production</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-[#19B8CD]" />
                  <span>Persistance des données</span>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  HTML5 <code>localStorage</code> synchrone par navigateur, sérialisation JSON avec migration de schéma.
                </td>
                <td className="py-3 px-4 text-slate-900 font-medium">
                  Base relationnelle PostgreSQL managée avec ORM Prisma, transactions ACID et sauvegardes automatiques.
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Authentification & Sessions</span>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Simulation d'état de session locale pour évaluation fluide (aucun secret ni mot de passe en clair dans le code).
                </td>
                <td className="py-3 px-4 text-slate-900 font-medium">
                  Tokens JWT en cookies sécurisés <code>HttpOnly SameSite=Strict</code>, hash Argon2id/bcrypt, gestion de rôles RBAC et 2FA optionnel.
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Hébergement des Médias</span>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Sélection parmi des visuels modèles haute résolution hébergés sur CDN et saisie d'URLs personnalisées.
                </td>
                <td className="py-3 px-4 text-slate-900 font-medium">
                  Upload direct présigné vers stockage objet cloud (AWS S3, Cloudinary ou Supabase Storage) avec compression WebP et CDN mondial.
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-sky-500" />
                  <span>Validation & Sécurité Entrées</span>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Validation TypeScript stricte côté client (téléphones 9 chiffres sénégalais & diaspora, prix/surfaces strictement positifs).
                </td>
                <td className="py-3 px-4 text-slate-900 font-medium">
                  Validation bidirectionnelle (Zod côté serveur), assainissement anti-XSS, protection CSRF et pare-feu d'application Web (WAF).
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Notifications & Messagerie</span>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Toasts interactifs in-app et liens directs pré-formatés <code>tel:</code>, <code>mailto:</code> et WhatsApp.
                </td>
                <td className="py-3 px-4 text-slate-900 font-medium">
                  Envoi transactionnel d'emails (Resend / SendGrid), SMS de confirmation et intégration Webhook WhatsApp Cloud API.
                </td>
              </tr>

              <tr>
                <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500" />
                  <span>Traçabilité & Audit</span>
                </td>
                <td className="py-3 px-4 text-slate-600">
                  Tableau <code>statusHistory</code> persistant horodatant chaque transition d'état et note de gestionnaire.
                </td>
                <td className="py-3 px-4 text-slate-900 font-medium">
                  Table d'audit immuable en base de données consignant l'utilisateur authentifié, l'adresse IP, le User-Agent et le timestamp UTC.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Security Transparency Notice ── */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span>Avertissement de Transparence MusaTech</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Le stockage <code>localStorage</code> ne constitue pas une base de données multi-utilisateurs sécurisée. Il est strictement employé ici pour permettre une démonstration autonome, persistante sur votre machine et sans latence serveur. Aucun secret, token privé ou coordonnée personnelle sensible réelle n'est conservé dans ce référentiel.
        </p>
      </div>
    </div>
  )
}
