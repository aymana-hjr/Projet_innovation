import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../services/analyticsService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiClock, FiCheckCircle, FiTarget, FiTrendingUp, FiActivity, FiLayers, FiZap } from 'react-icons/fi';

export default function Analytics() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [subjectData, setSubjectData] = useState([]);
  const [productivityData, setProductivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sum, subj, prod] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getSubjectProgress(),
          analyticsService.getWeeklyProductivity()
        ]);
        setSummary(sum);
        setSubjectData(subj);
        setProductivityData(prod);
      } catch (err) {
        console.error("Erreur stats:", err);
      } finally {
        setTimeout(() => setLoading(false), 800); // Petit délai pour laisser l'animation respirer
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#105652', '#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6'];

  if (loading) return (
    <div className="min-h-screen bg-[#FDFCF7] flex flex-col items-center justify-center gap-6">
       <motion.div 
         animate={{ rotate: 360 }} 
         transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
         className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-600 rounded-full"
       />
       <p className="text-emerald-900 font-bold tracking-widest uppercase text-xs animate-pulse">Intelligence Analytique en cours...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFCF7] relative overflow-hidden font-sans">
      
      {/* ── Background Décoratif ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-2 text-slate-500 hover:text-emerald-700 font-bold transition-all mb-4"
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <FiArrowLeft className="w-4 h-4" />
              </div>
              <span className="text-sm">Retour à l'espace de travail</span>
            </button>
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
              Analyse de <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Productivité</span>
            </h1>
          </div>
          
          <div className="bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/80 shadow-sm inline-flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
               <FiActivity />
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Statut Global</p>
               <p className="font-bold text-emerald-900">Performance Active</p>
             </div>
          </div>
        </motion.div>

        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PremiumCard 
            title="Temps Étudié" 
            value={`${summary?.totalHours || 0}h`} 
            trend="+12% vs semaine passée"
            icon={<FiClock />} 
            color="from-teal-500 to-emerald-600" 
            delay={0.1}
          />
          <PremiumCard 
            title="Taux de Complétion" 
            value={`${summary?.completionRate || 0}%`} 
            trend="Objectif en vue"
            icon={<FiTarget />} 
            color="from-blue-500 to-indigo-600" 
            delay={0.2}
          />
          <PremiumCard 
            title="Missions Finies" 
            value={summary?.completedSessions || 0} 
            trend="Productivité accrue"
            icon={<FiCheckCircle />} 
            color="from-emerald-400 to-teal-500" 
            delay={0.3}
          />
          <PremiumCard 
            title="Sujet Leader" 
            value={subjectData[0]?.subject || "N/A"} 
            trend="Focus principal"
            icon={<FiLayers />} 
            color="from-amber-400 to-orange-500" 
            delay={0.4}
          />
        </div>

        {/* ── Charts Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Chart 1: Subject Progress */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 backdrop-blur-xl p-10 rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] border border-white"
          >
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Répartition par Matière</h3>
               <FiZap className="text-amber-500 w-6 h-6 animate-pulse" />
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#105652" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#2D6A4F" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '15px'}} />
                  <Bar dataKey="minutes" radius={[12, 12, 12, 12]} barSize={40}>
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Chart 2: Weekly Productivity */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-[#105652] p-10 rounded-[48px] shadow-[0_32px_64px_-12px_rgba(16,86,82,0.3)] text-white relative overflow-hidden"
          >
            {/* Décoration interne */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
               <h3 className="text-xl font-black tracking-tight">Courbe de Performance</h3>
               <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-300 border border-white/10">7 Derniers Jours</div>
            </div>
            
            <div className="h-[350px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productivityData}>
                  <defs>
                    <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#A7C4B5', fontSize: 11}} dy={10} />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', color: '#105652'}} itemStyle={{color: '#105652'}} />
                  <Area type="monotone" dataKey="minutes" stroke="#10b981" strokeWidth={5} fillOpacity={1} fill="url(#colorProd)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

function PremiumCard({ title, value, trend, icon, color, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5 }}
      className="bg-white group p-8 rounded-[36px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white text-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 mb-2">{title}</p>
        <div className="flex items-baseline gap-2">
           <p className="text-3xl font-black text-slate-900 leading-none tracking-tight">{value}</p>
        </div>
        <p className="text-[10px] font-bold text-emerald-600 mt-4 flex items-center gap-1">
           <FiTrendingUp className="w-3 h-3" /> {trend}
        </p>
      </div>
    </motion.div>
  );
}
