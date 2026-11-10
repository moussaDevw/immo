import React from 'react'
import { ShieldCheck, Video, CheckCircle2, FileSearch, Sparkles } from 'lucide-react'
import { Container } from '../ui/Container'

export const WhyPlatformSection: React.FC = () => {
  const benefits = [
    {
      icon: <FileSearch className="w-6 h-6 text-[#19B8CD]" />,
      title: 'Vérification Cadastrale Explicite',
      description:
        'Chaque annonce mentionne clairement son statut juridique : Titre Foncier (TF) individuel, bail ou droit réel, pour un investissement sans mauvaise surprise.',
      points: [
        'Statut juridique explicité sur chaque fiche',
        'Contrôle préalable des pièces cadastrales',
      ],
    },
    {
      icon: <Video className="w-6 h-6 text-[#19B8CD]" />,
      title: 'Visites Adaptées à la Diaspora',
      description:
        'Que vous soyez à Dakar, Paris, Montréal ou New York, choisissez entre une visite présentielle sur place ou une visite guidée en vidéo WhatsApp interactive.',
      points: [
        'Créneaux horaires adaptés aux fuseaux GMT et diaspora',
        'Compte-rendu direct avec un conseiller dédié',
      ],
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#19B8CD]" />,
      title: 'Transparence des Tarifs en FCFA',
      description:
        'Montants affichés en Francs CFA (XOF) certifiés sans frais dissimulés, avec distinction claire entre loyer charges comprises et prix net vendeur.',
      points: [
        'Prix réels sans commissions occultes',
        'Détail des surfaces, chambres et prestations',
      ],
    },
  ]

  return (
    <section
      aria-labelledby="why-platform-title"
      className="py-16 sm:py-24 bg-white border-t border-slate-200"
    >
      <Container size="lg">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1499ab]">
            <Sparkles className="w-3.5 h-3.5" />
            Engagements Pratiques
          </div>
          <h2
            id="why-platform-title"
            className="text-2xl sm:text-4xl font-heading font-extrabold text-[#0B1730] tracking-tight"
          >
            Pourquoi Choisir MusaTech Real Estate ?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Une expérience immobilière rigoureuse conçue pour apporter clarté, traçabilité et réactivité aux acquéreurs et locataires à Dakar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0B1730] flex items-center justify-center shadow-xs">
                  {benefit.icon}
                </div>
                <h3 className="font-heading font-extrabold text-lg text-[#0B1730]">
                  {benefit.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              <ul className="space-y-2 pt-4 border-t border-slate-200/80 text-xs text-slate-700">
                {benefit.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#1499ab] shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

