import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCheckCircle, 
  FiClock, 
  FiCalendar, 
  FiTrendingUp, 
  FiTarget, 
  FiBarChart2,
  FiChevronDown,
  FiMenu,
  FiX,
  FiStar,
  FiArrowRight,
  FiPlayCircle
} from 'react-icons/fi';

// --- MOCK DATA ---

const STATS = [
  { id: 1, value: "100k+", label: "Étudiants actifs" },
  { id: 2, value: "2M+", label: "Tâches terminées" },
  { id: 3, value: "12h", label: "Gagnées par mois" },
  { id: 4, value: "4.9/5", label: "Note moyenne" }
];

const FEATURES = [
  {
    id: 1,
    icon: <FiCalendar className="w-6 h-6" />,
    title: "Planning Intelligent",
    desc: "Générez un emploi du temps optimisé en un clic selon votre charge de travail et vos pics d'énergie."
  },
  {
    id: 2,
    icon: <FiClock className="w-6 h-6" />,
    title: "Rappel des Deadlines",
    desc: "Ne manquez plus aucun rendu d'exposé ou de devoir grâce aux alertes proactives personnalisables."
  },
  {
    id: 3,
    icon: <FiTrendingUp className="w-6 h-6" />,
    title: "Suivi des Progrès",
    desc: "Visualisez votre avancée dans vos révisions et identifiez les matières nécessitant plus d'attention."
  },
  {
    id: 4,
    icon: <FiTarget className="w-6 h-6" />,
    title: "Priorisation Automatique",
    desc: "L'algorithme de StudyPlanner classe vos tâches de la plus urgente à la moins importante."
  },
  {
    id: 5,
    icon: <FiCheckCircle className="w-6 h-6" />,
    title: "Gestion des Tâches",
    desc: "Découpez vos gros projets en petites sous-tâches simples et obtenez des victoires quotidiennes."
  },
  {
    id: 6,
    icon: <FiBarChart2 className="w-6 h-6" />,
    title: "Analytics Académiques",
    desc: "Analysez votre temps d'étude par matière et ajustez vos efforts pour valider vos partiels."
  }
];

const STEPS = [
  {
    id: 1,
    number: "01",
    title: "Créez votre profil",
    desc: "Ajoutez vos matières, vos objectifs de notes et vos périodes d'examens."
  },
  {
    id: 2,
    number: "02",
    title: "Laissez la magie opérer",
    desc: "Notre système génère un calendrier de révisions sur-mesure et équilibré."
  },
  {
    id: 3,
    number: "03",
    title: "Étudiez sereinement",
    desc: "Suivez le guide au quotidien, validez vos tâches et observez vos notes grimper."
  }
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Léa Dubois",
    role: "Étudiante en Médecine (PASS)",
    text: "StudyPlanner a sauvé mon année. Je ne savais plus où donner de la tête avec la masse de cours, maintenant tout est organisé jour par jour.",
    avatar: "https://i.pravatar.cc/150?u=1"
  },
  {
    id: 2,
    name: "Thomas Bernard",
    role: "Master 2 Droit",
    text: "La fonction de priorisation est incroyable. C'est comme avoir un coach dans sa poche qui me dit exactement quoi réviser ce matin.",
    avatar: "https://i.pravatar.cc/150?u=2"
  },
  {
    id: 3,
    name: "Sarah Khella",
    role: "Licence d'Informatique",
    text: "J'ai gagné au moins 2h par jour d'organisation. L'interface est super fluide et magnifique, un vrai plaisir à utiliser tous les jours.",
    avatar: "https://i.pravatar.cc/150?u=3"
  }
];

