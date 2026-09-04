import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { Beaker, Check, Mail, Lock, User, GraduationCap, Phone, MapPin } from 'lucide-react';

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentClass, setStudentClass] = useState('12');
  const [board, setBoard] = useState('CBSE');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, userData } = useAuth();

  // If already logged in, redirect
  React.useEffect(() => {
    if (user && userData) {
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, userData, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;
        
        // Update auth profile
        await updateProfile(newUser, {
          displayName: fullName
        });

        // Save detailed profile to Firestore
        const adminUids = ['xsFI63Hy5jUkwFtQnjqThM9ZwGx1', 'cxsFI63Hy5jU', 'GOv6NaBAVJOFNUIgFRSc7FXmf7v1'];
        const isHardcodedAdmin = newUser.email === 'yasisrivastava1@gmail.com' || adminUids.includes(newUser.uid);
        
        const role: UserRole = isHardcodedAdmin ? 'admin' : 'student';
        
        await setDoc(doc(db, 'users', newUser.uid), {
          role,
          displayName: fullName,
          email: newUser.email,
          phone,
          studentClass,
          board,
          createdAt: serverTimestamp(),
          status: 'active',
          lastLogin: serverTimestamp(),
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user doc exists, if not, create it
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        const adminUids = ['xsFI63Hy5jUkwFtQnjqThM9ZwGx1', 'cxsFI63Hy5jU', 'GOv6NaBAVJOFNUIgFRSc7FXmf7v1'];
        const isHardcodedAdmin = result.user.email === 'yasisrivastava1@gmail.com' || adminUids.includes(result.user.uid);
        const role: UserRole = isHardcodedAdmin ? 'admin' : 'student';
        
        await setDoc(userRef, {
          role,
          displayName: result.user.displayName || 'Student',
          email: result.user.email,
          createdAt: serverTimestamp(),
          status: 'active',
          lastLogin: serverTimestamp(),
          // Default values for Google Sign-in since we don't have the form data
          studentClass: '12',
          board: 'CBSE',
        });
      }
      
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Left Panel - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-5/12 bg-blue-600 flex-col justify-between p-12 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/50 blur-3xl" />
          <div className="absolute bottom-[10%] -left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-500/50 blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 backdrop-blur rounded-xl mb-6 shadow-sm border border-white/20">
            <Beaker className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter uppercase leading-none drop-shadow-sm mb-2">
            Piyush Chemistry
          </h1>
          <div className="text-xl font-bold tracking-[0.4em] uppercase text-blue-200">
            Hub
          </div>
          <div className="mt-5 text-white font-bold text-2xl tracking-wide leading-tight">
            Master chemistry with <span className="text-blue-300">Piyush Srivastava</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm font-semibold text-blue-50">Free previous year question paper</span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm font-semibold text-blue-50">Notes</span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-sm font-semibold text-blue-50">Question bank</span>
            <span className="px-3 py-1 bg-gradient-to-r from-blue-500/50 to-indigo-500/50 border border-blue-400/30 rounded-lg text-sm font-semibold text-white shadow-sm">CBSE and ISC all board exam preparation</span>
          </div>
          <p className="mt-6 text-blue-100 text-lg font-medium max-w-md leading-relaxed">
            Your ultimate destination for comprehensive exam preparation.
          </p>

          <div className="mt-10 space-y-4">
            {[
              'Free Previous Year Question Papers',
              'Comprehensive Notes & Study Material',
              'Extensive Question Bank & Worksheets',
              'CBSE, ICSE, ISC & All Board Exam Prep'
            ].map((feature, i) => (
              <div key={i} className="flex items-center text-blue-50">
                <div className="h-6 w-6 rounded-full bg-blue-500/50 flex items-center justify-center mr-3 border border-blue-400/30">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-md shadow-xl">
          <h3 className="text-white font-bold mb-2 flex items-center text-lg">
            Need help?
          </h3>
          <p className="text-blue-100 text-sm mb-5">Directly contact us on WhatsApp for quick assistance regarding batches, notes, or registration.</p>
          <a 
            href="https://wa.me/918563975583" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon />
            Contact on WhatsApp
          </a>

          <div className="mt-6 pt-5 border-t border-white/20">
            <h4 className="text-white font-semibold text-sm mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" /> Offline Center
            </h4>
            <p className="text-blue-100 text-xs leading-relaxed">
              Police Line, Subhash Nagar<br/>
              (Near Neelam Beauty Parlour)
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-7/12 flex flex-col p-6 sm:p-12 lg:px-24 overflow-y-auto relative bg-white">
        {/* Mobile Branding */}
        <div className="lg:hidden text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-xl mb-4 shadow-sm">
            <Beaker className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter uppercase leading-none drop-shadow-sm">
            Piyush Chemistry
          </h2>
          <div className="text-center text-sm font-bold tracking-[0.4em] uppercase text-indigo-400 mt-2">
            Hub
          </div>
          <div className="mt-4 text-slate-900 font-bold text-lg px-2 leading-tight">
            Master chemistry with <span className="text-blue-600">Piyush Srivastava</span>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5 px-2">
            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">Free previous year question paper</span>
            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">Notes</span>
            <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700">Question bank</span>
            <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-bold text-blue-700">CBSE and ISC all board exam preparation</span>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto my-auto flex flex-col">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{isLogin ? 'Sign In' : 'Create an account'}</h2>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              {isLogin ? 'Enter your details to access your dashboard.' : 'Join Piyush Chemistry Hub to access premium study materials.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-xl flex items-start">
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-600">{error}</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Mobile Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="1234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Class</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GraduationCap className="h-4 w-4 text-slate-400" />
                      </div>
                      <select
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
                      >
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Board</label>
                    <select
                      value={board}
                      onChange={(e) => setBoard(e.target.value)}
                      className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow bg-white"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="ISC">ISC</option>
                      <option value="Other">Other</option>
                      <option value="All">All Board Examinations</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase font-bold tracking-wider">
                <span className="px-3 bg-white text-slate-400">Or continue with</span>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>

          {/* Mobile WhatsApp Contact */}
          <div className="lg:hidden mt-10 pt-8 border-t border-slate-100 w-full text-center">
            <p className="text-sm text-slate-500 font-medium mb-4">Have questions? Contact on WhatsApp</p>
            <a 
              href="https://wa.me/918563975583" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl transition-colors shadow-sm mb-6"
            >
              <WhatsAppIcon />
              Chat on WhatsApp
            </a>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-left">
              <h4 className="text-slate-800 font-bold text-xs uppercase tracking-wider mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1.5 text-blue-500" /> Offline Center
              </h4>
              <p className="text-slate-600 text-sm font-medium">
                Police Line, Subhash Nagar
              </p>
              <p className="text-slate-500 text-xs mt-0.5">
                (Near Neelam Beauty Parlour)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
