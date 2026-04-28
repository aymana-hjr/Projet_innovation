import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiCheckCircle, 
  FiLoader,
  FiArrowLeft,
  FiUser
} from 'react-icons/fi';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Validation email basique
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear errors on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setGlobalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = { fullName: '', email: '', password: '', confirmPassword: '' };

    if (!formData.fullName) {
      newErrors.fullName = 'Le nom complet est requis.';
      hasErrors = true;
    }

    if (!formData.email) {
      newErrors.email = 'L\'adresse email est requise.';
      hasErrors = true;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide.';
      hasErrors = true;
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis.';
      hasErrors = true;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
      hasErrors = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setGlobalError('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Une erreur est survenue lors de l\'inscription.');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Si l'API renvoie un token direct après l'inscription
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/'); // Rediriger vers l'accueil ou le tableau de bord une fois le compte créé
      }, 1500);

    } catch (err) {
      setGlobalError(err.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.fullName !== '' && formData.email !== '' && formData.password !== '' && formData.confirmPassword !== '' && !Object.values(errors).some(e => e !== '');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-300 mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-blue-300 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-purple-300 mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-5xl w-full bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-white/50 animate-in fade-in zoom-in duration-700">
        
        {/* Left Side - Visual/Branding */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-indigo-600 to-purple-600 p-12 text-white flex flex-col justify-between relative overflow-hidden order-2 md:order-1">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <FiCheckCircle className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">StudyPlanner</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
              Rejoignez-nous! <br /> Organisez vos études.
            </h2>
            <p className="text-indigo-100 text-lg">
              Créez votre compte gratuitement et laissez l'IA planifier votre emploi du temps et optimiser vos révisions.
            </p>
          </div>

          <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <FiUser className="w-5 h-5 text-indigo-50" />
              </div>
              <div>
                <p className="font-bold text-white mb-1">Plus de 10k étudiants</p>
                <p className="text-sm text-indigo-100">Ont déjà amélioré leurs notes grâce à notre outil intelligent.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full md:w-7/12 p-8 md:p-14 lg:p-20 flex flex-col justify-center order-1 md:order-2">
          
          <Link to="/" className="text-slate-400 hover:text-indigo-600 transition-colors mb-8 flex items-center gap-2 w-fit">
            <FiArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour à l'accueil</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">Créer un compte ✨</h1>
            <p className="text-slate-500 text-lg">Remplissez le formulaire ci-dessous pour commencer.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {globalError && (
              <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 rounded-2xl text-sm flex items-center gap-3 animate-in slide-in-from-top-2">
                <FiCheckCircle className="w-5 h-5 flex-shrink-0 rotate-45" />
                <span>{globalError}</span>
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200 text-emerald-600 rounded-2xl text-sm flex items-center gap-3 animate-in slide-in-from-top-2">
                <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Inscription réussie ! Redirection...</span>
              </div>
            )}

            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="fullName">
                Nom complet
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <FiUser className="w-5 h-5" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  disabled={isLoading || success}
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${errors.fullName ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 disabled:opacity-50`}
                  placeholder="Jean Dupont"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-500 font-medium animate-in slide-in-from-top-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="email">
                Adresse Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <FiMail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  disabled={isLoading || success}
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 disabled:opacity-50`}
                  placeholder="nom@universite.edu"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 font-medium animate-in slide-in-from-top-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="password">
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLoading || success}
                    className={`w-full pl-11 pr-12 py-3.5 bg-slate-50 border ${errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 disabled:opacity-50`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || success}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none disabled:opacity-50"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500 font-medium animate-in slide-in-from-top-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="confirmPassword">
                  Confirmer le mot passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLoading || success}
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'} rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all duration-300 disabled:opacity-50`}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-500 font-medium animate-in slide-in-from-top-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || success || (!isFormValid && (formData.email !== '' || formData.password !== '' || formData.fullName !== '' || formData.confirmPassword !== '')) }
              className={`w-full py-4 mt-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                isLoading || success
                  ? 'bg-indigo-400 cursor-not-allowed shadow-none'
                  : !isFormValid && (formData.email !== '' || formData.password !== '' || formData.fullName !== '' || formData.confirmPassword !== '')
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-indigo-500/30'
              }`}
            >
              {isLoading ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  <span>Inscription en cours...</span>
                </>
              ) : success ? (
                <>
                  <FiCheckCircle className="w-5 h-5" />
                  <span>Inscrit !</span>
                </>
              ) : (
                <span>Créer mon compte</span>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Déjà inscrit sur StudyPlanner ?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
