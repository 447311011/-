'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Globe, Shield, Sparkles, Gamepad2, Mic2, Camera,
  Heart, MessageCircle, Star, Users, ChevronRight,
  Check, ArrowRight
} from 'lucide-react'

const features = [
  {
    icon: Globe,
    title: '150+ pays',
    desc: 'Rencontres mondiales sans frontières',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: Shield,
    title: '100% sécurisé',
    desc: 'Vérification selfie & modération 24/7',
    color: 'from-hilunia-violet to-hilunia-violet-light',
  },
  {
    icon: Sparkles,
    title: 'Pièces & Cadeaux',
    desc: 'Économie virtuelle transparente',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    icon: Gamepad2,
    title: 'Jeux en ligne',
    desc: 'Ludo, Quiz, Échecs entre profils',
    color: 'from-emerald-400 to-teal-400',
  },
  {
    icon: Mic2,
    title: 'Salons vocaux',
    desc: 'Chat en direct avec des centaines',
    color: 'from-hilunia-rose to-hilunia-coral',
  },
  {
    icon: Camera,
    title: 'Moments',
    desc: 'Partagez votre quotidien authentique',
    color: 'from-pink-400 to-rose-400',
  },
]

const steps = [
  {
    num: '1',
    title: 'Crée ton profil',
    desc: 'Inscription gratuite en 2 minutes. Photo, préférences, vérification.',
  },
  {
    num: '2',
    title: 'Découvre des profils',
    desc: 'Algorithme intelligent qui te propose des profils compatibles du monde entier.',
  },
  {
    num: '3',
    title: 'Connecte & discute',
    desc: 'Match, échange des messages, offre des cadeaux, rejoins des salons vocaux.',
  },
]

const stats = [
  { value: '100k+', label: 'Membres actifs' },
  { value: '150+', label: 'Pays représentés' },
  { value: '4.8/5', label: 'Note moyenne' },
  { value: '24/7', label: 'Modération' },
]

const trustItems = [
  'Vérification selfie obligatoire pour les échanges sensibles',
  'Signalement et blocage en un clic',
  'Modération humaine et IA en continu',
  'Données chiffrées et conformes RGPD',
  'Aucun profil fictif — uniquement de vraies personnes',
  'Support disponible en 5 langues',
]