const FAQS = [
  {
    question: "Est-ce que StudyPlanner est gratuit ?",
    answer: "Nous proposons un plan gratuit à vie incluant toutes les fonctionnalités de base (calendrier, to-do list). Les plans Premium offrent des statistiques avancées et l'IA."
  },
  {
    question: "Puis-je synchroniser mon emploi du temps d'université ?",
    answer: "Oui ! Vous pouvez importer votre emploi du temps via un lien iCal (.ics) fourni par la scolarité de votre université ou école."
  },
  {
    question: "Sur quels appareils puis-je l'utiliser ?",
    answer: "StudyPlanner est disponible sur navigateur web, et possède une application mobile dédiée pour iOS et Android afin de recevoir vos rappels hors de chez vous."
  },
  {
    question: "Comment fonctionne l'algorithme de priorisation ?",
    answer: "Notre IA prend en compte la date de rendu, le coefficient de la matière, et la charge de travail estimée pour vous dire sur quoi vous concentrer aujourd'hui."
  }
];

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Gérer le background de la navbar au scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar 
        isScrolled={isScrolled} 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function Navbar({ isScrolled, mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <FiCheckCircle className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">
            Study<span className="text-indigo-600">Planner</span>
          </span>
        </div>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8">
          {['Fonctionnalités', 'Comment ça marche', 'Tarifs', 'FAQ'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              {item}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
            Se connecter
          </Link>
          <Link to="/register" className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-full hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300">
            Commencer
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-slate-600"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-slate-100 py-4 px-4 flex flex-col gap-4">
          {['Fonctionnalités', 'Comment ça marche', 'Tarifs', 'FAQ'].map((item) => (
            <a key={item} href={`#${item}`} className="text-base font-medium text-slate-600 p-2">
              {item}
            </a>
          ))}
          <hr className="border-slate-100" />
          <div className="flex flex-col gap-2">
            <Link to="/login" className="w-full py-3 text-center text-slate-600 font-medium border border-slate-200 rounded-xl block">
              Se connecter
            </Link>
            <button className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/30">
              Commencer gratuitement
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center min-h-[90vh]">
      {/* Decorative Blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-20 left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              Planification intelligente pour étudiants
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Maîtrisez votre temps, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
                Excelez dans vos études.
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed">
              Le premier agenda intelligent conçu spécifiquement pour les étudiants. Transformez vos montagnes de révisions en petites tâches quotidiennes réalisables.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                Commencer gratuitement
                <FiArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 flex items-center justify-center gap-2">
                <FiPlayCircle className="w-5 h-5 text-slate-400" />
                Voir la démo
              </button>
            </div>
          </div>

          {/* Visual Mockup */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-full lg:h-[600px] perspective-1000">
            {/* Main App Card */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-blue-50 rounded-[2.5rem] transform rotate-3 scale-105 border border-white/50 shadow-inner"></div>
            
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/60 p-6 rounded-3xl shadow-2xl shadow-indigo-500/10 h-full flex flex-col gap-4 transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Header Mock */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <div className="text-sm text-slate-500 font-medium">Aujourd'hui</div>
                  <div className="text-lg font-bold">Lundi 14 Mars</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  JS
                </div>
              </div>

              {/* Task Cards Mock */}
              <div className="flex flex-col gap-3 mt-2">
                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-300 transition-colors cursor-pointer group flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full border-2 border-indigo-400 flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">Réviser Chapitre 4 : Physiologie</h4>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                      <FiClock className="w-3 h-3"/> 09:00 - 11:30
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 opacity-70">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-1 text-white">
                    <FiCheckCircle className="w-4 h-4"/>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-400 line-through">Rendu DM Mathématiques</h4>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded mt-2 inline-block">Terminé</span>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-indigo-600 to-blue-500 rounded-2xl shadow-lg shadow-indigo-500/20 text-white flex items-start gap-4 transform scale-[1.02] -ml-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 border-2 border-white flex-shrink-0 mt-1"></div>
                  <div>
                    <h4 className="font-semibold text-white">Partiel Blanc de Droit Pénal</h4>
                    <p className="text-sm text-indigo-100 mt-1 flex items-center gap-2">
                      <FiClock className="w-3 h-3"/> 14:00 - 17:00
                    </p>
                    <div className="mt-3 w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-white w-1/3 h-full rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-12 bg-white relative z-20 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
          {STATS.map((stat) => (
            <div key={stat.id} className="text-center px-4">
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">
                {stat.value}
              </div>
              <div className="mt-1 text-sm font-medium text-slate-500">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="py-24 bg-slate-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Fonctionnalités embarquées</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Tout ce qu'il vous faut pour majorer.</h3>
          <p className="text-lg text-slate-600">
            Fini les plannings papiers brouillons et les applis trop compliquées. StudyPlanner concentre uniquement les outils essentiels à votre réussite.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature) => (
            <div 
              key={feature.id} 
              className="group bg-white p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
              <p className="text-slate-600 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Étudiez moins, étudiez mieux.</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">La méthode StudyPlanner en 3 étapes simples pour reprendre le contrôle de votre semestre.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Ligne de connexion entre les étapes (visible sur desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-300 to-indigo-100 z-0"></div>

          {STEPS.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-xl shadow-indigo-500/10 flex items-center justify-center mb-6 relative group overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-full"></div>
                <span className="text-3xl font-black text-indigo-600 group-hover:text-white relative z-10 transition-colors duration-300">
                  {step.number}
                </span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
              <p className="text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden" id="testimonials">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm mb-3">Ils ont validé leur année</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Approuvé par des milliers d'étudiants.</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((col) => (
            <div key={col.id} className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700 hover:bg-slate-800 transition-colors">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="text-amber-400 fill-amber-400 w-5 h-5"/>
                ))}
              </div>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                "{col.text}"
              </p>
              <div className="flex items-center gap-4">
                <img src={col.avatar} alt={col.name} className="w-12 h-12 rounded-full border-2 border-indigo-500/50" />
                <div>
                  <h5 className="font-bold text-white">{col.name}</h5>
                  <p className="text-sm text-slate-400">{col.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 bg-slate-50" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Questions Fréquentes</h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-indigo-200 shadow-md shadow-indigo-100/50' : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <button 
                  className="w-full flex justify-between items-center p-6 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className={`font-semibold text-lg ${isOpen ? 'text-indigo-600' : 'text-slate-800'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex justify-center items-center flex-shrink-0 transition-transform duration-300 ${isOpen ? 'bg-indigo-50 text-indigo-600 rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                    <FiChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <div 
                  className={`px-6 text-slate-600 transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 py-0 opacity-0'
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-indigo-500/30">
          
          {/* Cercle déco */}
          <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Prêt à booster votre moyenne ?
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Rejoignez plus de 100 000 étudiants qui ont déjà transformé leur façon de travailler. Inscription gratuite, pas de carte bleue requise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                Créer un compte gratuit
              </button>
            </div>
            <p className="mt-6 text-sm text-indigo-200">
              ⚡ Installation en moins de 2 minutes
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center">
                <FiCheckCircle className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-slate-900">
                StudyPlanner
              </span>
            </div>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              L'outil de productivité absolu pour les étudiants exigeants. Planifiez, révisez, majorez.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Produit</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Tarifs</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Témoignages</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Changelog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Ressources</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Blog étudiant</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Méthodologie</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Centre d'aide</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Templates gratuits</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Légal</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">CGU</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Mentions Légales</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} StudyPlanner. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            <span className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 cursor-pointer transition-colors">in</span>
            <span className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 cursor-pointer transition-colors">tw</span>
            <span className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 hover:bg-indigo-100 hover:text-indigo-600 cursor-pointer transition-colors">ig</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