const languages = [
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
]

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-hilunia-bg-dark overflow-x-hidden">
      {/* ─── HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-hilunia-border/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-hilunia flex items-center justify-center shadow-glow-violet">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">HILUNIA</span>
          </motion.div>

          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hidden md:flex items-center gap-6"
          >
            {['Fonctionnalités', 'Sécurité', 'Premium'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-hilunia-text-muted hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Link
              href="/login"
              className="hidden sm:block text-sm font-medium text-hilunia-text-muted hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-hilunia-surface"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="btn-primary text-sm py-2 px-4"
            >
              S&apos;inscrire
            </Link>
          </motion.div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-hilunia-violet/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-hilunia-rose/20 rounded-full blur-[100px] animate-float [animation-delay:1.5s]" />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-hilunia-coral/10 rounded-full blur-[80px] animate-float [animation-delay:3s]" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(124,92,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,92,255,0.5) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-hilunia-violet/30 mb-8"
          >
            <Sparkles className="w-4 h-4 text-hilunia-violet" />
            <span className="text-sm font-medium text-hilunia-text-muted">
              🌍 Disponible dans 150+ pays · Lancement mondial
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display font-black text-5xl sm:text-7xl md:text-8xl leading-none mb-6"
          >
            <span className="text-white">Connecte-toi</span>
            <br />
            <span className="text-gradient">avec le monde</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-hilunia-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            La rencontre et l&apos;amitié réinventées. Authentique, sécurisé, mondial.
            Rencontre des personnes réelles, partage des moments, et vive des expériences inoubliables.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/register"
              className="group btn-primary text-lg py-4 px-8 w-full sm:w-auto"
            >
              <span>Créer un compte gratuit</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="btn-secondary text-lg py-4 px-8 w-full sm:w-auto"
            >
              Déjà inscrit(e) ?
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-sm text-hilunia-text-dim flex items-center justify-center gap-2"
          >
            <Shield className="w-4 h-4 text-hilunia-violet" />
            Inscription gratuite · 18 ans minimum · Données protégées RGPD
          </motion.p>

          {/* Floating preview cards */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="relative mt-16 mx-auto max-w-xs"
          >
            {/* Phone frame */}
            <div className="relative mx-auto w-64 h-[500px]">
              <div className="absolute inset-0 bg-hilunia-surface rounded-[3rem] border border-hilunia-border shadow-hilunia-lg overflow-hidden">
                {/* Status bar */}
                <div className="h-8 bg-hilunia-surface-2 flex items-center justify-center">
                  <div className="w-24 h-4 bg-hilunia-border rounded-full" />
                </div>
                {/* Card preview */}
                <div className="relative h-80 overflow-hidden">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, #7C5CFF 0%, #FF4FA3 60%, #FF7A6B 100%)',
                    }}
                  />
                  <div className="absolute inset-0 card-overlay" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-white text-lg">Sofia, 24</span>
                      <div className="w-3 h-3 bg-emerald-400 rounded-full border border-white" />
                    </div>
                    <div className="flex items-center gap-1 text-white/80 text-sm">
                      <Globe className="w-3 h-3" />
                      <span>Paris, France · 2 km</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {['✈️ Voyage', '🎵 Musique', '📸 Photo'].map(tag => (
                        <span key={tag} className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center justify-center gap-6 p-4">
                  <div className="w-12 h-12 rounded-full bg-hilunia-surface-2 flex items-center justify-center border border-hilunia-border shadow-card">
                    <span className="text-xl">✕</span>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-gradient-hilunia flex items-center justify-center shadow-glow-violet">
                    <Heart className="w-7 h-7 text-white fill-white" />
                  </div>
                  <div className="w-12 h-12 rounded-full bg-hilunia-surface-2 flex items-center justify-center border border-hilunia-border shadow-card">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -left-16 top-20 glass rounded-2xl p-3 border border-hilunia-border shadow-card"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-hilunia flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Nouveau match!</div>
                  <div className="text-[10px] text-hilunia-text-muted">Karim t&apos;a liké</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-12 bottom-32 glass rounded-2xl p-3 border border-hilunia-border shadow-card"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌹</span>
                <div>
                  <div className="text-xs font-semibold text-white">Cadeau reçu!</div>
                  <div className="text-[10px] text-hilunia-violet">10 pièces</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-16 border-y border-hilunia-border/50">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeIn}
                className="text-center"
              >
                <div className="font-display font-black text-4xl text-gradient mb-1">{s.value}</div>
                <div className="text-sm text-hilunia-text-muted">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── FONCTIONNALITÉS ─── */}
      <section id="fonctionnalités" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-hilunia-violet text-sm font-semibold uppercase tracking-wider">Fonctionnalités</span>
            <h2 className="font-display font-black text-4xl md:text-5xl mt-2 mb-4">
              Tout ce dont tu as<br />
              <span className="text-gradient">besoin pour connecter</span>
            </h2>
            <p className="text-hilunia-text-muted max-w-xl mx-auto">
              Hilunia combines les meilleures fonctionnalités des apps de rencontre, de réseaux sociaux et de jeux.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeIn}
                className="card hover:border-hilunia-violet/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-card`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-white mb-2">{f.title}</h3>
                <p className="text-sm text-hilunia-text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── COMMENT ÇA MARCHE ─── */}
      <section className="py-24 bg-hilunia-surface/30">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-hilunia-rose text-sm font-semibold uppercase tracking-wider">Simple & rapide</span>
            <h2 className="font-display font-black text-4xl md:text-5xl mt-2">
              Comment ça<br />
              <span className="text-gradient">marche ?</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-6 card"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-hilunia flex items-center justify-center font-display font-black text-xl text-white shadow-glow-violet">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white mb-1">{s.title}</h3>
                  <p className="text-hilunia-text-muted">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SÉCURITÉ ─── */}
      <section id="sécurité" className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-hilunia-violet text-sm font-semibold uppercase tracking-wider">Sécurité</span>
              <h2 className="font-display font-black text-4xl md:text-5xl mt-2 mb-6">
                Votre sécurité<br />
                <span className="text-gradient">notre priorité</span>
              </h2>
              <p className="text-hilunia-text-muted mb-8 leading-relaxed">
                Nous avons conçu Hilunia pour éliminer les faux profils, les arnaques et le harcèlement.
                Chaque mesure de sécurité a été pensée pour te protéger.
              </p>
              <ul className="space-y-3">
                {trustItems.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-hilunia-violet/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-hilunia-violet" />
                    </div>
                    <span className="text-sm text-hilunia-text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="card border-gradient-hilunia p-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-hilunia flex items-center justify-center mb-6 shadow-glow-violet mx-auto">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-bold text-2xl text-center mb-4 text-gradient">
                  Vérification Selfie
                </h3>
                <p className="text-center text-hilunia-text-muted text-sm mb-6">
                  Pour débloquer les échanges de contacts et les fonctionnalités sensibles,
                  une vérification selfie rapide est requise. Cela garantit que chaque profil est une vraie personne.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Selfie en temps réel', 'Détection vivant', 'Traitement privé'].map(tag => (
                    <span key={tag} className="text-xs bg-hilunia-violet/20 text-hilunia-violet px-3 py-1 rounded-full font-medium">
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── LANGUES ─── */}
      <section className="py-16 border-y border-hilunia-border/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-hilunia-text-muted text-sm mb-6">Disponible en 5 langues dès le lancement</p>
            <div className="flex flex-wrap gap-4 justify-center">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className="flex items-center gap-2 glass rounded-2xl px-4 py-2 border border-hilunia-border"
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-sm font-medium text-white">{lang.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative card border-gradient-hilunia p-12 overflow-hidden">
              <div className="absolute inset-0 bg-hilunia-gradient-soft" />
              <div className="relative">
                <div className="flex items-center justify-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <h2 className="font-display font-black text-4xl md:text-5xl mb-4">
                  Prêt(e) à{' '}
                  <span className="text-gradient">connecter ?</span>
                </h2>
                <p className="text-hilunia-text-muted mb-8">
                  Rejoins des milliers de personnes qui ont déjà trouvé leurs meilleures connexions sur Hilunia.
                  Inscription gratuite, sans carte bancaire.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/register"
                    className="group btn-primary text-lg py-4 px-10"
                  >
                    <span>Commencer gratuitement</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <p className="mt-4 text-sm text-hilunia-text-dim flex items-center justify-center gap-4">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    100k+ membres
                  </span>
                  <span>·</span>
                  <span>18 ans minimum</span>
                  <span>·</span>
                  <span>100% gratuit</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 border-t border-hilunia-border/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-hilunia flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="font-display font-bold text-xl text-gradient">HILUNIA</span>
              </div>
              <p className="text-sm text-hilunia-text-muted">
                La rencontre mondiale authentique et sécurisée.
              </p>
            </div>
            {[
              {
                title: 'Produit',
                links: ['Fonctionnalités', 'Premium VIP', 'Jeux', 'Salons vocaux'],
              },
              {
                title: 'Légal',
                links: ['CGU', 'Confidentialité', 'Cookies', 'Mentions légales'],
              },
              {
                title: 'Support',
                links: ['FAQ', 'Contact', 'Sécurité', 'Signalement'],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-hilunia-text-muted hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-hilunia-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-hilunia-text-dim">
              © 2025 Hilunia. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className="text-sm text-hilunia-text-muted hover:text-white transition-colors"
                >
                  {lang.flag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
